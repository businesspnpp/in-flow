'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthProps {
  onSignedIn: () => void;
}

export default function Auth({ onSignedIn }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        onSignedIn();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [onSignedIn]);

  async function handleSignUp() {
    setLoading(true);
    setError('');
    
    const redirectUrl = (process.env.NEXT_PUBLIC_APP_URL as string) || 
      (typeof window !== 'undefined' ? window.location.origin : undefined);

    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { emailRedirectTo: redirectUrl } 
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900">Sign in or create account</h2>
          <p className="text-sm text-zinc-500 mt-2">Authenticate access credentials to access inFlow.</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-zinc-700 font-medium">
            <span>Email</span>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.za"
              className="w-full mt-2 rounded-lg px-3 py-2.5 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors" 
            />
          </label>
          
          <label className="block text-sm text-zinc-700 font-medium">
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full mt-2 rounded-lg px-3 py-2.5 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors" 
            />
          </label>

          {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

          <div className="flex gap-3 pt-3">
            <button 
              onClick={handleSignIn} 
              disabled={loading} 
              className="flex-1 rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>
            <button 
              onClick={handleSignUp} 
              disabled={loading} 
              className="flex-1 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
