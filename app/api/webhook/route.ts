import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sanitizeText, sanitizePhoneNumber } from '@/lib/sanitize';
import { WhatsAppWebhookSchema } from '@/lib/validation';
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

/**
 * POST /api/webhook
 * Receives incoming WhatsApp messages from Meta
 * Validates webhook signature and sanitizes all inputs
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature for authenticity
    const secret = process.env.META_WEBHOOK_SECRET || process.env.META_APP_SECRET;
    if (!secret) {
      console.error('[Webhook] Missing webhook secret');
      return NextResponse.json({ status: 'error' }, { status: 500 });
    }

    // Skip signature verification only in Meta review mode for staging
    if (!shouldBypassAuthForMeta(request)) {
      const isValid = await verifyMetaWebhookSignature(request, secret);
      if (!isValid) {
        console.error('[Webhook] Invalid signature');
        return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
      }
    }

    // Parse and validate the webhook payload
    const body = await request.json();

    // Validate against schema
    const validationResult = WhatsAppWebhookSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('[Webhook] Validation error:', validationResult.error);
      return NextResponse.json({ status: 'invalid_payload' }, { status: 400 });
    }

    const entries = validationResult.data.entry;
    if (!entries || entries.length === 0) {
      return NextResponse.json({ status: 'no_entries' }, { status: 200 });
    }

    const entry = entries[0];
    const changes = entry?.changes;
    if (!changes || changes.length === 0) {
      return NextResponse.json({ status: 'no_changes' }, { status: 200 });
    }

    const change = changes[0];
    const value = change?.value;
    if (!value || !value.messages) {
      return NextResponse.json({ status: 'no_messages' }, { status: 200 });
    }

    const message = value.messages[0];
    if (!message) {
      return NextResponse.json({ status: 'no_message' }, { status: 200 });
    }

    // Only process text messages
    if (message.type !== 'text' || !message.text?.body) {
      return NextResponse.json({ status: 'ignored_type' }, { status: 200 });
    }

    // Sanitize and validate inputs
    const fromPhone = sanitizePhoneNumber(message.from);
    if (!fromPhone || fromPhone.length < 10) {
      console.error('[Webhook] Invalid phone number:', message.from);
      return NextResponse.json({ status: 'invalid_phone' }, { status: 400 });
    }

    // Sanitize message text - remove HTML, scripts, control characters
    const messageText = sanitizeText(message.text.body);
    if (!messageText) {
      console.error('[Webhook] Message text empty after sanitization');
      return NextResponse.json({ status: 'empty_message' }, { status: 400 });
    }

    // Sanitize contact name
    let contactName = message.from; // fallback to phone number
    if (value?.contacts?.[0]?.profile?.name) {
      contactName = sanitizeText(value.contacts[0].profile.name).substring(0, 255);
    }

    const supabase = getSupabase();

    // Upsert chat profile using Supabase parameterized query
    const { error: upsertError } = await supabase.from('chats').upsert(
      {
        id: fromPhone,
        name: contactName,
        last_message: messageText,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (upsertError) {
      console.error('[Webhook] Upsert error:', upsertError);
      return NextResponse.json({ status: 'db_error' }, { status: 500 });
    }

    // Insert new message record using Supabase parameterized query
    const { error: insertError } = await supabase.from('messages').insert({
      chat_id: fromPhone,
      sender: 'customer',
      body: messageText,
    });

    if (insertError) {
      console.error('[Webhook] Insert error:', insertError);
      return NextResponse.json({ status: 'db_error' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
