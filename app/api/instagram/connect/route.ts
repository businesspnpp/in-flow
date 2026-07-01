import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const stateRaw = searchParams.get('state');
  const oauthError = searchParams.get('error');

  // Parse state to get business_id and which page to redirect back to
  let business_id = '';
  let channel = 'instagram';
  try {
    const state = JSON.parse(decodeURIComponent(stateRaw || '{}'));
    business_id = state.business_id || '';
    channel = state.channel || 'instagram';
  } catch (e) {}

  const dashboardUrl = `${req.nextUrl.origin}/dashboard`;

  if (oauthError || !code || !business_id) {
    const msg = oauthError || 'Missing code or business_id';
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=${channel}&error=${encodeURIComponent(msg)}`
    );
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase server configuration is missing');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const redirectUri = `${req.nextUrl.origin}/api/instagram/callback`;

    // Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token` +
      `?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}` +
      `&client_secret=${process.env.META_APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData?.error?.message || 'Failed to exchange code for token');
    }

    // Exchange for long-lived token
    const longRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}` +
      `&client_secret=${process.env.META_APP_SECRET}` +
      `&fb_exchange_token=${tokenData.access_token}`
    );
    const longData = await longRes.json();
    if (!longRes.ok || !longData.access_token) {
      throw new Error(longData?.error?.message || 'Failed to get long-lived token');
    }
    const longLivedToken = longData.access_token;

    // Get Instagram Business Account linked to user's Pages
    const igRes = await fetch(
      `https://graph.facebook.com/v20.0/me/accounts` +
      `?fields=instagram_business_account` +
      `&access_token=${longLivedToken}`
    );
    const igData = await igRes.json();
    const igAccountId = igData?.data?.[0]?.instagram_business_account?.id ?? null;

    // Upsert into channel_configs
    const { error: upsertError } = await supabase
      .from('channel_configs')
      .upsert(
        {
          business_id,
          channel: 'instagram',
          status: 'connected',
          access_token: longLivedToken,
          instagram_account_id: igAccountId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id,channel' }
      );

    if (upsertError) throw new Error(upsertError.message);

    return NextResponse.redirect(`${dashboardUrl}?oauth=success&channel=instagram`);
  } catch (err: any) {
    console.error('[instagram/callback]', err);
    return NextResponse.redirect(
      `${dashboardUrl}?oauth=error&channel=instagram&error=${encodeURIComponent(err.message || 'Unknown error')}`
    );
  }
}
