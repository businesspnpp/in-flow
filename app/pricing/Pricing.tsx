'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  Minus, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  Users, 
  Sparkles, 
  Building2, 
  ArrowRight,
  TrendingUp
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
    description: 'For first-time operators who want to experience automated value before committing capital.',
    features: [
      '1 channel connected (WhatsApp or IG)',
      '1 automated tool of your choice',
      '40 automated conversations / month',
      'Tagged, context-aware unified inbox',
      'Mobile money & EFT billing support',
      'Community text support group',
    ],
    footnote: 'Free forever — no credit card required.',
    cta: 'Start for free',
  },
  {
    name: 'Starter',
    monthly: 149,
    channels: '2 channels',
    tagline: 'Built for solo operators',
    description: 'Perfect for single-chair salons, independent barbers, or solo consultants managing client volume.',
    features: [
      '2 active channels connected',
      'All 4 core tools (Booking, Orders, FAQ, Reminders)',
      'Unlimited monthly conversations',
      '1 calendar sync engine (Google/Apple)',
      'Mobile money, EFT & card billing',
      'Direct email support channels',
    ],
    footnote: 'Most solo businesses clear this cost in 2 bookings.',
    cta: 'Choose Starter',
  },
  {
    name: 'Growth',
    monthly: 349,
    channels: 'All channels',
    tagline: 'For high-velocity teams',
    description: 'Multiple staff members, a busy fulfillment kitchen, or teams scaling interaction volume across platforms.',
    features: [
      'All channels connected (WhatsApp, IG, FB, TikTok, Email)',
      'All 4 core automated workflows',
      'Unlimited conversations & automated updates',
      'Unlimited calendar synchronization instances',
      '3 core team seats included',
      'Priority routing for customer support tickets',
    ],
    footnote: 'The standard destination for scaling service teams.',
    highlighted: true,
    cta: 'Choose Growth',
  },
  {
    name: 'Pro',
    monthly: 699,
    channels: 'All channels',
    tagline: 'Enterprise-grade orchestration',
    description: 'Manage multiple operational sites, branch setups, or franchise-wide communications from one desk.',
    features: [
      'Everything included in the Growth tier',
      'Advanced multi-location branch support',
      'Granular team roles & access permissions',
      'Unlimited workspace team users',
      'Real-time operations analytics dashboard',
      'Dedicated manager priority support escalation',
    ],
    footnote: 'Engineered for operators controlling complex footprints.',
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
      { label: 'TikTok & Email Core Routing', values: [false, false, true, true] },
      { label: 'Total active channel pathways', values: ['1 channel', '2 channels', 'All channels', 'All channels'] },
    ],
  },
  {
    group: 'Automation Mechanics',
    rows: [
      { label: 'Booking & Appointment Capture', values: ['1 active tool', true, true, true] },
      { label: 'Direct Instant Order Capture', values: ['1 active tool', true, true, true] },
      { label: 'Contextual AI FAQ Auto-Replies', values: ['1 active tool', true, true, true] },
      { label: 'Automated Reminders & Follow-ups', values: ['1 active tool', true, true, true] },
      { label: 'Monthly conversation volume capacity', values: ['40 interactions', 'Unlimited', 'Unlimited', 'Unlimited'] },
    ],
  },
  {
    group: 'Team Management & Infrastructure',
    rows: [
      { label: 'Bi-directional Calendar Sync', values: [false, '1 calendar', 'Unlimited', 'Unlimited'] },
      { label: 'Included active team workspace seats', values: ['1 seat', '1 seat', '3 seats', 'Unlimited seats'] },
      { label: 'Granular user permissions & roles', values: [false, false, false, true] },
      { label: 'Multi-location operations support', values: [false, false, false, true] },
    ],
  },
  {
    group: 'Intelligence & Core Support',
    rows: [
      { label: 'Real-time performance analytics', values: [false, false, false, true] },
      { label: 'Dedicated priority support handling', values: [false, false, true, true] },
    ],
  },
];

