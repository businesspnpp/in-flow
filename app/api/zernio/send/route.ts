import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSessionFromRequest } from '@/lib/auth';
import { sendZernioInboxMessage } from '@/lib/zernio';

function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server configuration is missing');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const user = await getSessionFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { business_id, chat_id, message } = await request.json().catch(() => ({}));
  const businessId = asString(business_id);
  const chatId = asString(chat_id);
  const body = asString(message);

  if (!businessId || !chatId || !body) {
    return NextResponse.json({ error: 'Missing business_id, chat_id, or message.' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { data: businessById } = await supabase
    .from('businesses')
    .select('id, email')
    .eq('id', user.id)
    .maybeSingle();

  const business = businessById ?? (await supabase
    .from('businesses')
    .select('id, email')
    .eq('email', user.email ?? '')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()).data;

  if (!business || business.id !== businessId) {
    return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
  }

  const { data: chat } = await supabase
    .from('chats')
    .select('id, channel, provider_conversation_id')
    .eq('id', chatId)
    .maybeSingle();

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  const channel = asString((chat as { channel?: string | null }).channel);
  const providerConversationId = asString((chat as { provider_conversation_id?: string | null }).provider_conversation_id) || chatId.split(':').slice(1).join(':');

  if (!channel || !providerConversationId) {
    return NextResponse.json({ error: 'Missing provider conversation mapping.' }, { status: 400 });
  }

  const { data: configs } = await supabase
    .from('channel_configs')
    .select('metadata')
    .eq('business_id', businessId)
    .eq('channel', channel)
    .maybeSingle();

  const accountId = asString((configs?.metadata as Record<string, unknown> | null | undefined)?.zernio_account_id);
  if (!accountId) {
    return NextResponse.json({ error: 'Missing connected account mapping.' }, { status: 400 });
  }

  const sent = await sendZernioInboxMessage({
    conversationId: providerConversationId,
    accountId,
    message: body,
  });

  const { error: insertError } = await supabase.from('messages').insert({
    chat_id: chatId,
    channel,
    provider_message_id: sent?.messageId ?? null,
    sender: 'business',
    body,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to save message.' }, { status: 500 });
  }

  await supabase
    .from('chats')
    .update({
      last_message: body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', chatId);

  return NextResponse.json({ ok: true, sent });
}