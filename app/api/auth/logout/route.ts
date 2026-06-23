import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * Securely logs out the user, invalidates JWT, and clears session cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, {
                  ...options,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'strict',
                  httpOnly: true,
                });
              });
            } catch (err) {
              console.error('[Logout] Cookie set error:', err);
            }
          },
        },
      }
    );

    // Sign out from Supabase (invalidates server-side session)
    await supabase.auth.signOut();

    // Explicitly clear ALL auth-related cookies
    const cookiesToClear = [
      'supabase-auth',
      'sb-access-token',
      'sb-refresh-token',
      'sb-user',
      'sb-auth-token',
    ];

    cookiesToClear.forEach((name) => {
      cookieStore.delete(name);
    });

    // Create response with logout success
    const response = NextResponse.json(
      { success: true, message: 'Successfully logged out' },
      { status: 200 }
    );

    // Clear all cookies in the response as well
    cookiesToClear.forEach((name) => {
      response.cookies.delete(name);
    });

    // Add header to instruct client to clear localStorage
    response.headers.set('X-Clear-Storage', 'true');

    return response;
  } catch (err) {
    console.error('[Logout] Error:', err);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
