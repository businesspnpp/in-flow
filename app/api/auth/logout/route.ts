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

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Sign out from Supabase
    if (session) {
      await supabase.auth.signOut();
    }

    // Explicitly clear auth cookies
    cookieStore.delete('supabase-auth');
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');

    // Return success response
    const response = NextResponse.json(
      { success: true, message: 'Successfully logged out' },
      { status: 200 }
    );

    // Ensure cookies are cleared in the response as well
    response.cookies.delete('supabase-auth');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;
  } catch (err) {
    console.error('[Logout] Error:', err);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