const faqs = [
  {
    q: 'Is the Free tier genuinely free indefinitely?',
    a: 'Yes. The Free tier is built as a baseline infrastructure for micro-enterprises, not a hidden time-limited trial. There is no expiration timeline. You get access to 1 channel, 1 automation tool tool, and up to 40 managed interactions per month with absolutely zero card commitments required.',
  },
  {
    q: 'What is Dock Flex and how does the billing mechanism activate?',
    a: 'Flex is designed for businesses with high seasonal variability. It functions on a baseline subscription of R49/month plus a transactional fee of R1.20 per customer interaction fully processed by our automation tools. To keep your costs predictable, Flex includes a guardrail system: if your transactional volume pushes your total cost above the standard flat Starter rate, your billing auto-caps at the Starter fee for that cycle.',
  },
  {
    q: 'How do Dock Circles group discounts operate?',
    a: 'Inspired by collaborative stokvel dynamics, Circles allow 2 or more separate businesses to pool their networks to claim collective volume discounts. Each business operates completely independently with isolated messaging records, separate customer lists, and secure databases. Discounts scale naturally based on collective circle sizing: 10% off for 2-4 members, 20% off for 5-9 members, and 30% off for groups of 10 or more.',
  },
  {
    q: 'Can I dynamically scale or downgrade my plan options?',
    a: 'Absolutely. You can shift tiers, transition directly onto our custom Flex configuration, or adjust configurations instantly from your organization management dashboard. Adjustments are applied immediately on the following billing statement cycle.',
  },
  {
    q: 'Which regional financial settlement methods are supported?',
    a: 'We fully support credit/debit networks, direct manual and automated EFT options, along with integrated paths through SnapScan and PayFast gateways. Additionally, we provide mobile money integration, airtime balance billing structures, and weekly localized micro-payment frequencies for businesses balancing delicate immediate cash flows.',
  },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) return <Check size={18} className="text-[#66dba3] mx-auto" strokeWidth={3} />;
  if (value === false) return <Minus size={14} className="text-zinc-200 mx-auto" strokeWidth={2.5} />;
  return <span className="text-sm font-medium text-zinc-800">{value}</span>;
}

