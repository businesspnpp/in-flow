import Link from 'next/link';
import { 
  ArrowRight, 
  CalendarCheck2, 
  CreditCard, 
  MessageSquareMore, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Globe,
  Inbox
} from 'lucide-react';

const featureCards = [
  {
    title: 'Unified Inbox',
    body: 'Handle WhatsApp, Instagram, Facebook, TikTok, and email conversations from one focused workspace.',
    Icon: MessageSquareMore,
    tag: 'Omnichannel'
  },
  {
    title: 'In-Chat Tools',
    body: 'Generate invoices, quotes, bookings, payment links, and promos without leaving the conversation.',
    Icon: Sparkles,
    tag: 'Utility'
  },
  {
    title: 'Bookings & Payments',
    body: 'Lock in appointments, send reminders, and collect money through fast actions your team can actually use.',
    Icon: CalendarCheck2,
    tag: 'Operations'
  },
  {
    title: 'Review Growth',
    body: 'Track Google review follow-ups and keep your best customers moving through a repeatable retention flow.',
    Icon: Star,
    tag: 'Retention'
  },
];

const statCards = [
  { label: 'Channels connected', value: '5+' },
  { label: 'Tools in chat', value: '8' },
  { label: 'Setup time', value: '< 15 min' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-zinc-900 selection:bg-[#795bf4]/10 selection:text-[#795bf4]">
      {/* 1. Global Announcement Banner (Inspired by Zendesk Masterclass Bar) */}
      <div className="bg-zinc-950 px-4 py-2.5 text-center text-xs font-medium text-zinc-300 transition-colors duration-150 hover:text-white">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block rounded bg-[#66dba3]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#66dba3]">
            New Update
          </span>
          <span>Dock 2026 Masterclass: Streamlining multi-channel operations for small teams.</span>
          <Link href="/login?mode=signup" className="inline-flex items-center gap-0.5 font-semibold text-white underline decoration-[#795bf4] underline-offset-2 hover:text-[#66dba3]">
            Get started free <ArrowRight size={12} />
          </Link>
        </span>
      </div>

      {/* 2. Premium Sticky Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-2.5xl font-bold tracking-tight text-zinc-950">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Platform
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-xl bg-[#795bf4] px-4.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#795bf4]/20 transition-all hover:bg-[#6847ef] hover:shadow-md"
            >
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* 3. Hero Section with Integrated Conversion Workspace */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#fafafa] pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            
            {/* Left Narrative Column */}
            <div className="flex flex-col space-y-6">
              <div className="inline-flex max-w-max items-center gap-2 rounded-full border border-[#66dba3]/30 bg-[#66dba3]/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#43af7b]">
                <Zap size={12} className="fill-current" /> Customer conversations, bookings, payments
              </div>
              
              <h1 className="text-5xl font-black tracking-tight text-zinc-950 md:text-6xl lg:text-7xl lg:leading-[1.02]">
                Move beyond distraction. Deliver real <span className="bg-gradient-to-r from-[#795bf4] to-[#6847ef] bg-clip-text text-transparent">resolutions</span>.
              </h1>
              
              <p className="max-w-xl text-lg font-normal leading-relaxed text-zinc-500 md:text-xl">
                Dock gives small businesses one beautifully unified place to manage chats, automate replies, send invoices, confirm bookings, and keep customers moving.
              </p>

              {/* Conversion Input Field Group (Zendesk-Inspired High-Converting Input Structure) */}
              <div className="pt-4">
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 sm:flex-row sm:max-w-xl">
                  <div className="relative flex-1">
                    <input 
                      type="email" 
                      placeholder="Enter work email" 
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none shadow-inner transition-focus focus:border-[#795bf4] focus:ring-2 focus:ring-[#795bf4]/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#795bf4]/10 transition-colors hover:bg-[#6847ef]"
                  >
                    Try for free
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </form>
                <p className="mt-3 text-xs text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#66dba3]" /> 14-day free trial. No credit card required.
                </p>
              </div>
            </div>

            {/* Right Column: Custom Built High-Fidelity App UI Mockup (Replaces Basic AI Grid Layouts) */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#66dba3]/20 to-[#795bf4]/10 blur-xl opacity-70"></div>
              
              <div className="relative rounded-[28px] border border-zinc-200 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-zinc-200"></span>
                      <span className="w-3 h-3 rounded-full bg-zinc-200"></span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-400 ml-2">Live Workspace Dashboard</span>
                  </div>
                  <span className="rounded-full bg-[#66dba3]/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#43af7b]">
                    active dock
                  </span>
                </div>

                {/* Simulated Conversation Feed Block */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Inbox size={13} className="text-[#795bf4]" /> WhatsApp Lead • Inbound
                      </span>
                      <span className="text-[10px] text-zinc-400">Just now</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-zinc-600">
                      &ldquo;Hi, I need to book an urgent alignment service and lock in tomorrow morning.&rdquo;
                    </p>
                  </div>

                  {/* Contextual Action Items Layered Over Interface */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-100 bg-white p-3.5 shadow-sm transition-all hover:border-[#66dba3]/50">
                      <div className="flex items-center gap-2 text-[#43af7b]">
                        <CalendarCheck2 size={14} />
                        <span className="text-xs font-bold">BookedIt Native</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">Confirm slot and project onto chat stream automatically.</p>
                      <button className="mt-2 w-full rounded-md bg-[#66dba3]/12 py-1 text-[11px] font-bold text-[#43af7b] transition-colors hover:bg-[#66dba3]/20">
                        Propose Time
                      </button>
                    </div>

                    <div className="rounded-xl border border-zinc-100 bg-white p-3.5 shadow-sm transition-all hover:border-[#795bf4]/50">
                      <div className="flex items-center gap-2 text-[#795bf4]">
                        <CreditCard size={14} />
                        <span className="text-xs font-bold">PayNow Engine</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">Generate instantly protected billing tokens inside conversation feed.</p>
                      <button className="mt-2 w-full rounded-md bg-[#795bf4]/8 py-1 text-[11px] font-bold text-[#795bf4] transition-colors hover:bg-[#795bf4]/15">
                        Request Payment
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#66dba3]/30 bg-[#66dba3]/5 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#43af7b]">System Integration Feed</p>
                    <p className="mt-1 text-xs text-zinc-600 font-medium">
                      One core workspace. No platform jumping, zero lost conversions, clean automated triggers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Elegant Minimal Customer Logo Cloud (Inspired by Zendesk Trust Bar) */}
        <section className="border-t border-b border-zinc-200/50 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Empowering High-Growth Business Teams Globally
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-xl font-black text-zinc-300 tracking-tight">
              <span className="transition-colors hover:text-zinc-400 cursor-default">SIEMENS</span>
              <span className="transition-colors hover:text-zinc-400 cursor-default">Uber</span>
              <span className="transition-colors hover:text-zinc-400 cursor-default">GitHub</span>
              <span className="transition-colors hover:text-zinc-400 cursor-default">box</span>
              <span className="transition-colors hover:text-zinc-400 cursor-default">TESCO</span>
              <span className="transition-colors hover:text-zinc-400 cursor-default">vimeo</span>
            </div>
          </div>
        </section>

        {/* 5. Minimalist Statistics Matrix / Value Proof Section */}
        <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 shadow-sm md:p-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">System Scalability</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
                Millions of successful operational signals managed daily.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3 border-t border-zinc-100 pt-8">
              {statCards.map((card) => (
                <div key={card.label} className="group">
                  <p className="text-4xl font-black tracking-tight text-zinc-950 transition-colors group-hover:text-[#795bf4] md:text-5xl">{card.value}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-500">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Dynamic Alternating Structural Showcase Section */}
        <section id="features" className="bg-zinc-900 py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-800 pb-12 mb-16">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Engineered for Modern Flow</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  A unified control center built directly around your customer journey.
                </h2>
              </div>
              <p className="mt-4 max-w-sm text-sm text-zinc-400 md:mt-0">
                Replace multi-tab complexity with lightweight workflow models designed to increase conversion rates across every communication channel natively.
              </p>
            </div>

            {/* Alternating Layout - Component 1: Visual Left, Content Right */}
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              
              {/* Product Visual Mock */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                  <span className="text-xs text-zinc-500 font-mono">analytics_retention_flow.sh</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                    <span className="text-xs text-zinc-400">Automated Review Trigger Loop</span>
                    <span className="text-xs font-bold text-[#66dba3]">82.4% success</span>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-400 space-y-1">
                    <p className="text-white font-medium">customer_retention_sequence:</p>
                    <p>↳ if interaction === &apos;resolved&apos; → dispatch feedback request</p>
                    <p>↳ if ranking === 5_star → prompt internal system sync pipeline</p>
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-6 lg:pl-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#66dba3]/10 text-[#66dba3]">
                  <Layers size={20} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Continuous Operation Optimizations</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Never manually ping a client for a review or follow up blindly again. The platform maps actions directly against standard client resolutions, instantly triggering automated data workflows to maximize internal retention metrics cleanly.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-medium text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#66dba3]" /> Complete automated feedback pipelines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#66dba3]" /> Intelligent CRM update parameters
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* 7. Comprehensive Modern Feature Grid Matrix */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Granular Feature Architecture</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
              Everything you need to scale customer pipelines.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ title, body, Icon, tag }) => (
              <div key={title} className="group relative rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#66dba3]/12 text-[#43af7b] transition-colors group-hover:bg-[#795bf4]/10 group-hover:text-[#795bf4]">
                    <Icon size={18} strokeWidth={2.25} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold tracking-tight text-zinc-950">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">{body}</p>
                <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center text-xs font-bold text-[#795bf4] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn configuration <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. High-Contrast Premium Conversion Closing CTA Section */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[32px] border border-zinc-950 bg-gradient-to-br from-zinc-900 to-zinc-950 px-8 py-12 text-white shadow-xl md:px-16 md:py-16">
            <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#795bf4]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#c7bbff]">Instant Onboarding Deployment</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                  Launch your first unified conversation dock today.
                </h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-400">
                  Browse custom pricing setups, map multi-platform communication goals, and launch native payment environments in under 15 minutes.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#66dba3]" /> Enterprise Data Encryption</span>
                  <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-[#66dba3]" /> Instant Action Log Tracking</span>
                  <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#66dba3]" /> 5+ Active Omni-Channels</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row shrink-0">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:border-zinc-700"
                >
                  Calculate ROI / Pricing
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#795bf4]/20 transition-all hover:bg-[#6847ef]"
                >
                  Create Free Account
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Comprehensive Corporate Footer Architecture (Structured similarly to Zendesk System Footer) */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs py-16">
        <div className="mx-auto max-w-7xl px-6 grid gap-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-7 w-7 grayscale contrast-200 brightness-200" />
              <span className="text-xl font-bold text-white tracking-tight">dock</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-xs">
              System optimization software built for next-generation communication flows and localized operational actions.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform Systems</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Unified Inbox Flow</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">In-Chat API Tokens</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">BookedIt Core Integration</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">PayNow Processing Engine</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Corporate Solutions</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Small Business Stack</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Omnichannel Analytics</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Customer Review Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Enterprise Capabilities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation & APIs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">System Status Monitor</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Trust Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Operational Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
          <p>&copy; 2026 Dock, Inc. All architectural system parameters reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-400 transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy Notice</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Cookie Configurations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
