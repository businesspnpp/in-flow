import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createZernioProfile, getZernioConnectUrl } from '@/lib/zernio';

const ZernioPlatformSchema = z.enum(['facebook', 'instagram', 'whatsapp', 'telegram', 'tiktok']);

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

function buildProfileName(businessName: string, businessId: string, platform: string) {
  const cleanBusinessName = businessName.trim() || 'inFlow Business';
  const shortBusinessId = businessId.replace(/-/g, '').slice(0, 8);
  return `${cleanBusinessName} - ${platform} - ${shortBusinessId}`;
}

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id');
  const platformResult = ZernioPlatformSchema.safeParse(request.nextUrl.searchParams.get('platform'));

  if (!businessId || !platformResult.success) {
    return NextResponse.json({ error: 'Missing business_id or platform.' }, { status: 400 });
  }

  const platform = platformResult.data;

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
      .eq('channel', platform)
      .maybeSingle();

    const existingMetadata = (configRow as ChannelConfigRow | null)?.metadata ?? {};
    let profileId = typeof existingMetadata?.zernio_profile_id === 'string' ? existingMetadata.zernio_profile_id : '';

    if (!profileId) {
      const createdProfile = await createZernioProfile(
        buildProfileName(business.business_name, business.id, platform),
        `inFlow workspace profile for business ${business.id}`
      );
      profileId = createdProfile._id;
    }

    const redirectUrl = `${request.nextUrl.origin}/api/zernio/callback?business_id=${encodeURIComponent(businessId)}`;
    const { authUrl } = await getZernioConnectUrl(platform, profileId, redirectUrl);

    await supabase.from('channel_configs').upsert(
      {
        business_id: businessId,
        channel: platform,
        status: 'connecting',
        metadata: {
          ...existingMetadata,
          zernio_profile_id: profileId,
          zernio_platform: platform,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_id,channel' }
    );

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : `Failed to start ${platform} connection.`;
    const dashboardUrl = `${request.nextUrl.origin}/dashboard?oauth=error&channel=${encodeURIComponent(platform)}&error=${encodeURIComponent(message)}`;
    return NextResponse.redirect(dashboardUrl);
  }
}