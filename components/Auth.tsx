'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LoginSchema, SignUpSchema, type LoginInput, type SignUpInput } from '@/lib/validation';
import { sanitizeEmail } from '@/lib/sanitize';
import { LogOut, Mail, Lock, Zap, HelpCircle, ArrowRight } from 'lucide-react';

interface AuthProps {
  onSignedIn: () => void;
  onSignedOut?: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function Auth({ onSignedIn, onSignedOut }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        onSignedIn();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        onSignedOut?.();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    return () => subscription?.subscription.unsubscribe();
  }, [onSignedIn, onSignedOut]);

  async function handleSignUp() {
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const validationResult = SignUpSchema.safeParse({
        email: sanitizeEmail(email),
        password,
        confirmPassword,
      });

      if (!validationResult.success) {
        const errors: ValidationErrors = {};
        validationResult.error.errors.forEach((err) => {
          errors[err.path.join('.')] = err.message;
        });
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      const redirectUrl =
        (process.env.NEXT_PUBLIC_APP_URL as string) ||
        (typeof window !== 'undefined' ? window.location.origin : undefined);

      const { error: signUpError } = await supabase.auth.signUp({
        email: validationResult.data.email,
        password: validationResult.data.password,
        options: { emailRedirectTo: redirectUrl },
      });

      if (signUpError) {
        setError(signUpError.message || 'Sign up failed');
      } else {
        setError('');
        setMode('signin');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const validationResult = LoginSchema.safeParse({
        email: sanitizeEmail(email),
        password,
      });

      if (!validationResult.success) {
        const errors: ValidationErrors = {};
        validationResult.error.errors.forEach((err) => {
          errors[err.path.join('.')] = err.message;
        });
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (signInError) setError(signInError.message || 'Sign in failed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Sign out failed');

      setUser(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMode('signin');
      onSignedOut?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }

  function handleAppleSignIn() {
    setError('Apple login option coming soon.');
  }

  function handleGoogleSignIn() {
    setError('Google login option coming soon.');
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FAFAFA] text-zinc-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Simple, Professional Header */}
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-zinc-950 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <Zap size={18} className="text-amber-400 fill-amber-400" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">inFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">Product</Link>
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">Pricing</Link>
            <a href="#" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1.5">
              <HelpCircle size={16} />
              Help & Support
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                  setValidationErrors({});
                }}
                className="text-xs font-mono font-bold tracking-wider uppercase bg-zinc-100 border border-zinc-200 px-4 py-2.5 hover:bg-zinc-200/70 transition-colors text-zinc-700"
              >
                {mode === 'signin' ? 'Create Account' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Column: Value Proposition & Product Features Grid */}
        <aside className="md:col-span-6 text-left space-y-6 py-8 pr-4">
          <div className="space-y-2">
            <p className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
              Built for South African small businesses · Free to start
            </p>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[0.95]">
              Run your business <span className="text-amber-600">#fromWhatsApp</span>
            </h1>
          </div>
          
          <p className="text-lg text-zinc-500 max-w-md font-medium leading-relaxed">
            Manage conversations, send invoices, schedule bookings, and more — all from one workspace.
          </p>

          {/* Feature Grid Blocks */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="border border-zinc-200 bg-white p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Unified inbox</p>
                <p className="text-xs text-zinc-500 font-medium mt-1.5 leading-relaxed">WhatsApp, Instagram, and Facebook in one structured inbox.</p>
              </div>
            </div>
            <div className="border border-zinc-200 bg-white p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Instant tools</p>
                <p className="text-xs text-zinc-500 font-medium mt-1.5 leading-relaxed">Send invoices, quotes, and bookings directly into chat.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side Column: Hard-Edged Simple Form Box */}
        <section className="md:col-span-6 flex flex-col justify-center items-stretch lg:px-8">
          
          {user ? (
            <div className="bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 max-w-md mx-auto w-full space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-800 bg-amber-400/30 border border-amber-300 px-2 py-0.5 uppercase">
                  Logged In
                </span>
                <h2 className="text-xl font-black tracking-tight text-zinc-900 mt-3">Welcome back</h2>
                <p className="text-sm text-zinc-500 font-medium mt-1">
                  You are signed in as: <span className="font-bold text-zinc-800">{user.email}</span>
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white py-3.5 text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.99]"
              >
                <LogOut size={16} />
                {loading ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <div className="bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 max-w-md mx-auto w-full space-y-6">
              
              {/* Simplified Form Header */}
              <div className="border-b border-zinc-100 pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </h2>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                    {mode === 'signin' ? 'Access your account' : 'Start your free trial'}
                  </p>
                </div>
              </div>

              {/* Input Forms */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
                      }}
                      placeholder="you@company.co.za"
                      className="w-full pl-11 pr-4 py-3 text-sm font-medium border border-zinc-300 rounded-none bg-white text-zinc-900 placeholder-zinc-300 outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-xs font-mono font-bold text-red-600 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) setValidationErrors({ ...validationErrors, password: '' });
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-3 text-sm font-medium border border-zinc-300 rounded-none bg-white text-zinc-900 placeholder-zinc-300 outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="text-xs font-mono font-bold text-red-600 mt-1">{validationErrors.password}</p>
                  )}
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: '' });
                        }}
                        placeholder="Repeat your password"
                        className="w-full pl-11 pr-4 py-3 text-sm font-medium border border-zinc-300 rounded-none bg-white text-zinc-900 placeholder-zinc-300 outline-none focus:border-zinc-900 transition-colors"
                      />
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs font-mono font-bold text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="text-right">
                    <button type="button" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-3 py-2.5">
                    {error}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In to Account' : 'Create My Account'}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>

                {/* Relatable Alternate Mode Switcher */}
                <div className="pt-2 flex flex-col items-center space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setError('');
                      setValidationErrors({});
                    }}
                    disabled={loading}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {mode === 'signin' ? "Don't have an account? Sign up here" : "Already have an account? Sign in"}
                  </button>

                  <div className="w-full flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-100" />
                    <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest">Or Sign In With</span>
                    <div className="flex-1 h-px bg-zinc-100" />
                  </div>

                  {/* Clean Social Buttons */}
                  <div className="w-full grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAppleSignIn}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors rounded-none"
                    >
                      <svg width="12" height="12" viewBox="0 0 384 512" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26-2 49.7-13.4 69.5-34.3z" />
                      </svg>
                      Apple ID
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors rounded-none"
                    >
                      <svg width="12" height="12" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                      </svg>
                      Google
                    </button>
                  </div>
                </div>

              </div>

              <p className="text-[11px] text-zinc-400 mt-6 text-center leading-relaxed font-medium">
                By logging in, you agree to our standard{' '}
                <span className="underline cursor-pointer text-zinc-500">Terms of Service</span>.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Simple Footer */}
      <footer className="w-full px-6 py-12 border-t border-zinc-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-950 flex items-center justify-center">
              <Zap size={12} className="text-amber-400 fill-amber-400" />
            </div>
            <span className="text-sm font-bold text-zinc-900 tracking-tight">inFlow Automation</span>
          </div>
          <p className="text-xs font-mono font-bold text-zinc-400">
            © {new Date().getFullYear()} inFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
