import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sanitizeText, sanitizePhoneNumber } from '@/lib/sanitize';
import { WhatsAppWebhookSchema, FacebookWebhookSchema, InstagramWebhookSchema } from '@/lib/validation';
import { verifyMetaWebhookSignature, shouldBypassAuthForMeta } from '@/lib/auth';

/**
 * GET /api/webhook
 * Meta webhook verification handshake
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

function normalizeId(value: string): string {
  return sanitizeText(value).trim();
}

async function handleChatRecord(chatId: string, name: string, messageText: string) {
  const supabase = getSupabase();

  const { error: upsertError } = await supabase.from('chats').upsert(
    {
      id: chatId,
      name: name || chatId,
      last_message: messageText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (upsertError) {
    console.error('[Webhook] Chat upsert error:', upsertError);
    return { status: 'db_error', code: 500 } as const;
  }

  const { error: insertError } = await supabase.from('messages').insert({
    chat_id: chatId,
    sender: 'customer',
    body: messageText,
  });

  if (insertError) {
    console.error('[Webhook] Message insert error:', insertError);
    return { status: 'db_error', code: 500 } as const;
  }

  return { status: 'ok', code: 200 } as const;
}

async function handleWhatsAppWebhook(body: unknown) {
  const validationResult = WhatsAppWebhookSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('[Webhook] WhatsApp validation error:', validationResult.error);
    return { status: 'invalid_payload', code: 400 } as const;
  }

  const entries = validationResult.data.entry ?? [];
  if (entries.length === 0) {
    return { status: 'no_entries', code: 200 } as const;
  }

  const change = entries[0].changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];
  if (!message || message.type !== 'text' || !message.text?.body) {
    return { status: 'ignored_type', code: 200 } as const;
  }

  const fromPhone = sanitizePhoneNumber(message.from);
  if (!fromPhone || fromPhone.length < 10) {
    console.error('[Webhook] Invalid phone number:', message.from);
    return { status: 'invalid_phone', code: 400 } as const;
  }

  const messageText = sanitizeText(message.text.body);
  if (!messageText) {
    console.error('[Webhook] Message text empty after sanitization');
    return { status: 'empty_message', code: 400 } as const;
  }

  let contactName = fromPhone;
  if (value?.contacts?.[0]?.profile?.name) {
    contactName = sanitizeText(value.contacts[0].profile.name).substring(0, 255) || fromPhone;
  }

  return handleChatRecord(fromPhone, contactName, messageText);
}

async function handleFacebookWebhook(body: unknown) {
  const validationResult = FacebookWebhookSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('[Webhook] Facebook validation error:', validationResult.error);
    return { status: 'invalid_payload', code: 400 } as const;
  }

  const entries = validationResult.data.entry ?? [];
  if (entries.length === 0) {
    return { status: 'no_entries', code: 200 } as const;
  }

  for (const entry of entries) {
    for (const messaging of entry.messaging ?? []) {
      const senderId = normalizeId(messaging.sender.id);
      const messageText = sanitizeText(messaging.message?.text ?? '');
      if (!senderId || !messageText) {
        continue;
      }
      const result = await handleChatRecord(senderId, senderId, messageText);
      if (result.code !== 200) {
        return result;
      }
    }
  }

  return { status: 'ok', code: 200 } as const;
}

async function handleInstagramWebhook(body: unknown) {
  const validationResult = InstagramWebhookSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('[Webhook] Instagram validation error:', validationResult.error);
    return { status: 'invalid_payload', code: 400 } as const;
  }

  const entries = validationResult.data.entry ?? [];
  if (entries.length === 0) {
    return { status: 'no_entries', code: 200 } as const;
  }

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      for (const message of change.value.messages ?? []) {
        const senderId = normalizeId(message.from);
        const messageText = sanitizeText(message.text ?? '');
        if (!senderId || !messageText) {
          continue;
        }
        const result = await handleChatRecord(senderId, senderId, messageText);
        if (result.code !== 200) {
          return result;
        }
      }
    }
  }

  return { status: 'ok', code: 200 } as const;
}

/**
 * POST /api/webhook
 * Receives incoming Meta messaging events for WhatsApp, Facebook, and Instagram.
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.META_WEBHOOK_SECRET || process.env.META_APP_SECRET;
    if (!secret) {
      console.error('[Webhook] Missing webhook secret');
      return NextResponse.json({ status: 'error' }, { status: 500 });
    }

    const rawBody = await request.text();

    if (!shouldBypassAuthForMeta(request)) {
      const isValid = await verifyMetaWebhookSignature(request, rawBody, secret);
      if (!isValid) {
        console.error('[Webhook] Invalid signature');
        return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
      }
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('[Webhook] JSON parse error:', parseError);
      return NextResponse.json({ status: 'invalid_json' }, { status: 400 });
    }

    const objectType = typeof body === 'object' && body !== null && 'object' in body ? (body as any).object : undefined;

    let result;
    if (objectType === 'page') {
      result = await handleFacebookWebhook(body);
    } else if (objectType === 'instagram') {
      result = await handleInstagramWebhook(body);
    } else {
      result = await handleWhatsAppWebhook(body);
    }

    return NextResponse.json({ status: result.status }, { status: result.code });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
