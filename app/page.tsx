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
  const [error, setError] = useState<string | null>(null);

  // Monitor auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, refresh the session from cookies to ensure they're valid
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !data.session) {
          // Session is invalid or expired - user is logged out
          setIsSignedIn(false);
          setIsLoading(false);
          return;
        }

        // Session is valid
        if (data.session?.user) {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error refreshing session:', err);
        setIsSignedIn(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes for any subsequent changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (session?.user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setError(null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignedIn = () => {
    setIsSignedIn(true);
    setError(null);
  };

  const handleSignedOut = () => {
    setIsSignedIn(false);
  };

  // Show loading state while checking auth (max 3 seconds before showing auth form)
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

  // Show error state if needed, but allow user to continue to auth
  if (error && !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <Auth onSignedIn={handleSignedIn} onSignedOut={handleSignedOut} />
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
