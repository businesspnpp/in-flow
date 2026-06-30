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
  
  // Dynamic Configuration Mapping names, brand colors, and pristine inline vector logos
  const channelsConfig = [
    { 
      name: 'WhatsApp', 
      color: 'text-[#25D366]',
      icon: (
        <svg className="w-[1.1em] h-[1.1em] fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      color: 'text-[#E1306C]',
      icon: (
        <svg className="w-[1.1em] h-[1.1em] fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      color: 'text-[#000000]',
      icon: (
        <svg className="w-[1.1em] h-[1.1em] fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.05 1.62 4.2 1.21 1.4 3 2.25 4.88 2.45v3.91c-1.78-.07-3.51-.72-4.93-1.84a8.13 8.13 0 01-1.57-1.74V15c.04 2.44-.91 4.85-2.64 6.57a8.68 8.68 0 01-11.96.25A9.03 9.03 0 011.53 14.7a8.87 8.87 0 015.42-8.3 8.1 8.1 0 012.72-.46V9.9a4.89 4.89 0 00-4.22 3.6 4.97 4.97 0 001.21 4.54 5.08 5.08 0 006.84.34 4.89 4.89 0 001.81-4.14V.02z"/>
        </svg>
      )
    },
    { 
      name: 'Email', 
      color: 'text-amber-600',
      icon: <Mail className="w-[1.1em] h-[1.1em]" strokeWidth={2.5} />
    },
    { 
      name: 'Facebook', 
      color: 'text-[#1877F2]',
      icon: (
        <svg className="w-[1.1em] h-[1.1em] fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);

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

  // Rotates the channel index every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChannelIndex((prevIndex) => (prevIndex + 1) % channelsConfig.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [channelsConfig.length]);

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

          <nav className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              Product
            </a>
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              Pricing
            </Link>
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

      {/* Body Container */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left panel (Desktop Only View) */}
        <aside className="hidden md:flex relative flex-col justify-between p-14 md:pl-32 lg:p-20 lg:pl-44 overflow-hidden bg-zinc-50">
          {/* Faded grid overlay layout assets */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(24 24 27 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(24 24 27 / 0.06) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 75%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(24 24 27 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(24 24 27 / 0.06) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse 55% 45% at 90% 95%, black 0%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 55% 45% at 90% 95%, black 0%, transparent 75%)',
            }}
          />

          {/* Content */}
          <div className="relative max-w-lg">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-amber-600 flex items-center justify-center">
                <Zap size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold text-zinc-900 tracking-tight">inFlow</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.2]">
              Run your business
              <br />
              <span className="inline-flex items-center whitespace-nowrap">
                <span className="text-zinc-900 mr-4 select-none">#from</span>
                
                {/* 3D Perspective Box Layout Frame */}
                <span className="relative inline-flex items-center h-[1.2em] [perspective:1000px]">
                  {/* Invisible ghost layout anchor to hold container spaces */}
                  <span className={`invisible inline-flex items-center gap-3 font-bold select-none pointer-events-none transition-colors duration-500 ${channelsConfig[currentChannelIndex].color}`}>
                    {channelsConfig[currentChannelIndex].icon}
                    <span>{channelsConfig[currentChannelIndex].name}</span>
                  </span>

                  {channelsConfig.map((channel, index) => {
                    const isActive = index === currentChannelIndex;
                    const isPast = index === (currentChannelIndex - 1 + channelsConfig.length) % channelsConfig.length;

                    return (
                      <span
                        key={channel.name}
                        className={`absolute left-0 inline-flex items-center gap-3 font-bold whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] [backface-visibility:hidden] ${channel.color} ${
                          isActive
                            ? 'opacity-100 [transform:rotateX(0deg)_translateY(0)]'
                            : isPast
                            ? 'opacity-0 [transform:rotateX(90deg)_translateY(-60%)]'
                            : 'opacity-0 [transform:rotateX(-90deg)_translateY(60%)]'
                        }`}
                        style={{ transformOrigin: 'center center' }}
                      >
                        {channel.icon}
                        <span>{channel.name}</span>
                      </span>
                    );
                  })}
                </span>
              </span>
            </h1>
            
            <p className="text-base text-zinc-500 mt-5 max-w-md leading-relaxed">
              Manage conversations, send invoices, schedule bookings, and more — all from one workspace.
            </p>
            <p className="text-sm text-zinc-400 mt-3 tracking-wide">
              Built for South African small businesses · Free to start
            </p>
          </div>

          <div className="relative space-y-3 max-w-md">
            <div className="border border-zinc-200 bg-white/70 backdrop-blur-sm p-5">
              <p className="text-sm font-semibold text-zinc-900 mb-1">Unified inbox</p>
              <p className="text-sm text-zinc-500">All your consumer chat ecosystems managed inside one unified environment.</p>
            </div>
            <div className="border border-zinc-200 bg-white/70 backdrop-blur-sm p-5">
              <p className="text-sm font-semibold text-zinc-900 mb-1">Instant tools</p>
              <p className="text-sm text-zinc-500">Send invoices, quotes, and bookings directly into chat.</p>
            </div>
          </div>

          <p className="relative text-xs text-zinc-400">© {new Date().getFullYear()} inFlow. All rights reserved.</p>
        </aside>

        {/* Right panel (Responsive Card Container Layout) */}
        <section className="flex flex-col justify-center items-stretch px-4 py-10 sm:px-8 md:px-16 lg:px-24 bg-white">
          {user ? (
            <div className="bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 max-w-md mx-auto w-full space-y-6">
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
            <div className="bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 max-w-md mx-auto w-full space-y-6">

              {/* Mobile Adaptive Header featuring brand identity vectors */}
              <div className="block md:hidden mb-2">
                <span className="text-xs font-bold tracking-tight text-zinc-900 inline-flex items-center whitespace-nowrap">
                  Run your business
                  <span className="mx-1.5 font-normal text-zinc-400 select-none">#from</span>
                  
                  {/* Micro Mobile 3D Vector Text Box */}
                  <span className="relative inline-flex items-center h-[1.2em] [perspective:1000px]">
                    <span className={`invisible inline-flex items-center gap-1.5 font-bold select-none pointer-events-none ${channelsConfig[currentChannelIndex].color}`}>
                      {channelsConfig[currentChannelIndex].icon}
                      <span>{channelsConfig[currentChannelIndex].name}</span>
                    </span>
                    {channelsConfig.map((channel, index) => {
                      const isActive = index === currentChannelIndex;
                      const isPast = index === (currentChannelIndex - 1 + channelsConfig.length) % channelsConfig.length;
                      return (
                        <span
                          key={`mobile-${channel.name}`}
                          className={`absolute left-0 inline-flex items-center gap-1.5 font-bold whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] [backface-visibility:hidden] ${channel.color} ${
                            isActive
                              ? 'opacity-100 [transform:rotateX(0deg)_translateY(0)]'
                              : isPast
                              ? 'opacity-0 [transform:rotateX(90deg)_translateY(-60%)]'
                              : 'opacity-0 [transform:rotateX(-90deg)_translateY(60%)]'
                          }`}
                          style={{ transformOrigin: 'center center' }}
                        >
                          {channel.icon}
                          <span>{channel.name}</span>
                        </span>
                      );
                    })}
                  </span>
                </span>
              </div>

              {/* Form Content Header */}
              <div className="border-b border-zinc-100 pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                    {mode === 'signin' ? 'Access your account' : 'Start your free trial'}
                  </p>
                </div>
              </div>

              {/* Input Layout Elements */}
              <div className="space-y-4">
                {/* Email Input */}
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

                {/* Password Input */}
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

                {/* Optional Signup Confirm Pass */}
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

                {/* Primary Button Hook */}
                <button
                  onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In to Account' : 'Create My Account'}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>

                {/* Navigation Switching Utilities */}
                <div className="pt-2 flex flex-col items-center space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setError('');
                      setValidationErrors({});
                    }}
                    disabled={loading}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors text-center"
                  >
                    {mode === 'signin' ? "Don't have an account? Sign up here" : "Already have an account? Sign in"}
                  </button>

                  <div className="w-full flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-100" />
                    <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest">Or Sign In With</span>
                    <div className="flex-1 h-px bg-zinc-100" />
                  </div>

                  {/* OAuth Integration Templates */}
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
          
          {/* Mobile Footer Area */}
          <p className="block md:hidden text-center text-[10px] text-zinc-400 mt-8">
            © {new Date().getFullYear()} inFlow. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
