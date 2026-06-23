import { createServerClient, serialize } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client configured for server-side operations with secure session cookies.
 * Uses Next.js App Router cookies API for HttpOnly cookie management.
 */

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
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
            console.error('[Auth] Cookie set error:', err);
          }
        },
      },
    }
  );
}

/**
 * Sign out handler for server-side logout.
 * Clears session cookies and invalidates the JWT token.
 */
export async function signOutUser() {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  // Clear cookies by setting them to expire
  const cookieStore = await cookies();
  cookieStore.delete('supabase-auth');
  cookieStore.delete('sb-access-token');
  cookieStore.delete('sb-refresh-token');
}

/**
 * Get current authenticated user from server-side context
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Verify user session is valid and return the user
 */
export async function verifySession() {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session.user;
}
