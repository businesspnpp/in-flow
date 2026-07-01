'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  HelpCircle,
  Minus,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';

interface Tier {
  name: string;
  monthly: number;
  channels: string;
  tagline: string;
  description: string;
  features: string[];
  footnote: string;
  highlighted?: boolean;
  darkVariant?: boolean;
  cta: string;
}

const tiers: Tier[] = [
  {
    name: 'Free',
    monthly: 0,
    channels: '1 channel',
    tagline: 'Start automating instantly',
    description: 'For first-time operators who want to test Dock-Streams before committing budget.',
    features: [
      '1 channel connected (WhatsApp or IG)',
      '1 automation tool',
      '40 automated conversations per month',
      'Unified inbox with context tags',
      'Mobile money and EFT billing support',
      'Community support channel',
    ],
    footnote: 'Free forever. No credit card required.',
    cta: 'Start for free',
  },
  {
    name: 'Starter',
    monthly: 149,
    channels: '2 channels',
    tagline: 'Built for solo operators',
    description: 'Great for individual operators managing consistent customer volume.',
    features: [
      '2 active channels connected',
      '4 core tools (Booking, Orders, FAQ, Reminders)',
      'Unlimited monthly conversations',
      '1 calendar sync engine',
      'Mobile money, EFT, and card billing',
      'Direct email support',
    ],
    footnote: 'Most solo teams clear this in 1-2 paid bookings.',
    cta: 'Choose Starter',
  },
  {
    name: 'Growth',
    monthly: 349,
    channels: 'All channels',
    tagline: 'For high-velocity teams',
    description: 'Designed for teams scaling conversations, bookings, and payment operations.',
    features: [
      'All channels connected',
      'All 4 core automated workflows',
      'Unlimited conversations',
      'Unlimited calendar sync instances',
      '3 team seats included',
      'Priority support routing',
    ],
    footnote: 'Most teams moving beyond solo mode land here.',
    highlighted: true,
    cta: 'Choose Growth',
  },
  {
    name: 'Pro',
    monthly: 699,
    channels: 'All channels',
    tagline: 'Enterprise-grade orchestration',
    description: 'Built for multi-location teams and advanced operational control.',
    features: [
      'Everything in Growth',
      'Multi-location branch support',
      'Granular team roles and permissions',
      'Unlimited team users',
      'Real-time analytics dashboard',
      'Dedicated escalation support',
    ],
    footnote: 'For teams managing complex operational footprints.',
    darkVariant: true,
    cta: 'Choose Pro',
  },
];

type FeatureValue = boolean | string;

const comparisonGroups = [
  {
    group: 'Channels & Reach',
    rows: [
      { label: 'WhatsApp Business API Integration', values: [true, true, true, true] },
      { label: 'Instagram & Facebook DMs', values: [false, true, true, true] },
      { label: 'TikTok & Email Routing', values: [false, false, true, true] },
      { label: 'Total active channels', values: ['1 channel', '2 channels', 'All channels', 'All channels'] },
    ],
  },
  {
    group: 'Automation Mechanics',
    rows: [
      { label: 'Booking & Appointment Capture', values: ['1 active tool', true, true, true] },
      { label: 'Direct Order Capture', values: ['1 active tool', true, true, true] },
      { label: 'Contextual FAQ Auto-Replies', values: ['1 active tool', true, true, true] },
      { label: 'Automated Reminders & Follow-ups', values: ['1 active tool', true, true, true] },
      { label: 'Monthly conversation capacity', values: ['40 interactions', 'Unlimited', 'Unlimited', 'Unlimited'] },
    ],
  },
  {
    group: 'Team Infrastructure',
    rows: [
      { label: 'Calendar Sync', values: [false, '1 calendar', 'Unlimited', 'Unlimited'] },
      { label: 'Included team seats', values: ['1 seat', '1 seat', '3 seats', 'Unlimited seats'] },
      { label: 'Roles & permissions', values: [false, false, false, true] },
      { label: 'Multi-location support', values: [false, false, false, true] },
    ],
  },
];

