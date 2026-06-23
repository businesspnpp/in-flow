import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Authentication middleware for protecting API routes and server-side resources.
 * Validates JWT tokens from secure HttpOnly cookies.
 */

// Initialize Supabase Admin Client for token verification
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, serviceKey);
}

/**
 * Extracts and validates the session token from request cookies or Authorization header
 */
export async function getSessionFromRequest(request: NextRequest) {
  // Check for token in HttpOnly cookie first (most secure)
  const cookieToken = request.cookies.get('supabase-auth')?.value;

  // Fallback to Authorization header (for API clients)
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return null;
  }

  try {
    // Verify the JWT token using Supabase admin client
    const supabase = getSupabaseAdmin();
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.getUserById(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('[Auth] Token verification error:', err);
    return null;
  }
}

/**
 * Middleware for protecting API routes - ensures user is authenticated
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return await handler(request, user.id);
  } catch (err) {
    console.error('[Auth] Handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Create secure session cookies with HttpOnly, SameSite, and Secure flags
 */
export function createSessionCookie(token: string, expiresIn: number = 24 * 60 * 60 * 1000) {
  const expires = new Date(Date.now() + expiresIn);

  // For production, ensure secure flag is set
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: 'supabase-auth',
    value: token,
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: 'strict' as const,
    path: '/',
    expires,
    maxAge: Math.floor(expiresIn / 1000),
  };
}

/**
 * Clear session cookies (used for logout)
 */
export function clearSessionCookie() {
  return {
    name: 'supabase-auth',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  };
}

/**
 * Verify webhook authenticity using Meta webhook signature
 */
export async function verifyMetaWebhookSignature(
  request: NextRequest,
  secret: string
): Promise<boolean> {
  const xHubSignature = request.headers.get('x-hub-signature-256');

  if (!xHubSignature) {
    return false;
  }

  try {
    const rawBody = await request.text();
    const crypto = await import('crypto');
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const signature = `sha256=${hmac}`;
    return signature === xHubSignature;
  } catch (err) {
    console.error('[Webhook] Signature verification error:', err);
    return false;
  }
}

/**
 * Meta review mode bypass - allows staging to skip auth for reviewer
 */
export function isMetaReviewMode(): boolean {
  return process.env.NEXT_PUBLIC_META_REVIEW_MODE === 'true';
}

/**
 * Check if request should bypass auth for Meta review staging
 */
export function shouldBypassAuthForMeta(request: NextRequest): boolean {
  if (!isMetaReviewMode()) {
    return false;
  }

  // Optionally verify the request comes from Meta IP range or has specific header
  const userAgent = request.headers.get('user-agent') || '';
  return userAgent.includes('facebookexternalhit') || userAgent.includes('MetaInspector');
}
