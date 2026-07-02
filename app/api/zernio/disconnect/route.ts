import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { deleteZernioAccount } from '@/lib/zernio';

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

export async function POST(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id');
  const platformResult = ZernioPlatformSchema.safeParse(request.nextUrl.searchParams.get('platform'));

  if (!businessId || !platformResult.success) {
    return NextResponse.json({ error: 'Missing business_id or platform.' }, { status: 400 });
  }

  const platform = platformResult.data;

  try {
    const supabase = getServerSupabase();
    const { data: configRow } = await supabase
      .from('channel_configs')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('channel', platform)
      .maybeSingle();

    const existingMetadata = (configRow as ChannelConfigRow | null)?.metadata ?? {};
    const accountId = typeof existingMetadata?.zernio_account_id === 'string' ? existingMetadata.zernio_account_id : '';

    if (accountId) {
      await deleteZernioAccount(accountId).catch(() => null);
    }

    await supabase.from('channel_configs').upsert(
      {
        business_id: businessId,
        channel: platform,
        status: 'disconnected',
        metadata: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_id,channel' }
    );

    if (platform === 'whatsapp') {
      const { data: business } = await supabase
        .from('businesses')
        .update({
          whatsapp_number: null,
          whatsapp_waba_id: null,
          whatsapp_phone_number_id: null,
          whatsapp_access_token: null,
          whatsapp_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId)
        .select('*')
        .maybeSingle();

      return NextResponse.json({ success: true, business: business ?? null });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Disconnect failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}