const faqs = [
  {
    q: 'Is the Free tier genuinely free indefinitely?',
    a: 'Yes. Free is a permanent baseline tier with no expiration and no card requirement.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. You can move between plans from your account settings and changes apply on your next billing cycle.',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'Card, EFT, mobile money, and local payment gateway integrations are supported.',
  },
  {
    q: 'Do you support multi-location businesses?',
    a: 'Yes. Multi-location operations are supported in Pro with advanced roles and access controls.',
  },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) return <Check size={16} strokeWidth={1.5} className="mx-auto text-zinc-700" />;
  if (value === false) return <Minus size={14} strokeWidth={1.5} className="mx-auto text-zinc-300" />;
  return <span className="text-sm font-medium text-zinc-700">{value}</span>;
}

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [estimatedConversations, setEstimatedConversations] = useState(150);

  const calculateSuggestedPlan = (convos: number) => {
    if (convos <= 40) return { name: 'Free', cost: 'R0' };
    if (convos <= 300) return { name: 'Starter', cost: 'R149' };
    if (convos <= 1000) return { name: 'Growth', cost: 'R349' };
    return { name: 'Pro', cost: 'R699' };
  };

  const suggestedPlan = calculateSuggestedPlan(estimatedConversations);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-[#795bf4]/15">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/dock-icon-2.png" alt="Dock icon" className="h-9 w-9" />
            <span className="text-2xl font-extrabold tracking-tight">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-600 lg:flex">
            <Link href="/" className="hover:text-zinc-900">
              Product
            </Link>
            <span className="text-zinc-900">Pricing</span>
            <Link href="/privacy" className="inline-flex items-center gap-1 hover:text-zinc-900">
              <HelpCircle size={15} strokeWidth={1.5} />
              Help
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 py-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Return
          </button>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 md:text-7xl">
              Pricing matched to your scale.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl">
              From solo operators to multi-location teams, Dock scales with your customer operations workflow.
            </p>

            <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  !annual ? 'bg-white text-zinc-900 border border-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  annual ? 'bg-white text-zinc-900 border border-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Annual (Save 15%)
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <SlidersHorizontal size={16} strokeWidth={1.5} />
                Plan Matcher
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Interactive</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-zinc-600">Monthly conversations</span>
                <span className="text-zinc-900">{estimatedConversations === 1500 ? '1,500+' : estimatedConversations}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                value={estimatedConversations}
                onChange={(e) => setEstimatedConversations(Number(e.target.value))}
                className="w-full accent-[#795bf4]"
              />
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span>10</span>
                <span>1,500+</span>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Suggested</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-lg font-bold text-zinc-900">Dock {suggestedPlan.name}</p>
                <p className="inline-flex items-center gap-1 text-lg font-black text-zinc-900">
                  <Wallet size={16} strokeWidth={1.5} />
                  {suggestedPlan.cost}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-4 lg:grid-cols-4">
            {tiers.map((tier) => {
              const price = tier.monthly === 0 ? 0 : annual ? Math.round(tier.monthly * 0.85) : tier.monthly;
              const base = tier.darkVariant
                ? 'border-zinc-900 bg-zinc-950 text-white'
                : tier.highlighted
                ? 'border-[#795bf4] bg-[#795bf4]/6 text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-900';

              return (
                <div key={tier.name} className={`flex min-h-full flex-col rounded-xl border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${base}`}>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">{tier.name}</h2>
                        <p className={`mt-1 text-xs font-semibold ${tier.darkVariant ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.tagline}</p>
                      </div>
                      <span
                        className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          tier.darkVariant
                            ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                        }`}
                      >
                        {tier.channels}
                      </span>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">{price === 0 ? 'R0' : `R${price}`}</span>
                      <span className={`text-sm font-semibold ${tier.darkVariant ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {price === 0 ? 'forever' : '/mo'}
                      </span>
                    </div>

                    <p className={`mt-4 text-sm leading-relaxed ${tier.darkVariant ? 'text-zinc-300' : 'text-zinc-600'}`}>{tier.description}</p>
                  </div>

                  <Link
                    href="/login?mode=signup"
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                      tier.darkVariant ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-[#795bf4] text-white hover:bg-[#6847ef]'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>

                  <div className={`my-6 h-px ${tier.darkVariant ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check size={15} strokeWidth={1.5} className={`mt-0.5 shrink-0 ${tier.darkVariant ? 'text-zinc-300' : 'text-zinc-700'}`} />
                        <span className={tier.darkVariant ? 'text-zinc-300' : 'text-zinc-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className={`mt-5 text-[11px] italic ${tier.darkVariant ? 'text-zinc-500' : 'text-zinc-500'}`}>{tier.footnote}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Compare plans by capability</h3>

            <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Capability</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Free</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Starter</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Growth</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonGroups.map((group) => (
                    <tr key={group.group}>
                      <td colSpan={5} className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        {group.group}
                      </td>
                    </tr>
                  ))}
                  {comparisonGroups.flatMap((group) =>
                    group.rows.map((row) => (
                      <tr key={`${group.group}-${row.label}`} className="border-b border-zinc-100">
                        <td className="px-4 py-3 text-sm font-medium text-zinc-700">{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={`${row.label}-${idx}`} className="px-4 py-3 text-center">
                            <FeatureCell value={value} />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <h3 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Pricing FAQs</h3>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <div key={faq.q} className="rounded-xl border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenFaq(open ? null : idx)}
                  >
                    <span className="text-sm font-semibold text-zinc-900">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={`shrink-0 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-600">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
