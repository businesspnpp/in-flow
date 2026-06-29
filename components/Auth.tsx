'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoginSchema, SignUpSchema, type LoginInput, type SignUpInput } from '@/lib/validation';
import { sanitizeEmail } from '@/lib/sanitize';
import { LogOut, Mail, Lock, Zap } from 'lucide-react';

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

  // Monitor auth state changes
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

    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription?.subscription.unsubscribe();
  }, [onSignedIn, onSignedOut]);

  async function handleSignUp() {
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      // Validate inputs
      const validationResult = SignUpSchema.safeParse({
        email: sanitizeEmail(email),
        password,
        confirmPassword,
      });

      if (!validationResult.success) {
        const errors: ValidationErrors = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
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
      // Validate inputs
      const validationResult = LoginSchema.safeParse({
        email: sanitizeEmail(email),
        password,
      });

      if (!validationResult.success) {
        const errors: ValidationErrors = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (signInError) {
        setError(signInError.message || 'Sign in failed');
      }
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
      // Call sign out API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Sign out failed');
      }

      // Clear local state
      setUser(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMode('signin');

      // Redirect to login
      onSignedOut?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }

  // Placeholder OAuth handlers - wired up later
  function handleAppleSignIn() {
    setError('Apple sign-in is coming soon.');
  }

  function handleGoogleSignIn() {
    setError('Google sign-in is coming soon.');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121214] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl min-h-[600px] grid grid-cols-1 md:grid-cols-12 bg-[#16161a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        <aside className="hidden md:flex md:col-span-5 flex-col justify-between p-10 bg-gradient-to-b from-[#1a1a1f] to-[#141417] border-r border-zinc-800/60 relative">
          <div>
            <div className="bg-amber-500/10 text-amber-500 rounded-xl p-2.5 w-fit">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mt-4">inFlow Console</h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-xs">
              Manage conversations, tools, and customer context from one precise workspace.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-[#1c1c22]/40 border border-zinc-800/80 p-4 rounded-xl space-y-1">
              <p className="text-[10px] font-semibold tracking-wider text-amber-500/90">OPERATIONAL CLARITY</p>
              <p className="text-xs text-zinc-400">Minimal, high-contrast control surfaces for teams that move fast.</p>
            </div>
            <div className="bg-[#1c1c22]/40 border border-zinc-800/80 p-4 rounded-xl space-y-1">
              <p className="text-[10px] font-semibold tracking-wider text-amber-500/90">UNIFIED COMMS</p>
              <p className="text-xs text-zinc-400">WhatsApp, Instagram, and Facebook routed into one structured inbox.</p>
            </div>
          </div>
        </aside>

        <section className="col-span-1 md:col-span-7 flex flex-col justify-center items-center px-6 py-12 sm:px-12 md:px-16 bg-[#16161a]">
          {user ? (
            <div className="w-full max-w-sm flex flex-col space-y-6">
              <div className="w-full border border-zinc-800 bg-[#17171c] p-8 rounded-2xl shadow-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">Session Active</h2>
                  <p className="text-sm text-slate-500 mt-2">
                    You are signed in as <span className="font-medium text-slate-300">{user.email}</span>
                  </p>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {loading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm flex flex-col space-y-6">
              <div className="flex flex-col items-center text-center mb-1">
                <h2 className="text-xl font-bold text-white">
                  {mode === 'signin' ? 'Sign in to inFlow' : 'Create your account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'signin'
                    ? 'Enter your email and password to access your inbox.'
                    : 'Create a secure account to get started.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="relative block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                      <Mail size={17} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors({ ...validationErrors, email: '' });
                        }
                      }}
                      placeholder="E-mail"
                      className="w-full rounded-xl pl-14 pr-4 py-3 bg-white/5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-500/40 transition-colors"
                    />
                  </label>
                  {validationErrors.email && (
                    <p className="text-xs text-rose-400 mt-1 px-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="relative block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                      <Lock size={17} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors({ ...validationErrors, password: '' });
                        }
                      }}
                      placeholder={mode === 'signup' ? 'Min 8 characters, 1 uppercase, 1 number, 1 special' : 'Password'}
                      className="w-full rounded-xl pl-14 pr-4 py-3 bg-white/5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-500/40 transition-colors"
                    />
                  </label>
                  {validationErrors.password && (
                    <p className="text-xs text-rose-400 mt-1 px-1">{validationErrors.password}</p>
                  )}
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                        <Lock size={17} />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (validationErrors.confirmPassword) {
                            setValidationErrors({ ...validationErrors, confirmPassword: '' });
                          }
                        }}
                        placeholder="Confirm password"
                        className="w-full rounded-xl pl-14 pr-4 py-3 bg-white/5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-500/40 transition-colors"
                      />
                    </label>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs text-rose-400 mt-1 px-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="text-right -mt-1">
                    <button
                      type="button"
                      className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-rose-400 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20">
                    {error}
                  </div>
                )}

                <button
                  onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 py-3 text-sm font-semibold text-[#0f1117] hover:from-amber-300 hover:to-amber-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : mode === 'signin' ? 'Continue' : 'Create Account'}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-xs text-slate-500 whitespace-nowrap px-1">
                    {mode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}
                  </span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                    setValidationErrors({});
                  }}
                  disabled={loading}
                  className="w-full rounded-xl bg-white/5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/8 transition-colors disabled:opacity-50"
                >
                  {mode === 'signin' ? 'Create an account' : 'Back to Sign In'}
                </button>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleAppleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white/5 py-3 text-sm font-medium text-slate-200 hover:bg-white/8 transition-colors disabled:opacity-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26-2 49.7-13.4 69.5-34.3z" />
                    </svg>
                    Sign in with Apple
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white/5 py-3 text-sm font-medium text-slate-200 hover:bg-white/8 transition-colors disabled:opacity-50"
                  >
                    <svg width="17" height="17" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
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
