import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sanitizePhoneNumber, sanitizeText } from '@/lib/sanitize';
import { shouldBypassAuthForMeta, verifyMetaWebhookSignature } from '@/lib/auth';

type Channel = 'whatsapp' | 'facebook' | 'instagram';

type NormalizedInbound = {
  channel: Channel;
  senderId: string;
  senderName: string | null;
  messageText: string;
};

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function parseWhatsAppPayload(body: Record<string, unknown>): NormalizedInbound[] {
  const entry = asArray(body.entry)[0];
  const change = asArray(asObject(entry)?.changes)[0];
  const value = asObject(asObject(change)?.value);
  const message = asArray(value?.messages)[0];

  if (!message || typeof message !== 'object') return [];

  const msg = message as Record<string, unknown>;
  const textBody = asObject(msg.text)?.body;
  if (typeof textBody !== 'string' || !textBody.trim()) return [];

  const phone = sanitizePhoneNumber(String(msg.from ?? ''));
  if (!phone) return [];

  const contact = asArray(value?.contacts)[0];
  const contactName = asObject(asObject(contact)?.profile)?.name;

  return [
    {
      channel: 'whatsapp',
      senderId: phone,
      senderName: typeof contactName === 'string' ? sanitizeText(contactName) : null,
      messageText: sanitizeText(textBody),
    },
  ];
}

function parseMessengerPayload(body: Record<string, unknown>, forceInstagram = false): NormalizedInbound[] {
  const entry = asArray(body.entry)[0];
  const messagingEvent = asArray(asObject(entry)?.messaging)[0];
  const event = asObject(messagingEvent);

  if (!event) return [];

  const sender = asObject(event.sender);
  const senderIdRaw = sender?.id;
  if (typeof senderIdRaw !== 'string' || !senderIdRaw.trim()) return [];

  const message = asObject(event.message);
  const text = message?.text;
  if (typeof text !== 'string' || !text.trim()) return [];

  const isInstagram =
    forceInstagram ||
    body.object === 'instagram' ||
    typeof asObject(event.recipient)?.id === 'string' && String(asObject(event.recipient)?.id).startsWith('1784');

  return [
    {
      channel: isInstagram ? 'instagram' : 'facebook',
      senderId: sanitizeText(senderIdRaw),
      senderName: null,
      messageText: sanitizeText(text),
    },
  ];
}

async function persistInbound(event: NormalizedInbound) {
  const supabase = getSupabase();
  const chatId = `${event.channel}:${event.senderId}`;
  const unifiedMessage = `[${event.channel.toUpperCase()}] ${event.messageText}`;

  const { error: chatError } = await supabase.from('chats').upsert(
    {
      id: chatId,
      name: event.senderName || event.senderId,
      channel: event.channel,
      last_message: unifiedMessage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (chatError) {
    throw chatError;
  }

  const { error: messageError } = await supabase.from('messages').insert({
    chat_id: chatId,
    channel: event.channel,
    sender: 'customer',
    body: unifiedMessage,
  });

  if (messageError) {
    throw messageError;
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');

  if (!mode || !token || !challenge) {
    return new NextResponse('Missing challenge fields', { status: 400 });
  }

  if (mode !== 'subscribe' || token !== process.env.META_VERIFY_TOKEN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.META_WEBHOOK_SECRET || process.env.META_APP_SECRET;

  const rawBody = await request.text();

  if (webhookSecret && !shouldBypassAuthForMeta(request)) {
    const isValid = await verifyMetaWebhookSignature(request, rawBody, webhookSecret);
    if (!isValid) {
      return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: 'invalid_json' }, { status: 400 });
  }

  const firstEntry = asObject(asArray(body.entry)[0]);
  const firstChange = asObject(asArray(firstEntry?.changes)[0]);
  const firstChangeValue = asObject(firstChange?.value);
  const messagingEvents = asArray(firstEntry?.messaging);

  const hasWhatsAppShape = asArray(firstChangeValue?.messages).length > 0;
  const hasMessengerShape = messagingEvents.length > 0;

  const normalized: NormalizedInbound[] = [];

  if (hasWhatsAppShape) {
    normalized.push(...parseWhatsAppPayload(body));
  }

  if (hasMessengerShape) {
    normalized.push(...parseMessengerPayload(body, body.object === 'instagram'));
  }

  if (normalized.length === 0) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }

  try {
    await Promise.all(normalized.map((item) => persistInbound(item)));
    return NextResponse.json({ status: 'ok', processed: normalized.length }, { status: 200 });
  } catch (error) {
    console.error('[webhooks/meta] Persist error:', error);
    return NextResponse.json({ status: 'db_error' }, { status: 500 });
  }
}
