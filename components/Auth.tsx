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
    <div className="flex items-center justify-center min-h-screen bg-[#09090f] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#111118] p-6 shadow-xl shadow-black/30">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Sign in or create account</h2>
          <p className="text-xs text-[#9090a8] mt-1">Authenticate access credentials to access inFlow.</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-[#e8e8f0]">
            <span>Email</span>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.za"
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 bg-[#15151d] border border-[#2a2a3a] text-sm text-white outline-none focus:border-[#6c63ff] transition-colors" 
            />
          </label>
          
          <label className="block text-sm text-[#e8e8f0]">
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 bg-[#15151d] border border-[#2a2a3a] text-sm text-white outline-none focus:border-[#6c63ff] transition-colors" 
            />
          </label>

          {error && <p className="text-xs text-[#ff6b6b] bg-[#2a1414] p-2.5 rounded-lg border border-[#4a1a1a]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleSignIn} 
              disabled={loading} 
              className="flex-1 rounded-xl bg-[#6c63ff] py-2.5 text-xs font-semibold text-white hover:bg-[#7c73ff] transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>
            <button 
              onClick={handleSignUp} 
              disabled={loading} 
              className="flex-1 rounded-xl border border-[#2a2a3a] bg-transparent py-2.5 text-xs font-semibold text-white hover:bg-[#15151d] transition-colors disabled:opacity-50"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
