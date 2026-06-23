import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { sanitizePhoneNumber } from '@/lib/sanitize';

/**
 * Validation schema for WhatsApp connection request
 */
const WhatsAppConnectSchema = z.object({
  business_id: z.string().min(1, 'Business ID is required').max(255),
  code: z.string().min(1, 'Authorization code is required'),
  waba_id: z.string().max(255).optional(),
  phone_number_id: z.string().max(255).optional(),
});

type ConnectRequest = z.infer<typeof WhatsAppConnectSchema>;

/**
 * POST /api/whatsapp/connect
 * Secure WhatsApp Business Account OAuth connection with token exchange
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input against schema
    const validationResult = WhatsAppConnectSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message).join(', ');
      console.error('[WhatsApp Connect] Validation error:', errors);
      return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 });
    }

    const { business_id, code, waba_id, phone_number_id } = validationResult.data;

    // Verify environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const metaAppSecret = process.env.META_APP_SECRET;
    const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID;

    if (!supabaseUrl || !serviceKey || !metaAppSecret || !metaAppId) {
      console.error('[WhatsApp Connect] Missing server configuration');
      return NextResponse.json({ error: 'Server configuration incomplete' }, { status: 500 });
    }

    // Verify user is authenticated (optional but recommended)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not authenticated' }, { status: 401 });
    }

    // Step 1: Exchange authorization code for user access token (OAuth code exchange)
    const tokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
    tokenUrl.searchParams.append('client_id', metaAppId);
    tokenUrl.searchParams.append('client_secret', metaAppSecret);
    tokenUrl.searchParams.append('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[WhatsApp Connect] Meta code exchange failed:', tokenData);
      return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 502 });
    }

    const shortLivedToken = tokenData.access_token;

    // Step 2: Exchange short-lived token for long-lived token
    const exchangeUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
    exchangeUrl.searchParams.append('grant_type', 'fb_exchange_token');
    exchangeUrl.searchParams.append('client_id', metaAppId);
    exchangeUrl.searchParams.append('client_secret', metaAppSecret);
    exchangeUrl.searchParams.append('fb_exchange_token', shortLivedToken);

    const exchangeRes = await fetch(exchangeUrl.toString());
    const exchangeData = await exchangeRes.json();

    if (!exchangeRes.ok || !exchangeData.access_token) {
      console.error('[WhatsApp Connect] Long-lived token exchange failed:', exchangeData);
      return NextResponse.json({ error: 'Failed to obtain long-lived access token' }, { status: 502 });
    }

    const longLivedToken = exchangeData.access_token;

    // Step 3: Resolve WABA ID (WhatsApp Business Account)
    let resolvedWabaId = waba_id;
    if (!resolvedWabaId) {
      const wabaUrl = new URL('https://graph.facebook.com/v20.0/me/whatsapp_business_accounts');
      wabaUrl.searchParams.append('access_token', longLivedToken);

      const wabaRes = await fetch(wabaUrl.toString());
      const wabaData = await wabaRes.json();

      if (!wabaRes.ok || !wabaData.data || wabaData.data.length === 0) {
        console.error('[WhatsApp Connect] No WABA found:', wabaData);
        return NextResponse.json(
          { error: 'No WhatsApp Business Accounts found for this account' },
          { status: 400 }
        );
      }

      resolvedWabaId = String(wabaData.data[0].id);
    }

    // Step 4: Resolve phone number ID
    let resolvedPhoneNumberId = phone_number_id;
    let displayPhoneNumber: string | undefined;

    if (!resolvedPhoneNumberId) {
      const phoneUrl = new URL(`https://graph.facebook.com/v20.0/${resolvedWabaId}/phone_numbers`);
      phoneUrl.searchParams.append('access_token', longLivedToken);

      const phoneRes = await fetch(phoneUrl.toString());
      const phoneData = await phoneRes.json();

      if (!phoneRes.ok || !phoneData.data || phoneData.data.length === 0) {
        console.error('[WhatsApp Connect] No phone numbers found:', phoneData);
        return NextResponse.json(
          { error: 'No active phone lines found on this WhatsApp Business Account' },
          { status: 400 }
        );
      }

      resolvedPhoneNumberId = String(phoneData.data[0].id);
      displayPhoneNumber = phoneData.data[0].display_phone_number;
    } else {
      // Fetch display phone number for the provided phone_number_id
      const phoneDetailUrl = new URL(`https://graph.facebook.com/v20.0/${resolvedPhoneNumberId}`);
      phoneDetailUrl.searchParams.append('fields', 'display_phone_number');
      phoneDetailUrl.searchParams.append('access_token', longLivedToken);

      const phoneDetailRes = await fetch(phoneDetailUrl.toString());
      const phoneDetailData = await phoneDetailRes.json();
      displayPhoneNumber = phoneDetailData?.display_phone_number;
    }

    // Sanitize and validate phone number
    if (!displayPhoneNumber) {
      console.error('[WhatsApp Connect] No display phone number found');
      return NextResponse.json({ error: 'Could not determine phone number' }, { status: 400 });
    }

    const sanitizedPhone = sanitizePhoneNumber(displayPhoneNumber);
    if (!sanitizedPhone) {
      console.error('[WhatsApp Connect] Invalid phone number format:', displayPhoneNumber);
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Step 5: Save to database using Supabase client with parameterized queries
    const { data: updateData, error: updateError } = await supabase
      .from('businesses')
      .update({
        whatsapp_number: displayPhoneNumber,
        whatsapp_waba_id: resolvedWabaId,
        whatsapp_phone_number_id: resolvedPhoneNumberId,
        whatsapp_access_token: longLivedToken, // Ideally encrypt this before storage
        whatsapp_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', business_id)
      .select();

    if (updateError) {
      console.error('[WhatsApp Connect] Database update failed:', updateError);
      return NextResponse.json({ error: 'Failed to save WhatsApp connection' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp Business Account connected successfully',
      business: updateData?.[0],
    });
  } catch (err) {
    console.error('[WhatsApp Connect] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
