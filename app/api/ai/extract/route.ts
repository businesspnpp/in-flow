// app/api/ai/extract/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getSupabase } from '@/lib/supabase';
import type {
  AIContextExtraction,
  AIExtractRequestBody,
  AIExtractResponse,
  InflowCatalogItem,
} from '@/lib/inflow-types';

// ───────────────────────────────────────────────────────────────────────
// Gemini client — instantiated once per cold start
// ───────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    '[inflow:ai/extract] GEMINI_API_KEY is not set. Set it in your environment before using AI extraction.'
  );
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const MODEL = 'gemini-2.0-flash'; // Updated to current model name
const MESSAGE_HISTORY_LIMIT = 15;

// ───────────────────────────────────────────────────────────────────────
// Structured Output schema — enforced by Gemini via responseSchema
// ───────────────────────────────────────────────────────────────────────

const EXTRACTION_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    detectedIntent: {
      type: SchemaType.STRING,
      enum: ['invoice', 'booking', 'quote', 'promo', 'none'],
      description:
        'The single most likely action the business owner wants to take based on the conversation.',
    },
    customerInfo: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          nullable: true,
          description: "The customer's first name if mentioned anywhere in the thread, else null.",
        },
        phone: {
          type: SchemaType.STRING,
          nullable: true,
          description: 'A phone number if explicitly shared in the conversation, else null.',
        },
      },
      required: ['name', 'phone'],
    },
    invoiceDetails: {
      type: SchemaType.OBJECT,
      properties: {
        lineItems: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              item: { type: SchemaType.STRING, description: 'Name of the service or product mentioned.' },
              price: { type: SchemaType.NUMBER, description: 'Price in the detected currency, numeric only.' },
              quantity: { type: SchemaType.NUMBER, description: 'Quantity requested, default 1.' },
            },
            required: ['item', 'price', 'quantity'],
          },
        },
        currency: {
          type: SchemaType.STRING,
          description: 'ISO-ish currency label, default to "ZAR" for South African Rand.',
        },
      },
      required: ['lineItems', 'currency'],
    },
    bookingDetails: {
      type: SchemaType.OBJECT,
      properties: {
        requestedDate: {
          type: SchemaType.STRING,
          nullable: true,
          description: 'ISO YYYY-MM-DD date if a specific date can be inferred from relative terms like "next Tuesday", else null.',
        },
        requestedTimeSlot: {
          type: SchemaType.STRING,
          nullable: true,
          description: 'A time or time-of-day phrase such as "afternoon" or "14:00", else null.',
        },
        serviceType: {
          type: SchemaType.STRING,
          nullable: true,
          description: 'The service or appointment type being discussed, else null.',
        },
      },
      required: ['requestedDate', 'requestedTimeSlot', 'serviceType'],
    },
  },
  required: ['detectedIntent', 'customerInfo', 'invoiceDetails', 'bookingDetails'],
};

// ───────────────────────────────────────────────────────────────────────
// System prompt builder
// ───────────────────────────────────────────────────────────────────────

function buildSystemInstruction(catalogItems: InflowCatalogItem[]): string {
  const catalogList =
    catalogItems.length > 0
      ? catalogItems
          .map((c) => `- ${c.name} (R${c.price}${c.description ? ` — ${c.description}` : ''})`)
          .join('\n')
      : '(No catalog items configured for this business yet.)';

  return `You are the background context engine for the inFlow SaaS platform, used by South African small businesses.

Your job is to analyze the provided chat history between a business and a customer and extract structured data to pre-fill a tool form (Invoice, Quote, BookedIt, or Promo). Today's date context should be used to resolve relative dates like "next Tuesday" or "tomorrow" into ISO YYYY-MM-DD format where possible.

Cross-reference any items, services, or products the customer mentions against this business's actual catalog below. Prefer matching the customer's wording to the closest catalog entry and use the CATALOG price, not a guessed price, whenever there's a reasonable match:

${catalogList}

Rules:
- Default currency is "ZAR" (South African Rand) unless another currency is explicitly mentioned.
- If no clear commercial or booking intent exists in the conversation, set detectedIntent to "none" and leave the relevant detail fields empty/null.
- Never invent a customer name or phone number that was not actually written in the chat.
- Keep lineItems empty if no items/services were discussed.
- Quantity defaults to 1 if not specified.`;
}

// ───────────────────────────────────────────────────────────────────────
// POST /api/ai/extract
// ───────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!genAI) {
    return NextResponse.json(
      { error: 'AI extraction is not configured on this server (missing GEMINI_API_KEY).' },
      { status: 503 }
    );
  }

  let body: AIExtractRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { chatId, businessId } = body;

  if (!chatId || !businessId) {
    return NextResponse.json(
      { error: 'Both chatId and businessId are required.' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    // 1. Fetch the last 15 messages for this chat thread
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('sender, body, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(MESSAGE_HISTORY_LIMIT);

    if (messagesError) {
      console.error('[inflow:ai/extract] Failed to fetch messages:', messagesError);
      return NextResponse.json({ error: 'Failed to load chat history.' }, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found in this chat to analyze.' },
        { status: 404 }
      );
    }

    const chronological = [...messages].reverse();

    // 2. Fetch this business's active catalog
    const { data: catalogItems, error: catalogError } = await supabase
      .from('inflow_items_catalog')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catalogError) {
      console.warn('[inflow:ai/extract] Failed to fetch catalog, proceeding without it:', catalogError);
    }

    const activeCatalog: InflowCatalogItem[] = catalogItems ?? [];

    // 3. Build the transcript for the model
    const transcript = chronological
      .map((m) => `${m.sender === 'business' ? 'Business' : 'Customer'}: ${m.body}`)
      .join('\n');

    // 4. Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: EXTRACTION_SCHEMA,
      },
      systemInstruction: buildSystemInstruction(activeCatalog),
    });

    // 5. Call Gemini with Structured Outputs
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Chat transcript (oldest to newest):\n\n${transcript}\n\nExtract the structured data now.`,
            },
          ],
        },
      ],
    });

    const response = result.response;
    const rawText = response.text();
    
    if (!rawText) {
      console.error('[inflow:ai/extract] Gemini returned an empty response.');
      return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 502 });
    }

    let extraction: AIContextExtraction;
    try {
      extraction = JSON.parse(rawText) as AIContextExtraction;
    } catch (parseErr) {
      console.error('[inflow:ai/extract] Failed to parse Gemini JSON output:', parseErr, rawText);
      return NextResponse.json(
        { error: 'AI returned malformed JSON despite structured output enforcement.' },
        { status: 502 }
      );
    }

    // 6. Cross-reference matched catalog items
    const matchedCatalogItems = activeCatalog.filter((catalogItem) =>
      extraction.invoiceDetails.lineItems.some((line) => {
        const a = line.item.toLowerCase();
        const b = catalogItem.name.toLowerCase();
        return a.includes(b) || b.includes(a);
      })
    );

    const resultData: AIExtractResponse = {
      extraction,
      matchedCatalogItems,
    };

    return NextResponse.json(resultData, { status: 200 });
  } catch (err) {
    console.error('[inflow:ai/extract] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error during AI context extraction.' },
      { status: 500 }
    );
  }
}
