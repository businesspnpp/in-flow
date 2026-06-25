// inFlow — AI Context Extraction API Route (Gemini 2.5 Flash)
// Path: app/api/ai/extract/route.ts  ← lives alongside your existing
// app/api/{auth,facebook,instagram,ping,webhook,whatsapp}/ folders
//
// On-demand ONLY. No polling, no background workers. This route is hit
// exactly once per dashboard tool click (Invoice/Quote/BookedIt/Promo),
// pulling the last 15 messages of the target chat and asking Gemini
// 2.5 Flash to extract structured data via Structured Outputs.
// ════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { getSupabase } from '@/lib/supabase';
import type {
  AIContextExtraction,
  AIExtractRequestBody,
  AIExtractResponse,
  InflowCatalogItem,
} from '@/lib/inflow-types';

// ───────────────────────────────────────────────────────────────────────
// Gemini client — instantiated once per cold start, reused across
// invocations within the same serverless instance.
// ───────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  // Don't throw at module scope in a way that crashes the whole route
  // file on import — log loudly instead, and fail per-request below.
  console.error(
    '[inflow:ai/extract] GEMINI_API_KEY is not set. Set it in your environment before using AI extraction.'
  );
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const MODEL = 'gemini-2.5-flash';
const MESSAGE_HISTORY_LIMIT = 15;

// ───────────────────────────────────────────────────────────────────────
// Structured Output schema — enforced by Gemini via responseSchema.
// Mirrors AIContextExtraction in lib/types/inflow.ts exactly.
// ───────────────────────────────────────────────────────────────────────

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedIntent: {
      type: Type.STRING,
      enum: ['invoice', 'booking', 'quote', 'promo', 'none'],
      description:
        'The single most likely action the business owner wants to take based on the conversation.',
    },
    customerInfo: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          nullable: true,
          description: "The customer's first name if mentioned anywhere in the thread, else null.",
        },
        phone: {
          type: Type.STRING,
          nullable: true,
          description: 'A phone number if explicitly shared in the conversation, else null.',
        },
      },
      required: ['name', 'phone'],
    },
    invoiceDetails: {
      type: Type.OBJECT,
      properties: {
        lineItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING, description: 'Name of the service or product mentioned.' },
              price: { type: Type.NUMBER, description: 'Price in the detected currency, numeric only.' },
              quantity: { type: Type.NUMBER, description: 'Quantity requested, default 1.' },
            },
            required: ['item', 'price', 'quantity'],
          },
        },
        currency: {
          type: Type.STRING,
          description: 'ISO-ish currency label, default to "ZAR" for South African Rand.',
        },
      },
      required: ['lineItems', 'currency'],
    },
    bookingDetails: {
      type: Type.OBJECT,
      properties: {
        requestedDate: {
          type: Type.STRING,
          nullable: true,
          description: 'ISO YYYY-MM-DD date if a specific date can be inferred from relative terms like "next Tuesday", else null.',
        },
        requestedTimeSlot: {
          type: Type.STRING,
          nullable: true,
          description: 'A time or time-of-day phrase such as "afternoon" or "14:00", else null.',
        },
        serviceType: {
          type: Type.STRING,
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
// System prompt
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
  if (!ai) {
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

    // 1. Fetch the last 15 messages for this chat thread (newest first, then reverse to chronological)
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

    // 2. Fetch this business's active catalog so the AI can cross-reference items
    const { data: catalogItems, error: catalogError } = await supabase
      .from('inflow_items_catalog')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catalogError) {
      // Non-fatal — proceed without catalog cross-referencing rather than failing the whole request
      console.warn('[inflow:ai/extract] Failed to fetch catalog, proceeding without it:', catalogError);
    }

    const activeCatalog: InflowCatalogItem[] = catalogItems ?? [];

    // 3. Build the transcript for the model
    const transcript = chronological
      .map((m) => `${m.sender === 'business' ? 'Business' : 'Customer'}: ${m.body}`)
      .join('\n');

    // 4. Call Gemini 2.5 Flash with Structured Outputs
    const response = await ai.models.generateContent({
      model: MODEL,
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
      config: {
        systemInstruction: buildSystemInstruction(activeCatalog),
        responseMimeType: 'application/json',
        responseSchema: EXTRACTION_SCHEMA,
        temperature: 0.1,
      },
    });

    const rawText = response.text;
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

    // 5. Cross-reference matched catalog items by fuzzy name containment
    //    (cheap heuristic; Gemini already tried to match names against the
    //    catalog in its own output, this just surfaces the full catalog
    //    rows for any line item whose name overlaps with a catalog entry)
    const matchedCatalogItems = activeCatalog.filter((catalogItem) =>
      extraction.invoiceDetails.lineItems.some((line) => {
        const a = line.item.toLowerCase();
        const b = catalogItem.name.toLowerCase();
        return a.includes(b) || b.includes(a);
      })
    );

    const result: AIExtractResponse = {
      extraction,
      matchedCatalogItems,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[inflow:ai/extract] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error during AI context extraction.' },
      { status: 500 }
    );
  }
}
