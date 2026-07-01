import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getZernioTikTokCreatorInfo, listZernioAccounts } from '@/lib/zernio';

type ChannelConfigRow = {
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

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id') ?? '';
  const connectedPlatform = request.nextUrl.searchParams.get('connected');
  const profileId = request.nextUrl.searchParams.get('profileId') ?? '';
  const accountId = request.nextUrl.searchParams.get('accountId') ?? '';
  const username = request.nextUrl.searchParams.get('username') ?? '';
  const oauthError = request.nextUrl.searchParams.get('error');
  const dashboardUrl = `${request.nextUrl.origin}/dashboard`;

  if (oauthError || !businessId || connectedPlatform !== 'tiktok' || !profileId) {
    const message = oauthError || 'TikTok connection did not complete successfully.';
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=tiktok&error=${encodeURIComponent(message)}`
    );
  }

  try {
    const supabase = getServerSupabase();
    const { data: configRow } = await supabase
      .from('channel_configs')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('channel', 'tiktok')
      .maybeSingle();

    const existingMetadata = (configRow as ChannelConfigRow | null)?.metadata ?? {};
    const accounts = await listZernioAccounts(profileId, 'tiktok');
    const account = accounts.find((item) => item._id === accountId) ?? accounts[0] ?? null;

    let creator: Record<string, unknown> | null = null;
    if (account?._id) {
      const creatorInfo = await getZernioTikTokCreatorInfo(account._id).catch(() => null);
      creator = creatorInfo?.creator ?? null;
    }

    await supabase.from('channel_configs').upsert(
      {
        business_id: businessId,
        channel: 'tiktok',
        status: 'connected',
        metadata: {
          ...existingMetadata,
          zernio_profile_id: profileId,
          zernio_account_id: account?._id ?? accountId,
          username: account?.username ?? username,
          display_name: account?.displayName ?? creator?.nickname ?? username,
          profile_url: account?.profileUrl ?? null,
          creator,
          inbox_supported: false,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_id,channel' }
    );

    return NextResponse.redirect(`${dashboardUrl}?oauth=success&channel=tiktok`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TikTok connection failed.';
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=tiktok&error=${encodeURIComponent(message)}`
    );
  }
}