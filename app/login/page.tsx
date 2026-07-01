'use client';

import Auth from '@/components/Auth';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  // If a session already exists cleanly, push to dashboard once and don't render Auth form
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push('/dashboard');
      } else {
        setChecking(false);
      }
    });
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
