import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createZernioProfile, getZernioConnectUrl } from '@/lib/zernio';

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
  const businessId = request.nextUrl.searchParams.get('business_id');
  if (!businessId) {
    return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, business_name')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      throw new Error('Business profile not found.');
    }

    const { data: configRow } = await supabase
      .from('channel_configs')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('channel', 'tiktok')
      .maybeSingle();

    const existingMetadata = (configRow as ChannelConfigRow | null)?.metadata ?? {};
    let profileId = typeof existingMetadata?.zernio_profile_id === 'string' ? existingMetadata.zernio_profile_id : '';

    if (!profileId) {
      const createdProfile = await createZernioProfile(
        business.business_name,
        `inFlow workspace profile for business ${business.id}`
      );
      profileId = createdProfile._id;
    }

    const redirectUrl = `${request.nextUrl.origin}/api/tiktok/callback?business_id=${encodeURIComponent(businessId)}`;
    const { authUrl } = await getZernioConnectUrl('tiktok', profileId, redirectUrl);

    await supabase.from('channel_configs').upsert(
      {
        business_id: businessId,
        channel: 'tiktok',
        status: 'connecting',
        metadata: {
          ...existingMetadata,
          zernio_profile_id: profileId,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_id,channel' }
    );

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start TikTok connection.';
    const dashboardUrl = `${request.nextUrl.origin}/dashboard?oauth=error&channel=tiktok&error=${encodeURIComponent(message)}`;
    return NextResponse.redirect(dashboardUrl);
  }
}