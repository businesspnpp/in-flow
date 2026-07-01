import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getZernioTikTokCreatorInfo, listZernioAccounts } from '@/lib/zernio';

const ZernioPlatformSchema = z.enum(['facebook', 'instagram', 'whatsapp', 'tiktok']);

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
  const connectedPlatformResult = ZernioPlatformSchema.safeParse(request.nextUrl.searchParams.get('connected'));
  const profileId = request.nextUrl.searchParams.get('profileId') ?? '';
  const accountId = request.nextUrl.searchParams.get('accountId') ?? '';
  const username = request.nextUrl.searchParams.get('username') ?? '';
  const oauthError = request.nextUrl.searchParams.get('error');
  const dashboardUrl = `${request.nextUrl.origin}/dashboard`;

  if (oauthError || !businessId || !connectedPlatformResult.success || !profileId) {
    const message = oauthError || 'Connection did not complete successfully.';
    const channel = connectedPlatformResult.success ? connectedPlatformResult.data : 'unknown';
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=${encodeURIComponent(channel)}&error=${encodeURIComponent(message)}`
    );
  }

  const connectedPlatform = connectedPlatformResult.data;

  try {
    const supabase = getServerSupabase();
    const { data: configRow } = await supabase
      .from('channel_configs')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('channel', connectedPlatform)
      .maybeSingle();

    const existingMetadata = (configRow as ChannelConfigRow | null)?.metadata ?? {};
    const accounts = await listZernioAccounts(profileId, connectedPlatform);
    const account = accounts.find((item) => item._id === accountId) ?? accounts[0] ?? null;

    const creator = (connectedPlatform === 'tiktok' && account?._id
      ? (await getZernioTikTokCreatorInfo(account._id).catch(() => null))?.creator ?? null
      : null) as { nickname?: string } | null;

    await supabase.from('channel_configs').upsert(
      {
        business_id: businessId,
        channel: connectedPlatform,
        status: 'connected',
        metadata: {
          ...existingMetadata,
          zernio_profile_id: profileId,
          zernio_account_id: account?._id ?? accountId,
          username: account?.username ?? username,
          display_name: account?.displayName ?? creator?.nickname ?? account?.username ?? username,
          profile_url: account?.profileUrl ?? null,
          inbox_supported: connectedPlatform !== 'tiktok',
          creator: connectedPlatform === 'tiktok' ? creator : null,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_id,channel' }
    );

    return NextResponse.redirect(`${dashboardUrl}?oauth=success&channel=${connectedPlatform}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection failed.';
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=${connectedPlatform}&error=${encodeURIComponent(message)}`
    );
  }
}