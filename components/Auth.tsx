'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoginSchema, SignUpSchema, type LoginInput, type SignUpInput } from '@/lib/validation';
import { sanitizeEmail } from '@/lib/sanitize';
import { LogOut, Mail, Lock, Zap, HelpCircle } from 'lucide-react';

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
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
    setError('Apple sign-in is coming soon.');
  }

  function handleGoogleSignIn() {
    setError('Google sign-in is coming soon.');
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Top nav */}
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-600 flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-zinc-900 tracking-tight">inFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Product
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1.5">
              <HelpCircle size={15} />
              Help
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                    setValidationErrors({});
                  }}
                  className={`text-sm font-semibold px-3 py-2 transition-colors ${
                    mode === 'signin' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setValidationErrors({});
                  }}
                  className="text-sm font-semibold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left panel */}
        <aside className="hidden md:flex relative flex-col justify-between p-14 lg:p-20 overflow-hidden bg-zinc-950">
          {/* Decorative gradient + glow layers */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-700/40 via-zinc-950 to-zinc-950" />
          <div className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-amber-500/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 -left-20 w-[360px] h-[360px] rounded-full bg-orange-600/20 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Content */}
          <div className="relative max-w-lg">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center">
                <Zap size={18} className="text-zinc-950" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">inFlow</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              Run your business
              <br />
              <span className="text-amber-400">#fromWhatsApp</span>
            </h1>
            <p className="text-base text-zinc-300 mt-5 max-w-md leading-relaxed">
              Manage conversations, send invoices, schedule bookings, and more — all from one workspace.
            </p>
            <p className="text-sm text-zinc-500 mt-3 tracking-wide">
              Built for South African small businesses · Free to start
            </p>
          </div>

          <div className="relative space-y-3 max-w-md">
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-5">
              <p className="text-sm font-semibold text-white mb-1">Unified inbox</p>
              <p className="text-sm text-zinc-400">WhatsApp, Instagram, and Facebook in one structured inbox.</p>
            </div>
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-5">
              <p className="text-sm font-semibold text-white mb-1">Instant tools</p>
              <p className="text-sm text-zinc-400">Send invoices, quotes, and bookings directly into chat.</p>
            </div>
          </div>

          <p className="relative text-xs text-zinc-500">© {new Date().getFullYear()} inFlow. All rights reserved.</p>
        </aside>

        {/* Right panel */}
        <section className="flex flex-col justify-center items-center px-8 py-16 md:px-16 lg:px-24">
          {user ? (
            <div className="w-full max-w-sm">
              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="text-lg font-semibold text-zinc-900 mb-1">Session active</h2>
                <p className="text-base text-zinc-500 mb-6">
                  Signed in as <span className="font-semibold text-zinc-800">{user.email}</span>
                </p>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 text-base font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  <LogOut size={16} />
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </h2>
                <p className="text-base text-zinc-500 mt-1">
                  {mode === 'signin'
                    ? 'Enter your credentials to access your workspace.'
                    : 'Set up your inFlow account to get started.'}
                </p>
              </div>

              <div className="space-y-3">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
                      }}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-3 py-3 text-base border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) setValidationErrors({ ...validationErrors, password: '' });
                      }}
                      placeholder={mode === 'signup' ? 'Min 8 chars, 1 uppercase, 1 number' : '••••••••'}
                      className="w-full pl-10 pr-3 py-3 text-base border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
                  )}
                </div>

                {/* Confirm password */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirm password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: '' });
                        }}
                        placeholder="Repeat password"
                        className="w-full pl-10 pr-3 py-3 text-base border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="text-right">
                    <button type="button" className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2.5">
                    {error}
                  </div>
                )}

                {/* Primary action */}
                <button
                  onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-base font-semibold disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Processing...' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-200" />
                  <span className="text-sm font-medium text-zinc-400">
                    {mode === 'signin' ? 'No account yet?' : 'Have an account?'}
                  </span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                    setValidationErrors({});
                  }}
                  disabled={loading}
                  className="w-full border border-zinc-300 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                >
                  {mode === 'signin' ? 'Create an account' : 'Back to sign in'}
                </button>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleAppleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border border-zinc-300 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26-2 49.7-13.4 69.5-34.3z" />
                    </svg>
                    Sign in with Apple
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border border-zinc-300 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>

              <p className="text-sm text-zinc-400 mt-6 text-center leading-relaxed">
                By continuing, you agree to the{' '}
                <span className="underline cursor-pointer">Terms and Privacy Policy</span>.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
