import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeText, sanitizePhoneNumber } from '@/lib/sanitize';

type ZernioWebhookEvent = {
  id?: string;
  event?: string;
  timestamp?: string;
  message?: Record<string, unknown>;
  conversation?: Record<string, unknown>;
  account?: Record<string, unknown>;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server configuration is missing');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function firstString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function normalizeChannel(value: unknown) {
  const channel = typeof value === 'string' ? value.toLowerCase() : '';
  if (['whatsapp', 'facebook', 'instagram', 'telegram'].includes(channel)) return channel;
  return '';
}

function resolveChannel(event: ZernioWebhookEvent) {
  return normalizeChannel(
    firstString(
      event.account?.platform,
      event.conversation?.platform,
      event.message?.platform,
      event.platform
    )
  );
}

function resolveConversationId(event: ZernioWebhookEvent, fallbackChannel: string, fallbackSenderId: string) {
  return firstString(
    event.conversation?.id,
    event.conversation?.conversationId,
    event.message?.conversationId,
    fallbackChannel && fallbackSenderId ? `${fallbackChannel}:${fallbackSenderId}` : ''
  );
}

function resolveSenderId(event: ZernioWebhookEvent) {
  const messageSender = asObject(event.message?.sender);
  const conversationSender = asObject(event.conversation?.sender);
  return firstString(
    messageSender?.id,
    messageSender?.platformId,
    conversationSender?.id,
    conversationSender?.platformId,
    event.message?.senderId,
    event.conversation?.contactId,
    event.conversation?.participantId
  );
}

function resolveSenderName(event: ZernioWebhookEvent) {
  const messageSender = asObject(event.message?.sender);
  const conversationSender = asObject(event.conversation?.sender);
  return firstString(
    messageSender?.name,
    conversationSender?.name,
    event.message?.senderName,
    event.conversation?.contactName
  ) || null;
}

function resolveMessageText(event: ZernioWebhookEvent) {
  return firstString(
    event.message?.text,
    event.message?.body,
    event.message?.content,
    event.message?.caption
  );
}

function getWebhookSecret() {
  return process.env.ZERNIO_WEBHOOK_SECRET || '';
}

async function verifySignature(request: NextRequest, rawBody: string) {
  const secret = getWebhookSecret();
  if (!secret) return true;

  const signature = request.headers.get('x-zernio-signature') || request.headers.get('x-late-signature');
  if (!signature) return false;

  const computed = createHmac('sha256', secret).update(rawBody).digest('hex');
  return signature === computed;
}

async function persistInbound(businessId: string, event: ZernioWebhookEvent) {
  const channel = resolveChannel(event);
  const senderId = resolveSenderId(event);
  const messageText = resolveMessageText(event);
  const conversationId = resolveConversationId(event, channel, senderId);
  const accountId = firstString(event.account?.id, event.account?.accountId);

  if (!businessId || !channel || !senderId || !messageText) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const chatId = conversationId || `${channel}:${senderId}`;
  const senderName = resolveSenderName(event);
  const body = `[${channel.toUpperCase()}] ${sanitizeText(messageText)}`;
  const name = senderName ? sanitizeText(senderName) : senderId;

  await supabase.from('chats').upsert(
    {
      id: chatId,
      name,
      channel,
      provider_conversation_id: conversationId || null,
      provider_account_id: accountId || null,
      last_message: body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  await supabase.from('messages').insert({
    chat_id: chatId,
    channel,
    provider_message_id: firstString(event.message?.id, event.id),
    sender: 'customer',
    body,
  });
}

export async function POST(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id') || '';
  if (!businessId) {
    return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });
  }

  const rawBody = await request.text();
  if (!(await verifySignature(request, rawBody))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: ZernioWebhookEvent;
  try {
    payload = JSON.parse(rawBody) as ZernioWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventId = firstString(payload.id, request.headers.get('x-zernio-event-id'), request.headers.get('x-late-event-id'));
  const eventType = firstString(payload.event);

  if (eventId) {
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase.from('zernio_webhook_events').insert({
      event_id: eventId,
      business_id: businessId,
      event_type: eventType || 'unknown',
      payload,
    });

    if (insertError && insertError.code === '23505') {
      return NextResponse.json({ status: 'duplicate' }, { status: 200 });
    }
  }

  if (eventType === 'message.received') {
    try {
      await persistInbound(businessId, payload);
    } catch (error) {
      console.error('[zernio/webhook] persist failed:', error);
      return NextResponse.json({ error: 'Failed to persist message' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 });
}