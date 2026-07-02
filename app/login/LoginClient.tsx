'use client';

import Auth from '@/components/Auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';

export default function LoginClient({ initialMode }: { initialMode: 'signin' | 'signup' }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      if (!hasSupabaseConfig) {
        if (active) setChecking(false);
        return;
      }

      try {
        const client = getSupabase();
        const { data: { session } } = await client.auth.getSession();

        if (!active) return;

        if (session?.user) {
          router.push('/dashboard');
          return;
        }

        setChecking(false);
      } catch {
        if (active) {
          setChecking(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm font-semibold text-zinc-500 animate-pulse">Initializing connection...</p>
      </div>
    );
  }

  return (
    <div>
      <Auth
        initialMode={initialMode}
        onSignedIn={() => router.push('/dashboard')}
        onSignedOut={() => router.push('/login')}
      />
    </div>
  );
}