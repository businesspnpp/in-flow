import Link from 'next/link';
import { ArrowRight, Calendar, CreditCard, MessageSquare, Shield, Sparkles, Star, Zap, BarChart3, Users2 } from 'lucide-react';

const brands = ['WhatsApp', 'Instagram', 'Messenger', 'TikTok', 'Google', 'Shopify'];

const metricStats = [
  { value: '99.9%', label: 'Uptime SLA promised' },
  { value: '5+', label: 'Native channels sync' },
  { value: '14m', label: 'Average onboarding' },
];

const features = [
  {
    tag: 'Omnichannel',
    title: 'Unified Customer Workspace',
    description: 'Consolidate distributed messages across WhatsApp, Instagram, and SMS into a single high-throughput desktop queue built for speed.',
    Icon: MessageSquare,
  },
  {
    tag: 'Automation',
    title: 'Contextual In-Chat Actions',
    description: 'Generate itemized quotes, push secure payment triggers, and update service parameters directly inside the active chat timeline.',
    Icon: Sparkles,
  },
  {
    tag: 'Transactions',
    title: 'Automated Deposits & Ledgers',
    description: 'Lock down physical calendar appointments and secure upfront billing simultaneously. Zero application hopping for your operators.',
    Icon: CreditCard,
  },
  {
    tag: 'Reputation',
    title: 'Closed-Loop Feedback Cycles',
    description: 'Trigger targeted Google and Trustpilot review requests instantly upon successful transactional thresholds to scale social proof.',
    Icon: Star,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fff] font-sans antialiased text-zinc-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Global Banner Announcement */}
      <div className="bg-zinc-950 px-4 py-2 text-center text-xs font-medium tracking-wide text-zinc-300 border-b border-zinc-800">
        Introducing Dock Enterprise Sync — Multi-location routing for distributed operations. <span className="text-white underline ml-1 cursor-pointer hover:text-indigo-400 transition-colors">Read announcement</span>
      </div>

      {/* Premium Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 shadow-sm">
              <span className="text-sm font-black text-white tracking-tighter">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/features" className="text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-950">Features</Link>
            <Link href="/solutions" className="text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-950">Solutions</Link>
            <Link href="/pricing" className="text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-950">Pricing</Link>
            <span className="h-4 w-px bg-zinc-200" />
            <Link href="/login" className="text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-950">Sign in</Link>
            <Link
              href="/login?mode=signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-950 px-4 text-[13px] font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] shadow-sm"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Premium Enterprise Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50/50 via-white to-white py-20 lg:py-32 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
              
              {/* Left Column Text Block */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 shadow-sm">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Operations Control Suite
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl lg:leading-[1.08]">
                  The operational layer for high-velocity customer teams.
                </h1>
                
                <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                  Consolidate real-time communications, programmatic workflows, payments, and client bookings into a secure, single-pane infrastructure framework built for scale.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login?mode=signup"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] shadow-md shadow-zinc-950/10"
                  >
                    Deploy Workspace Free
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    Request Demo Stack
                  </Link>
                </div>

                {/* Micro Brand Validation */}
                <div className="pt-6 border-t border-zinc-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Native Platform Syncing</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-zinc-500">
                    {brands.map((brand) => (
                      <span key={brand} className="hover:text-zinc-950 transition-colors cursor-default">{brand}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column App Display Block (Zendesk & Intercom Aesthetic) */}
              <div className="lg:col-span-5 relative">
                <div className="absolute inset-0 -m-4 rounded-[40px] bg-gradient-to-tr from-zinc-200/40 via-indigo-50/10 to-zinc-100/40 blur-xl" />
                <div className="relative rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-200/80">
                  
                  {/* Console Interface Mirror */}
                  <div className="rounded-[10px] border border-zinc-100 bg-zinc-950 p-5 text-white">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-zinc-700" />
                        <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">Live Queue Overview</span>
                      </div>
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 uppercase border border-indigo-500/20">Active Node</span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="rounded-lg bg-zinc-900 p-3.5 border border-zinc-800">
                        <p className="text-[11px] font-bold text-zinc-400">INBOUND EVENT — WHATSAPP BUSINESS API</p>
                        <p className="mt-1 text-sm font-medium text-white">Confirm availability window: July 2nd, AM slot</p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                          <span>User ID: usr_9084x</span>
                          <span className="text-emerald-400 font-semibold">Matched Intent</span>
                        </div>
                      </div>

                      <div className="grid gap-3 grid-cols-2">
                        <div className="rounded-lg bg-zinc-900 p-3 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                            <Calendar size={13} />
                            <span>Dispatch Ledger</span>
                          </div>
                          <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">Commit calendar allocations directly into message buffer.</p>
                        </div>
                        <div className="rounded-lg bg-zinc-900 p-3 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                            <CreditCard size={13} />
                            <span>Secure Checkout</span>
                          </div>
                          <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">Generate contextual tokenized Stripe routing hooks.</p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-zinc-900/40 p-3 border border-dashed border-zinc-800 text-center">
                        <span className="text-[11px] text-zinc-500">Operator metrics: 4.8m resolution mean runtime</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic Metric Counter Section */}
        <section className="bg-zinc-50/50 border-b border-zinc-100 py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {metricStats.map((stat) => (
                <div key={stat.label} className="flex flex-col sm:items-center sm:text-center">
                  <span className="text-3xl font-bold tracking-tight text-zinc-950">{stat.value}</span>
                  <span className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Matrix Grid Section */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl space-y-4 mb-20">
              <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Core Capabilities</span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Engineered for high volume. Configured for efficiency.</h2>
              <p className="text-zinc-600 leading-relaxed">
                Stop wiring disparate notification webhooks together. Dock encapsulates your primary customer actions into native systems architecture.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ tag, title, description, Icon }) => (
                <div key={title} className="group relative flex flex-col justify-between space-y-4 rounded-xl transition-all">
                  <div className="space-y-4">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 text-zinc-900 border border-zinc-100 shadow-sm group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 block mb-1">{tag}</span>
                      <h3 className="text-base font-bold tracking-tight text-zinc-950">{title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-500 font-normal">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Security / Infrastructure Section */}
        <section className="bg-zinc-50 py-20 border-t border-b border-zinc-200/60">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-3">
                <div className="text-zinc-950"><Shield size={20} className="text-zinc-900" /></div>
                <h4 className="text-sm font-bold text-zinc-950 tracking-tight">Bank-Grade Compliance</h4>
                <p className="text-xs leading-relaxed text-zinc-500">Full end-to-end payload encryption across all messaging endpoints matching standard SOC2 protocol structures.</p>
              </div>
              <div className="space-y-3">
                <div className="text-zinc-950"><Zap size={20} className="text-zinc-900" /></div>
                <h4 className="text-sm font-bold text-zinc-950 tracking-tight">High-Throughput Engines</h4>
                <p className="text-xs leading-relaxed text-zinc-500"> sub-100ms pipeline execution ensures instant syncing between incoming communication nodes and web view interfaces.</p>
              </div>
              <div className="space-y-3">
                <div className="text-zinc-950"><Users2 size={20} className="text-zinc-900" /></div>
                <h4 className="text-sm font-bold text-zinc-950 tracking-tight">Granular Team Control</h4>
                <p className="text-xs leading-relaxed text-zinc-500">Control system states with fine-grained agent parameter provisioning, advanced audit logging, and automated routing rules.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sophisticated Corporate Closing Call To Action */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-950 px-8 py-16 text-white shadow-xl md:px-16 md:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,48,163,0.15),transparent_45%)]" />
            
            <div className="relative max-w-2xl space-y-6">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Onboarding Architecture</span>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl lg:leading-[1.1]">
                Scale operations without expanding overhead.
              </h2>
              <p className="max-w-xl text-sm md:text-base leading-relaxed text-zinc-400">
                Instantiate a single sandbox test block, match it against your actual chat flows, evaluate conversion matrices, and launch to your team when completely satisfied.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-100 active:scale-[0.98]"
                >
                  Create Production Account
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-800 bg-transparent px-5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-900 hover:text-white"
                >
                  View Corporate Tier Structure
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Premium Minimalist Footer */}
      <footer className="border-t border-zinc-100 bg-white py-12 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-950">dock</span>
            <span>© 2026 Dock Systems Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-medium text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Architecture</Link>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Protocol</Link>
            <Link href="/security" className="hover:text-zinc-950 transition-colors">Security Audit Logs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
