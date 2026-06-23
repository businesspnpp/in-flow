'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoginSchema, SignUpSchema, type LoginInput, type SignUpInput } from '@/lib/validation';
import { sanitizeEmail } from '@/lib/sanitize';
import { LogOut } from 'lucide-react';

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4 py-8">
      {/* If user is logged in, show sign out option */}
      {user && (
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">Session Active</h2>
            <p className="text-sm text-zinc-500 mt-2">
              You are signed in as <span className="font-medium">{user.email}</span>
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      )}

      {/* If user is not logged in, show auth form */}
      {!user && (
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              {mode === 'signin' ? 'Sign in to inFlow' : 'Create your account'}
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              {mode === 'signin'
                ? 'Authenticate access credentials to access inFlow.'
                : 'Create a secure account to get started.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Email field */}
            <label className="block text-sm text-zinc-700 font-medium">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
                placeholder="name@company.za"
                className="w-full mt-2 rounded-lg px-3 py-2.5 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
              />
              {validationErrors.email && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </label>

            {/* Password field */}
            <label className="block text-sm text-zinc-700 font-medium">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: '' });
                  }
                }}
                placeholder={mode === 'signup' ? 'Min 8 characters with uppercase, number, special char' : ''}
                className="w-full mt-2 rounded-lg px-3 py-2.5 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
              />
              {validationErrors.password && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </label>

            {/* Confirm password field - only for sign up */}
            {mode === 'signup' && (
              <label className="block text-sm text-zinc-700 font-medium">
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: '' });
                    }
                  }}
                  className="w-full mt-2 rounded-lg px-3 py-2.5 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                )}
              </label>
            )}

            {/* General error message */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                disabled={loading}
                className="flex-1 rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'signin' ? 'Sign in' : 'Create Account'}
              </button>
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                  setValidationErrors({});
                }}
                disabled={loading}
                className="flex-1 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                {mode === 'signin' ? 'Register' : 'Back to Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

