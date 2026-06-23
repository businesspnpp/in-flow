'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Dashboard from './dashboard';

/**
 * Root page component with authentication protection
 * Redirects unauthenticated users to login, shows dashboard to authenticated users
 */
export default function Home() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor auth state on mount
  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setIsLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignedIn = () => {
    setIsSignedIn(true);
  };

  const handleSignedOut = () => {
    setIsSignedIn(false);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if not signed in
  if (!isSignedIn) {
    return <Auth onSignedIn={handleSignedIn} onSignedOut={handleSignedOut} />;
  }

  // Show dashboard if signed in
  return <Dashboard />;
}
