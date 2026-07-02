import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { getSupabase } from '@/lib/supabase';
import type {
  AIContextExtraction,
  AIExtractResponse,
  InflowCatalogItem,
} from '@/lib/inflow-types';

type ExtractRequestBody = {
  chatId?: string;
  businessId?: string;
  transcript?: string;
};

type LegacyToolId = 'invoice' | 'booked' | 'quote' | 'promo' | null;

type LegacyResponse = {
  tool: LegacyToolId;
  prefill: Record<string, unknown>;
  confidence: number;
};

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = 'gemini-2.5-flash';
const MESSAGE_HISTORY_LIMIT = 20;

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedIntent: {
      type: Type.STRING,
      enum: ['invoice', 'booking', 'quote', 'promo', 'none'],
    },
    customerInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, nullable: true },
        phone: { type: Type.STRING, nullable: true },
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
              item: { type: Type.STRING },
              price: { type: Type.NUMBER },
              quantity: { type: Type.NUMBER },
            },
            required: ['item', 'price', 'quantity'],
          },
        },
        currency: { type: Type.STRING },
      },
      required: ['lineItems', 'currency'],
    },
    bookingDetails: {
      type: Type.OBJECT,
      properties: {
        requestedDate: { type: Type.STRING, nullable: true },
        requestedTimeSlot: { type: Type.STRING, nullable: true },
        serviceType: { type: Type.STRING, nullable: true },
      },
      required: ['requestedDate', 'requestedTimeSlot', 'serviceType'],
    },
  },
  required: ['detectedIntent', 'customerInfo', 'invoiceDetails', 'bookingDetails'],
};

function emptyExtraction(): AIContextExtraction {
  return {
    detectedIntent: 'none',
    customerInfo: {
      name: null,
      phone: null,
    },
    invoiceDetails: {
      lineItems: [],
      currency: 'ZAR',
    },
    bookingDetails: {
      requestedDate: null,
      requestedTimeSlot: null,
      serviceType: null,
    },
  };
}

function fallbackFromTranscript(transcript: string): AIContextExtraction {
  const extraction = emptyExtraction();
  const text = transcript.toLowerCase();

  const bookingPattern = /(book|booking|appointment|slot|schedule|reschedule)/;
  const quotePattern = /(quote|estimate|pricing|price estimate)/;
  const invoicePattern = /(invoice|bill|payment|pay now|amount due)/;
  const promoPattern = /(promo|discount|voucher|special|deal)/;

  if (bookingPattern.test(text)) {
    extraction.detectedIntent = 'booking';
  } else if (quotePattern.test(text)) {
    extraction.detectedIntent = 'quote';
  } else if (invoicePattern.test(text)) {
    extraction.detectedIntent = 'invoice';
  } else if (promoPattern.test(text)) {
    extraction.detectedIntent = 'promo';
  }

  const moneyMatches = transcript.match(/(?:R|ZAR\s?)(\d+(?:\.\d{1,2})?)/gi) ?? [];
  if (moneyMatches.length > 0) {
    extraction.invoiceDetails.lineItems = moneyMatches.map((match, index) => {
      const numeric = Number.parseFloat(match.replace(/[^\d.]/g, ''));
      return {
        item: `Detected item ${index + 1}`,
        price: Number.isFinite(numeric) ? numeric : 0,
        quantity: 1,
      };
    });
  }

  const timeMatch = transcript.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (timeMatch) {
    extraction.bookingDetails.requestedTimeSlot = `${timeMatch[1]}:${timeMatch[2]}`;
  }

  const dateMatch = transcript.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (dateMatch) {
    extraction.bookingDetails.requestedDate = dateMatch[1];
  }

  return extraction;
}

function buildSystemInstruction(catalogItems: InflowCatalogItem[]): string {
  const catalogList =
    catalogItems.length > 0
      ? catalogItems
          .map((item) => `- ${item.name} (R${item.price}${item.description ? `, ${item.description}` : ''})`)
          .join('\n')
      : '(No catalog configured yet)';

  return `You are Dock's AI extraction engine.

Return ONLY valid JSON matching the response schema.
Infer the merchant intent from the conversation.
Use these intents: invoice, booking, quote, promo, none.
Never invent customer details.
Prefer catalog prices when matching line items.
Resolve relative dates to ISO format when possible.

Live catalog:
${catalogList}`;
}

