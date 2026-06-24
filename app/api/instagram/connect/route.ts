import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { business_id, access_token } = await req.json();

    if (!business_id || !access_token) {
      return NextResponse.json({ error: 'Missing business_id or access_token' }, { status: 400 });
    }

    // Exchange short-lived token for long-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${access_token}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData?.error?.message || 'Failed to exchange token');
    }
    const longLivedToken = tokenData.access_token;

    // Get Instagram account linked to user's pages
    const igRes = await fetch(
      `https://graph.facebook.com/v20.0/me/accounts?fields=instagram_business_account&access_token=${longLivedToken}`
    );
    const igData = await igRes.json();
    const igAccountId = igData?.data?.[0]?.instagram_business_account?.id ?? null;

    // Upsert into channel_configs
    const { error: upsertError } = await supabase
      .from('channel_configs')
      .upsert({
        business_id,
        channel: 'instagram',
        status: 'connected',
        access_token: longLivedToken,
        instagram_account_id: igAccountId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'business_id,channel' });

    if (upsertError) throw new Error(upsertError.message);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[instagram/connect]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
