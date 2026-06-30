'use client';

import { Fragment } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Minus, Zap, HelpCircle, ChevronDown } from 'lucide-react';

interface Tier {
  name: string;
  monthly: number;
  channels: string;
  tagline: string;
  description: string;
  features: string[];
  footnote: string;
  highlighted?: boolean;
  cta: string;
}

const tiers: Tier[] = [
  {
    name: 'Free',
    monthly: 0,
    channels: '1 channel',
    tagline: 'Start automating, no card needed',
    description: 'For first-time software buyers who want to feel the value before paying anything.',
    features: [
      '1 channel connected (WhatsApp, Instagram, or Facebook)',
      '1 tool of your choice',
      '40 conversations / month',
      'Tagged, context-aware inbox',
      'Mobile money & EFT billing',
      'Community support',
    ],
    footnote: 'Free forever — not a time-boxed trial.',
    cta: 'Start for free',
  },
  {
    name: 'Starter',
    monthly: 149,
    channels: '2 channels',
    tagline: 'Built for solo operators',
    description: 'Run a single-chair salon, barbershop, or one-person service business end to end.',
    features: [
      '2 channels connected',
      'All 4 built-in tools (Booking, Orders, FAQ, Reminders)',
      'Unlimited conversations',
      '1 calendar sync (Google or Apple)',
      'Mobile money & EFT billing',
      'Email support',
    ],
    footnote: 'Most solo operators pay this off in 2-3 bookings.',
    cta: 'Choose Starter',
  },
  {
    name: 'Growth',
    monthly: 349,
    channels: 'All channels',
    tagline: 'For teams that are scaling up',
    description: 'Multiple stylists, a busy kitchen, or a team handling volume across every channel.',
    features: [
      'All channels connected (WhatsApp, IG, FB, TikTok, email)',
      'All 4 built-in tools',
      'Unlimited conversations',
      'Unlimited calendar sync',
      '3 team users included',
      'Priority email support',
    ],
    footnote: 'The plan most growing teams land on.',
    highlighted: true,
    cta: 'Choose Growth',
  },
  {
    name: 'Pro',
    monthly: 699,
    channels: 'All channels',
    tagline: 'Multi-location & franchise-ready',
    description: 'Run several branches or a franchise-style operation from a single workspace.',
    features: [
      'Everything in Growth',
      'Multi-location support',
      'Team roles & permissions',
      'Unlimited team users',
      'Analytics dashboard',
      'Priority support',
    ],
    footnote: 'Built for operators managing more than one site.',
    cta: 'Choose Pro',
  },
];

type FeatureValue = boolean | string;

const comparisonGroups: { group: string; rows: { label: string; values: FeatureValue[] }[] }[] = [
  {
    group: 'Channels',
    rows: [
      { label: 'WhatsApp Business', values: [true, true, true, true] },
      { label: 'Instagram & Facebook DMs', values: [false, true, true, true] },
      { label: 'TikTok & email', values: [false, false, true, true] },
      { label: 'Channels included', values: ['1', '2', 'All', 'All'] },
    ],
  },
  {
    group: 'Tools',
    rows: [
      { label: 'Booking & Scheduling', values: ['1 tool of choice', true, true, true] },
      { label: 'Order Capture', values: ['1 tool of choice', true, true, true] },
      { label: 'FAQ Auto-Reply', values: ['1 tool of choice', true, true, true] },
      { label: 'Reminders & Follow-ups', values: ['1 tool of choice', true, true, true] },
      { label: 'Conversations / month', values: ['40', 'Unlimited', 'Unlimited', 'Unlimited'] },
    ],
  },
  {
    group: 'Calendar & team',
    rows: [
      { label: 'Calendar sync (Google/Apple)', values: [false, '1 calendar', 'Unlimited', 'Unlimited'] },
      { label: 'Team users', values: ['1', '1', '3', 'Unlimited'] },
      { label: 'Team roles & permissions', values: [false, false, false, true] },
      { label: 'Multi-location support', values: [false, false, false, true] },
    ],
  },
  {
    group: 'Insights',
    rows: [
      { label: 'Analytics dashboard', values: [false, false, false, true] },
      { label: 'Priority support', values: [false, false, true, true] },
    ],
  },
];

