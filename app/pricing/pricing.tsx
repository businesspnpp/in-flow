'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Zap, HelpCircle } from 'lucide-react';

interface Tier {
  name: string;
  price: string;
  period: string;
  channels: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const tiers: Tier[] = [
  {
    name: 'Free',
    price: 'R0',
    period: 'forever',
    channels: '1 channel',
    description: 'Testing the water — first-time software users',
    features: ['1 channel connected', '1 tool of your choice', '40 conversations / month'],
    cta: 'Start for free',
  },
  {
    name: 'Starter',
    price: 'R149',
    period: '/mo',
    channels: '2 channels',
    description: 'Solo operators — barbers, single-chair salons',
    features: ['2 channels connected', 'All 4 built-in tools', '1 calendar sync'],
    cta: 'Choose Starter',
  },
  {
    name: 'Growth',
    price: 'R349',
    period: '/mo',
    channels: 'All channels',
    description: 'Growing teams — multi-stylist salons, busy kitchens',
    features: ['All channels connected', 'All 4 built-in tools', 'Unlimited calendar sync', '3 team users'],
    highlighted: true,
    cta: 'Choose Growth',
  },
  {
    name: 'Pro',
    price: 'R699',
    period: '/mo',
    channels: 'All channels',
    description: 'Multi-location or franchise-style operators',
    features: ['Everything in Growth', 'Multi-location support', 'Team roles & permissions', 'Analytics'],
    cta: 'Choose Pro',
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Top nav */}
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-600 flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-zinc-900 tracking-tight">inFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Product
            </Link>
            <span className="text-sm font-semibold text-zinc-900">Pricing</span>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1.5">
              <HelpCircle size={15} />
              Help
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-semibold px-3 py-2 text-zinc-500 hover:text-zinc-900 transition-colors">
              Sign in
            </Link>
            <Link href="/auth?mode=signup" className="text-sm font-semibold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Back arrow row */}
      <div className="w-full px-6 md:px-10 pt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero */}
      <section className="w-full px-6 md:px-10 pt-10 pb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 leading-tight">
          Pricing that matches how
          <br />
          your business actually earns.
        </h1>
        <p className="text-base text-zinc-500 mt-4 max-w-xl mx-auto leading-relaxed">
          A real free tier, not a time-boxed trial. No card required to start, and every plan grows
          with you as your conversations do.
        </p>
      </section>

      {/* Tiers */}
      <section className="w-full px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col p-6 border ${
                tier.highlighted
                  ? 'border-amber-600 bg-amber-50/40 relative'
                  : 'border-zinc-200 bg-white'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 tracking-wide">
                  MOST POPULAR
                </span>
              )}
              <p className="text-sm font-semibold text-zinc-900">{tier.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-zinc-900 tracking-tight">{tier.price}</span>
                <span className="text-sm text-zinc-500">{tier.period}</span>
              </div>
              <p className="text-xs font-medium text-amber-700 mt-1.5">{tier.channels}</p>
              <p className="text-sm text-zinc-500 mt-3 leading-relaxed min-h-[40px]">{tier.description}</p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                    <Check size={15} className="text-amber-600 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth?mode=signup"
                className={`mt-6 w-full text-center py-2.5 text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-400 text-center mt-6 max-w-md mx-auto">
          Prices shown are starting points for the South African market and may be refined with
          pilot businesses before final launch pricing.
        </p>
      </section>

      {/* Flex & Circles */}
      <section className="w-full px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-zinc-200 bg-zinc-50 p-7">
            <p className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Pay-as-you-grow</p>
            <h3 className="text-xl font-semibold text-zinc-900 mt-2">inFlow Flex</h3>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              For seasonal businesses with irregular income. A small base fee plus a small charge
              per conversation handled — so a slow week costs next to nothing, and a busy week is
              clearly paying for itself.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white border border-zinc-200 p-3">
                <p className="text-base font-semibold text-zinc-900">R49</p>
                <p className="text-xs text-zinc-500 mt-0.5">base / mo</p>
              </div>
              <div className="bg-white border border-zinc-200 p-3">
                <p className="text-base font-semibold text-zinc-900">R1.20</p>
                <p className="text-xs text-zinc-500 mt-0.5">per conversation</p>
              </div>
              <div className="bg-white border border-zinc-200 p-3">
                <p className="text-base font-semibold text-zinc-900">Capped</p>
                <p className="text-xs text-zinc-500 mt-0.5">auto-converts to Starter</p>
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 bg-zinc-50 p-7">
            <p className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Group pricing</p>
            <h3 className="text-xl font-semibold text-zinc-900 mt-2">inFlow Circles</h3>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Stokvel-style group pricing. Five or more independent businesses — each keeping their
              own inbox and data — unlock a shared discount, the more businesses, the lower the
              cost per business.
            </p>
            <div className="mt-5 space-y-2">
              {[
                ['2–4 businesses', '10% off', 'R134/mo'],
                ['5–9 businesses', '20% off', 'R119/mo'],
                ['10+ businesses', '30% off', 'R104/mo'],
              ].map(([size, off, cost]) => (
                <div key={size} className="flex items-center justify-between bg-white border border-zinc-200 px-4 py-2.5 text-sm">
                  <span className="text-zinc-700">{size}</span>
                  <span className="text-amber-700 font-medium">{off}</span>
                  <span className="text-zinc-900 font-semibold">{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full px-6 md:px-10 py-8 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} inFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
