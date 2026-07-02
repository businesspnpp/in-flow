import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSessionFromRequest } from '@/lib/auth';
import { getZernioInboxConversationMessages, listZernioInboxConversations } from '@/lib/zernio';

const SUPPORTED_CHANNELS = ['whatsapp', 'facebook', 'instagram', 'telegram'] as const;

type ChannelConfigRow = {
  channel: string;
  metadata?: Record<string, unknown> | null;
};

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

function normalizeBody(message: { message?: string; text?: string; subject?: string; caption?: string }) {
  return asString(message.message) || asString(message.text) || asString(message.subject) || asString(message.caption);
}

function conversationChatId(platform: string, conversationId: string) {
  return `${platform}:${conversationId}`;
}

export async function POST(request: NextRequest) {
  const user = await getSessionFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  if (!business) {
    return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
  }

  const channelFilter = request.nextUrl.searchParams.get('channel') ?? '';
  const channels = SUPPORTED_CHANNELS.filter((channel) => !channelFilter || channel === channelFilter);

  const { data: configs } = await supabase
    .from('channel_configs')
    .select('channel, metadata')
    .eq('business_id', business.id)
    .in('channel', channels);

  const relevantConfigs = (configs ?? []) as ChannelConfigRow[];
  let syncedConversations = 0;
  let syncedMessages = 0;

  for (const config of relevantConfigs) {
    const metadata = config.metadata ?? {};
    const accountId = asString(metadata.zernio_account_id);
    const profileId = asString(metadata.zernio_profile_id);
    const platform = config.channel;

    if (!accountId && !profileId) {
      continue;
    }

    const conversationsResult = await listZernioInboxConversations({
      accountId: accountId || undefined,
      profileId: profileId || undefined,
      platform,
      limit: 100,
    });

    for (const conversation of conversationsResult.data) {
      const chatId = conversationChatId(platform, conversation.id);
      const providerConversationId = conversation.id;
      const participantId = asString(conversation.participantId);
      const providerAccountId = asString(conversation.accountId) || accountId;
      const chatName = asString(conversation.participantName) || participantId || chatId;

      await supabase.from('chats').upsert(
        {
          id: chatId,
          name: chatName,
          channel: platform,
          provider_conversation_id: providerConversationId,
          last_message: conversation.lastMessage ? `[${platform.toUpperCase()}] ${conversation.lastMessage}` : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('provider_message_id')
        .eq('chat_id', chatId)
        .not('provider_message_id', 'is', null);

      const existingIds = new Set((existingMessages ?? []).map((row) => asString((row as { provider_message_id?: string | null }).provider_message_id)));

      let cursor: string | undefined;
      let hasMore = true;
      while (hasMore) {
        const messagePage = await getZernioInboxConversationMessages({
          conversationId: providerConversationId,
          accountId: providerAccountId,
          limit: 100,
          cursor,
          sortOrder: 'asc',
        });

        const rows = messagePage.messages
          .filter((message) => asString(message.id) && normalizeBody(message))
          .filter((message) => !existingIds.has(asString(message.id)))
          .map((message) => ({
            chat_id: chatId,
            channel: platform,
            provider_message_id: asString(message.id),
            sender: message.direction === 'outgoing' ? 'business' : 'customer',
            body: normalizeBody(message),
            created_at: asString(message.createdAt) || asString(message.sentAt) || new Date().toISOString(),
          }));

        if (rows.length > 0) {
          const { error } = await supabase.from('messages').insert(rows);
          if (!error) {
            syncedMessages += rows.length;
            rows.forEach((row) => existingIds.add(row.provider_message_id));
          }
        }

        syncedConversations += 1;
        hasMore = Boolean(messagePage.pagination.hasMore && messagePage.pagination.nextCursor);
        cursor = messagePage.pagination.nextCursor ?? undefined;
      }
    }
  }

  return NextResponse.json({ ok: true, syncedConversations, syncedMessages });
}