const faqs = [
  {
    q: 'Is the Free plan really free forever?',
    a: 'Yes. Free is not a time-boxed trial — there is no expiry date. You get 1 channel, 1 tool, and 40 conversations a month for as long as you want, with no card required to start.',
  },
  {
    q: 'What is inFlow Flex and how is it billed?',
    a: 'Flex is a pay-as-you-grow option for seasonal businesses: a R49/month base fee plus R1.20 per conversation a tool actually handles. If usage in a month would cost more than the flat Starter rate, you are automatically capped and billed at the Starter rate instead — you never pay more than the flat tier would cost.',
  },
  {
    q: 'How does inFlow Circles group pricing work?',
    a: 'Five or more independent businesses — each keeping their own separate inbox, customers, and data — can form a Circle to unlock a shared discount. The discount scales with group size: 10% off at 2–4 businesses, 20% off at 5–9, and 30% off at 10+.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes, you can upgrade, downgrade, or switch to Flex at any time from your workspace settings. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'Card, EFT, and SnapScan/PayFast are supported on every plan. Mobile money, airtime billing, and a weekly payment option for cash-flow-sensitive businesses are also available.',
  },
  {
    q: 'Do you offer discounts for annual billing?',
    a: 'Annual billing is coming soon and will offer a meaningful discount over paying monthly. Join the Starter, Growth, or Pro waitlist and we will notify you when it is available.',
  },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) return <Check size={16} className="text-amber-600 mx-auto" />;
  if (value === false) return <Minus size={14} className="text-zinc-300 mx-auto" />;
  return <span className="text-sm text-zinc-700">{value}</span>;
}

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Top nav */}
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-10">
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
      <section className="w-full px-6 md:px-10 pt-10 pb-12 text-center">
        <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 tracking-wide uppercase">
          Built for African micro-enterprises
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.05] mt-5">
          Pricing that matches how
          <br />
          your business actually earns.
        </h1>
        <p className="text-base md:text-lg text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed">
          A real free tier, not a time-boxed trial. No card required to start, and every plan grows
          with you — pay flat, pay as you go, or pool costs with other businesses in a Circle.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 mt-8 border border-zinc-200 p-1 bg-zinc-50">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              !annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            Pay monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2 ${
              annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            Pay annually
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5">Save 15%</span>
          </button>
        </div>
      </section>

      {/* Tiers */}
      <section className="w-full px-6 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto pt-4 flex flex-row items-stretch overflow-x-auto gap-4 md:gap-5 [&>*+*]:-ml-px">
          {tiers.map((tier) => {
            const price = tier.monthly === 0 ? 0 : annual ? Math.round(tier.monthly * 0.85) : tier.monthly;
            return (
              <div
                key={tier.name}
                className={`flex flex-col flex-1 min-w-[340px] md:min-w-[380px] p-8 md:p-10 border relative ${
                  tier.highlighted ? 'border-amber-600 bg-amber-50/40' : 'border-zinc-200 bg-white'
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-9 bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 tracking-wide">
                    MOST POPULAR
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold text-zinc-900">{tier.name}</p>
                    <p className="text-sm text-zinc-500 mt-1">{tier.tagline}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1">
                    {tier.channels}
                  </span>
                </div>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold text-zinc-900 tracking-tight">
                    {price === 0 ? 'R0' : `R${price}`}
                  </span>
                  <span className="text-base text-zinc-500">{price === 0 ? 'forever' : '/ month'}</span>
                </div>
                {annual && price !== 0 && <p className="text-xs text-zinc-400 mt-1">billed annually</p>}

                <p className="text-sm text-zinc-600 mt-4 leading-relaxed">{tier.description}</p>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link
                    href="/auth?mode=signup"
                    className={`text-center px-5 py-3 text-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                  <span className="text-xs text-zinc-400 self-center">{tier.footnote}</span>
                </div>

                <div className="h-px bg-zinc-200 my-7" />

                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4">What's included</p>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <Check size={16} className="text-amber-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-400 text-center mt-8 max-w-md mx-auto">
          Prices shown are starting points for the South African market and may be refined with
          pilot businesses before final launch pricing.
        </p>
      </section>

      {/* What's included band */}
      <section className="w-full px-6 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto border border-zinc-200 bg-zinc-950 p-8 md:p-10">
          <p className="text-sm font-semibold text-amber-400 tracking-wide uppercase">Every plan includes</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
            {[
              'Tagged, context-aware inbox',
              'No-code workflow setup',
              'Two-way calendar sync',
              'Unlimited message history',
              'Mobile money & EFT billing',
              'SnapScan / PayFast support',
              'Weekly payment option',
              'Email support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <Check size={15} className="text-amber-400 shrink-0" />
                <span className="text-sm text-zinc-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flex & Circles */}
      <section className="w-full px-6 md:px-10 pb-16">
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

      {/* Full comparison table */}
      <section className="w-full px-6 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 text-center">
            Compare plans in detail
          </h2>
          <p className="text-sm text-zinc-500 text-center mt-2 mb-10">
            Everything each tier unlocks, side by side.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse table-fixed">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[16.5%]" />
                <col className="w-[16.5%]" />
                <col className="w-[16.5%]" />
                <col className="w-[16.5%]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-zinc-500 pb-4 pl-2">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className="text-center pb-4 px-2">
                      <span className={`text-sm font-semibold ${tier.highlighted ? 'text-amber-700' : 'text-zinc-900'}`}>
                        {tier.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonGroups.map((group) => (
                  <Fragment key={group.group}>
                    <tr className="bg-zinc-50">
                      <td colSpan={5} className="text-xs font-semibold text-zinc-500 uppercase tracking-wide py-2 pl-2">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-zinc-100">
                        <td className="text-sm text-zinc-700 py-3 pl-2">{row.label}</td>
                        {row.values.map((value, i) => (
                          <td key={i} className="text-center py-3 px-2">
                            <FeatureCell value={value} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-6 md:px-10 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-10 divide-y divide-zinc-200 border-t border-b border-zinc-200">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="text-sm font-semibold text-zinc-900 pr-6">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && <p className="text-sm text-zinc-500 leading-relaxed pb-5 pr-10">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto border border-zinc-200 bg-amber-50/50 p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            Ready to run your business from one place?
          </h2>
          <p className="text-sm text-zinc-500 mt-3 max-w-md mx-auto">
            Start free, no card required. Upgrade whenever your conversations outgrow the basics.
          </p>
          <Link
            href="/auth?mode=signup"
            className="inline-block mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-sm font-semibold transition-colors"
          >
            Start for free
          </Link>
        </div>
      </section>

      <footer className="w-full px-6 md:px-10 py-8 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} inFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