export default function PremiumPricingPage() {
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
    <div className="min-h-screen w-full flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-[#795bf4]/15 selection:text-[#4c35bc] font-sans antialiased">
      
      {/* Premium Header */}
      <header className="w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/dock-icon-2.png" alt="Dock icon" className="w-12 h-12 transform group-hover:scale-105 transition-transform duration-200" />
            <span className="text-xl font-bold text-zinc-900 tracking-tight">Dock</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">Product</Link>
            <span className="text-sm font-bold text-zinc-900 relative after:absolute after:bottom-[-29px] after:left-0 after:right-0 after:h-[2px] after:bg-[#795bf4]">Pricing</span>
            <a href="#" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1.5">
              <HelpCircle size={16} />
              Help & Resources
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold px-4 py-2.5 text-zinc-600 hover:text-zinc-900 transition-colors">
              Sign in
            </Link>
            <Link href="/login?mode=signup" className="text-sm font-bold px-5 py-2.5 bg-[#795bf4] text-white hover:bg-[#6847ef] transition-all shadow-sm hover:shadow-md">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Return Hook */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Return to Dashboard
        </button>
      </div>

      {/* Intercom-Style Asymmetric Split Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Column: Clean text-only tech badge instead of AI layout */}
        <div className="lg:col-span-7 text-left space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.92]">
            Pricing matched to your scale.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-xl font-medium leading-relaxed">
            Eliminate restrictive licensing. Deploy a permanent free foundation, adjust seasonal workflows with usage-based flexibility, or drop overhead with community pricing loops.
          </p>

          {/* Billing Switcher Button Toggle */}
          <div className="inline-flex items-center p-1.5 bg-zinc-200/60 rounded-none border border-zinc-200 mt-4">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 text-sm font-bold transition-all ${
                !annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Commit Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Commit Annually
              <span className="text-[10px] font-extrabold tracking-wide text-[#5a3fe0] bg-[#795bf4]/12 border border-[#795bf4]/20 px-1.5 py-0.5 uppercase">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Right Side Column: Dynamic Calculator Widget */}
        <div className="lg:col-span-5 bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="font-bold text-base tracking-tight text-zinc-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#66dba3]" /> Plan Matcher Estimate
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase">Interactive</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-zinc-600">Expected monthly conversations:</span>
              <span className="text-[#66dba3] text-base font-black">{estimatedConversations === 1500 ? '1,500+' : estimatedConversations}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="1500" 
              step="10"
              value={estimatedConversations} 
              onChange={(e) => setEstimatedConversations(Number(e.target.value))}
              className="w-full accent-[#795bf4] bg-zinc-200 h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-bold">
              <span>10 conversations</span>
              <span>1,500+ interactions</span>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 border border-zinc-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Suggested Configuration</p>
              <p className="text-lg font-black text-zinc-900 mt-0.5">Dock {suggestedPlan.name} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#66dba3]">{suggestedPlan.cost}</p>
              <p className="text-[10px] font-bold text-zinc-400">estimated base / mo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Tier Blueprint Grid */}
      <section className="w-full max-w-[88rem] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-2 lg:grid-cols-[1.05fr_1.05fr_1.2fr_1.2fr] lg:gap-6">
          {tiers.map((tier) => {
            const price = tier.monthly === 0 ? 0 : annual ? Math.round(tier.monthly * 0.85) : tier.monthly;
            
            return (
              <div
                key={tier.name}
                className={`flex flex-col min-w-0 p-8 border-2 transition-all duration-200 relative ${
                  tier.highlighted 
                    ? 'border-[#795bf4] bg-[#795bf4]/8 shadow-[6px_6px_0px_0px_rgba(121,91,244,0.78)]' 
                    : tier.darkVariant
                    ? 'border-zinc-900 bg-zinc-950 text-white shadow-[6px_6px_0px_0px_rgba(24,24,27,1)]'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm'
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3.5 left-6 bg-[#795bf4] text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase border border-[#6847ef]">
                    MOST POPULAR DEPLOYMENT
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{tier.name}</h2>
                    <p className={`text-xs font-medium mt-1 ${tier.darkVariant ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.tagline}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 border ${
                    tier.darkVariant 
                      ? 'bg-zinc-800 border-zinc-700 text-[#c7bbff]' 
                      : 'bg-[#795bf4]/12 border-[#795bf4]/20 text-[#4c35bc]'
                  }`}>
                    {tier.channels}
                  </span>
                </div>

                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">
                    {price === 0 ? 'R0' : `R${price}`}
                  </span>
                  <span className={`text-sm font-semibold ${tier.darkVariant ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {price === 0 ? 'forever' : '/ mo'}
                  </span>
                </div>
                {annual && price !== 0 && (
                  <p className="text-[11px] font-bold text-[#66dba3] mt-1 uppercase tracking-wider">Billed annually upfront</p>
                )}

                <p className={`text-sm mt-5 leading-relaxed font-medium ${tier.darkVariant ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {tier.description}
                </p>

                <div className="mt-8">
                  <Link
                    href="/login?mode=signup"
                    className={`w-full block text-center px-5 py-3.5 text-sm font-bold tracking-tight transform active:scale-[0.99] transition-all rounded-none ${
                      tier.highlighted
                        ? 'bg-[#795bf4] hover:bg-[#6847ef] text-white shadow-sm'
                        : tier.darkVariant
                        ? 'bg-[#795bf4] hover:bg-[#8d73f6] text-white font-black'
                        : 'bg-[#795bf4] hover:bg-[#6847ef] text-white'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>

                <div className={`h-px my-8 ${tier.darkVariant ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

                <p className={`text-[11px] font-extrabold uppercase tracking-widest mb-4 ${tier.darkVariant ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  Included capabilities
                </p>
                <ul className="space-y-3.5 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                      <Check size={16} className="text-[#66dba3] shrink-0 mt-0.5" strokeWidth={3} />
                      <span className={tier.darkVariant ? 'text-zinc-300' : 'text-zinc-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`h-px my-6 ${tier.darkVariant ? 'bg-zinc-900' : 'bg-zinc-100'}`} />
                <p className={`text-[11px] font-bold italic ${tier.darkVariant ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {tier.footnote}
                </p>
              </div>
            );
          })}
        </div>
        
        <p className="text-[11px] text-zinc-400 text-center mt-10 max-w-xl mx-auto font-medium leading-relaxed">
          * Regional benchmark modeling calculated for Southern African markets. Pricing indices may execute refinements in synergy with early sandbox pilot operators prior to official billing framework launches.
        </p>
      </section>

      {/* Universal Baseline Horizontal Callout Band */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-zinc-950 text-white p-10 md:p-12 border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(121,91,244,0.78)] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-[#795bf4]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl">
            <span className="text-[11px] font-black tracking-widest text-[#c7bbff] uppercase bg-[#8d73f6]/10 border border-[#795bf4]/20 px-2.5 py-1">
              STANDARD FOUNDATION INFRASTRUCTURE
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-4">
              Core platform parameters enabled across every account tier
            </h3>
            <p className="text-zinc-400 text-sm font-medium mt-2 max-w-xl">
              Zero compromises on vital operations. Every transaction strategy, reporting record, and pipeline tool scales down to the entry ledger.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 border-t border-zinc-800 pt-8">
            {[
              'Context-aware historical unified inbox',
              'Visual zero-code logic builder setup',
              'Omni-directional dual calendar sync engines',
              'Uncapped message log histories',
              'Mobile money & automated EFT systems',
              'Native integration with SnapScan & PayFast gateways',
              'Weekly micro-payment billing option setups',
              'Standard email developer support channels',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check size={16} className="text-[#66dba3] shrink-0 mt-0.5" strokeWidth={3} />
                <span className="text-sm text-zinc-300 font-medium leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Custom Add-on Modules (Flex & Circles) */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Flex Addon Callout */}
          <div className="lg:col-span-6 bg-white border-2 border-zinc-900 p-8 md:p-10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#4c35bc] bg-[#795bf4]/12 px-2.5 py-1 uppercase border border-[#795bf4]/20">
                VARIABLE METRICS
              </span>
              <h3 className="text-3xl font-black tracking-tight text-zinc-900">Dock Flex Billing Plan</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-md">
                Engineered for seasonal enterprises or businesses fluctuating on unpredictable demand trends. Retain operations on near-zero cost parameters when trade quietens down.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <p className="text-xl font-black text-zinc-900">R49</p>
                <p className="text-[11px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wide">Base fee / mo</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <p className="text-xl font-black text-zinc-900">R1.20</p>
                <p className="text-[11px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wide">Per conversation</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-4 flex flex-col justify-center items-center border-dashed">
                <p className="text-xs font-extrabold text-[#795bf4] uppercase flex items-center gap-1">
                  Auto-Cap
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5 font-medium leading-none">Protects against overages</p>
              </div>
            </div>
          </div>

          {/* Circles Callout */}
          <div className="lg:col-span-6 bg-white border-2 border-zinc-900 p-8 md:p-10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#4c35bc] bg-[#795bf4]/12 px-2.5 py-1 uppercase border border-[#795bf4]/20">
                COMMUNITY NETWORKS
              </span>
              <h3 className="text-3xl font-black tracking-tight text-zinc-900">Dock Circles Pools</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-md">
                Stokvel-inspired localized community cost pooling. Group purchasing scale for decentralized independent operators to collapse structural overhead.
              </p>
            </div>

            <div className="mt-8 space-y-2">
              {[
                { size: '2–4 integrated businesses', benefit: '10% subscription cut', cost: 'R134 / mo base' },
                { size: '5–9 integrated businesses', benefit: '20% subscription cut', cost: 'R119 / mo base' },
                { size: '10+ bundled operations', benefit: '30% subscription cut', cost: 'R104 / mo base' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm font-semibold">
                  <span className="text-zinc-600 flex items-center gap-2">
                    <Users size={14} className="text-zinc-400" /> {row.size}
                  </span>
                  <span className="text-[#795bf4] font-extrabold text-xs bg-[#795bf4]/10 border border-[#795bf4]/20 px-2 py-0.5">{row.benefit}</span>
                  <span className="text-zinc-900 font-black">{row.cost}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Social Trust Proof Testimonial Section Block */}
      <section className="w-full bg-zinc-100 border-t border-b border-zinc-200 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center text-[#8d73f6] gap-1">
            {[...Array(5)].map((_, i) => (
              <Zap key={i} size={18} className="fill-current text-[#795bf4]" />
            ))}
          </div>
          <h4 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 max-w-3xl mx-auto leading-tight">
            “Deploying Dock across our WhatsApp channels automated over 70% of our frontline booking capture in under three weeks. The interface design and flexible regional settlement options are an absolute standard.”
          </h4>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-zinc-900">Muzi Khumalo</p>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Operations Lead, The Barber Hub Franchise</p>
          </div>
        </div>
      </section>

      {/* Comprehensive Feature Breakdown Matrix */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">
            Granular structural comparison
          </h2>
          <p className="text-base text-zinc-500 font-medium max-w-md mx-auto">
            Deep dive architectural parameter breakdowns across our operational workflows.
          </p>
        </div>

        <div className="overflow-x-auto border-2 border-zinc-900 bg-white shadow-[6px_6px_0px_0px_rgba(24,24,27,1)]">
          <table className="w-full min-w-[760px] border-collapse table-fixed">
            <colgroup>
              <col className="w-[36%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-zinc-900">
                <th className="text-left text-xs font-black uppercase tracking-wider text-zinc-400 py-5 pl-6 bg-zinc-50/50">Core Matrices</th>
                {tiers.map((tier) => (
                  <th key={tier.name} className="text-center py-5 px-3 bg-zinc-50/50">
                    <span className={`text-sm font-black tracking-tight block ${tier.highlighted ? 'text-[#795bf4]' : 'text-zinc-900'}`}>
                      {tier.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonGroups.map((group) => (
                <Fragment key={group.group}>
                  <tr className="bg-zinc-100 border-b border-zinc-200">
                    <td colSpan={5} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest py-3 pl-6">
                      {group.group}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-100 hover:bg-zinc-50/40 transition-colors">
                      <td className="text-sm text-zinc-700 font-medium py-4 pl-6 pr-4 border-r border-zinc-100">{row.label}</td>
                      {row.values.map((value, i) => (
                        <td key={i} className="text-center py-4 px-3 border-r border-zinc-100 last:border-r-0">
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
      </section>

      {/* Accordion FAQ Layout Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900">Frequently Examined Frameworks</h2>
          <p className="text-sm text-zinc-500 font-medium">Clear answers to fundamental parameters, payment lines, and operational constraints.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div 
                key={item.q} 
                className="bg-white border-2 border-zinc-900 transition-all shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-base font-black text-zinc-950 pr-6">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-500 shrink-0 transform transition-transform duration-200 ${open ? 'rotate-180 text-[#795bf4]' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>
                <div 
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    open ? 'max-h-60 border-t border-zinc-100' : 'max-h-0'
                  }`}
                >
                  <p className="text-sm text-zinc-600 leading-relaxed p-6 bg-zinc-50 font-medium">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industrial High-Contrast Bottom Conversion Callout */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="border-4 border-zinc-900 bg-[#8d73f6] p-10 md:p-16 text-center shadow-[10px_10px_0px_0px_rgba(24,24,27,1)] relative overflow-hidden">
          <div className="absolute left-0 bottom-0 translate-y-6 -translate-x-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-950 max-w-2xl mx-auto leading-none">
            Consolidate your customer interactions today.
          </h2>
          <p className="text-base text-zinc-900 font-semibold mt-4 max-w-md mx-auto leading-relaxed">
            Initialize your permanent Free dashboard tier instantly. Elevate and pivot configurations as message routing scale intensifies.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#795bf4] text-white text-sm font-black tracking-tight hover:bg-[#6847ef] transition-colors flex items-center justify-center gap-2"
            >
              Deploy Free Architecture <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a
              href="#"
              className="w-full sm:w-auto px-6 py-4 bg-white text-zinc-950 border-2 border-zinc-900 text-sm font-bold hover:bg-zinc-50 transition-colors"
            >
              Speak to Product Engineers
            </a>
          </div>
        </div>
      </section>

      {/* Refined Terminal Footer */}
      <footer className="w-full px-6 py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/dock-icon-2.png" alt="Dock icon" className="w-9 h-9" />
            <span className="text-sm font-bold text-zinc-900 tracking-tight">Dock Automation Corp</span>
          </div>
          <p className="text-xs font-medium text-zinc-400">
            © {new Date().getFullYear()} Dock Core Systems. All programmatic rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