function mapLegacyResponse(extraction: AIContextExtraction): LegacyResponse {
  const intentMap: Record<AIContextExtraction['detectedIntent'], LegacyToolId> = {
    invoice: 'invoice',
    booking: 'booked',
    quote: 'quote',
    promo: 'promo',
    none: null,
  };

  const selectedItems = extraction.invoiceDetails.lineItems.map((line) => ({
    item: line.item,
    quantity: line.quantity,
    price: line.price,
  }));

  if (extraction.detectedIntent === 'booking') {
    return {
      tool: 'booked',
      prefill: {
        suggestedDate: extraction.bookingDetails.requestedDate,
        suggestedSlot: extraction.bookingDetails.requestedTimeSlot,
        serviceType: extraction.bookingDetails.serviceType,
      },
      confidence: 0.86,
    };
  }

  if (extraction.detectedIntent === 'quote' || extraction.detectedIntent === 'invoice') {
    return {
      tool: intentMap[extraction.detectedIntent],
      prefill: {
        selectedItems,
        currency: extraction.invoiceDetails.currency,
      },
      confidence: selectedItems.length > 0 ? 0.9 : 0.74,
    };
  }

  if (extraction.detectedIntent === 'promo') {
    return {
      tool: 'promo',
      prefill: {},
      confidence: 0.7,
    };
  }

  return {
    tool: null,
    prefill: {},
    confidence: 0.5,
  };
}

async function buildTranscript(body: ExtractRequestBody): Promise<string | null> {
  if (body.transcript && body.transcript.trim()) {
    return body.transcript.trim();
  }

  if (!body.chatId) {
    return null;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('messages')
    .select('sender, body, created_at')
    .eq('chat_id', body.chatId)
    .order('created_at', { ascending: false })
    .limit(MESSAGE_HISTORY_LIMIT);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data
    .slice()
    .reverse()
    .map((message) => `${message.sender === 'business' ? 'Business' : 'Customer'}: ${message.body}`)
    .join('\n');
}

async function fetchCatalog(businessId?: string): Promise<InflowCatalogItem[]> {
  if (!businessId) {
    return [];
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('inflow_items_catalog')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as InflowCatalogItem[];
}

function matchCatalogItems(extraction: AIContextExtraction, catalog: InflowCatalogItem[]) {
  const normalizedLineItems = extraction.invoiceDetails.lineItems.map((line) => line.item.toLowerCase());

  return catalog.filter((item) => {
    const name = item.name.toLowerCase();
    return normalizedLineItems.some((line) => line.includes(name) || name.includes(line));
  });
}

export async function POST(request: NextRequest) {
  let body: ExtractRequestBody;
  try {
    body = (await request.json()) as ExtractRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const transcript = await buildTranscript(body);
  const safeTranscript = transcript ?? body.transcript?.trim() ?? '';

  if (!safeTranscript) {
    const extraction = emptyExtraction();
    const legacy = mapLegacyResponse(extraction);
    const payload: AIExtractResponse & LegacyResponse = {
      extraction,
      matchedCatalogItems: [],
      tool: legacy.tool,
      prefill: legacy.prefill,
      confidence: legacy.confidence,
    };
    return NextResponse.json(payload, { status: 200 });
  }

  try {
    const catalog = await fetchCatalog(body.businessId);

    if (!ai) {
      const extraction = fallbackFromTranscript(safeTranscript);
      const matchedCatalogItems = matchCatalogItems(extraction, catalog);
      const legacy = mapLegacyResponse(extraction);

      const payload: AIExtractResponse & LegacyResponse = {
        extraction,
        matchedCatalogItems,
        tool: legacy.tool,
        prefill: legacy.prefill,
        confidence: Math.max(0.55, legacy.confidence - 0.1),
      };

      return NextResponse.json(payload, { status: 200 });
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Chat transcript:\n${safeTranscript}`,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: EXTRACTION_SCHEMA,
        systemInstruction: buildSystemInstruction(catalog),
      },
    });

    const raw = response.text?.trim();
    if (!raw) {
      return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 502 });
    }

    let extraction: AIContextExtraction;
    try {
      extraction = JSON.parse(raw) as AIContextExtraction;
    } catch {
      extraction = emptyExtraction();
    }

    const matchedCatalogItems = matchCatalogItems(extraction, catalog);
    const legacy = mapLegacyResponse(extraction);

    const payload: AIExtractResponse & LegacyResponse = {
      extraction,
      matchedCatalogItems,
      tool: legacy.tool,
      prefill: legacy.prefill,
      confidence: legacy.confidence,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('[ai/extract] unexpected error:', error);

    const catalog = await fetchCatalog(body.businessId);
    const extraction = fallbackFromTranscript(safeTranscript);
    const matchedCatalogItems = matchCatalogItems(extraction, catalog);
    const legacy = mapLegacyResponse(extraction);

    const payload: AIExtractResponse & LegacyResponse = {
      extraction,
      matchedCatalogItems,
      tool: legacy.tool,
      prefill: legacy.prefill,
      confidence: Math.max(0.55, legacy.confidence - 0.1),
    };

    return NextResponse.json(payload, { status: 200 });
  }
}
