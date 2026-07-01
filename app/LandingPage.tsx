import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CreditCard, MessageSquareMore, Sparkles, Star } from 'lucide-react';

const coreCapabilities = [
  {
    title: 'Unified Inbox',
    body: 'Handle WhatsApp, Instagram, Facebook, TikTok, and email conversations from one focused workspace.',
    Icon: MessageSquareMore,
  },
  {
    title: 'In-Chat Tools',
    body: 'Generate invoices, quotes, bookings, payment links, and promos without leaving the conversation.',
    Icon: Sparkles,
  },
  {
    title: 'Bookings & Payments',
    body: 'Lock in appointments, send reminders, and collect money through fast actions your team can actually use.',
    Icon: CalendarCheck2,
  },
  {
    title: 'Review Growth',
    body: 'Track Google review follow-ups and keep your best customers moving through a repeatable retention flow.',
    Icon: Star,
  },
];

const ecosystemStats = [
  { label: 'Channels connected globally', value: '5+' },
  { label: 'Built-in chat utilities', value: '8' },
  { label: 'Average setup duration', value: '< 15 min' },
  { label: 'Operational availability', value: '99.9%' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-zinc-900">
      {/* Premium Multi-Tier Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="text-2xl font-bold tracking-tight text-zinc-950">dock</span>
            </Link>
            
            <nav className="hidden items-center gap-8 lg:flex">
              <Link href="#" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Platform</Link>
              <Link href="#" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Solutions</Link>
              <Link href="/pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Pricing</Link>
              <Link href="#" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Resources</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6847ef] hover:shadow-md"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Enterprise Editorial Hero Section */}
        <section className="bg-gradient-to-b from-white to-zinc-50/50 px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#66dba3]/40 bg-[#66dba3]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Customer conversations, bookings, payments
              </div>
              <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-950 md:text-6xl lg:text-7xl lg:leading-[1.05]">
                Your life's work, unified in one sleek hub.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-500 md:text-xl">
                Dock gives small businesses one premium home to manage chats, automate complex workflows, send instantly trackable invoices, and turn conversations into revenue.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-7 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-[#6847ef] hover:scale-[1.01]"
                >
                  Get started for free
                  <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-7 py-4 text-base font-bold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50"
                >
                  Explore features
                </Link>
              </div>
            </div>

            {/* Split System Dashboard Showcase Block */}
            <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Featured Sub-Suite Announcement Component */}
              <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#795bf4] to-[#5135cb] p-8 text-white shadow-lg lg:col-span-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Introducing Ecosystem v2</span>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight">Run your total business engine from one dock</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-100/80">
                    Deploy autonomous booking pipelines, track cross-platform leads, and wire secure merchant networks straight out of the box.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <Link href="/login?mode=signup" className="inline-flex items-center gap-2 text-sm font-bold text-[#66dba3] hover:underline">
                    Initialize your setup workflow <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Live Interactive Workspace Grid Preview */}
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-100 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Live Customer Workspace Panel</span>
                  </div>
                  <div className="rounded-full bg-[#66dba3]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#35b577]">
                    dock core
                  </div>
                </div>

                {/* Simulated High-Fidelity UI Interface */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-950">Incoming WhatsApp Customer Lead detected</p>
                        <p className="mt-1 text-xs text-zinc-500">Suggested action: Dispatch personalized BookedIt link to confirmation queue.</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">Active Pipeline</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-100 p-4 transition-hover hover:border-zinc-200">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <CalendarCheck2 size={16} className="text-[#795bf4]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">BookedIt API</span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-600">Dynamic reservation slots synchronized directly within open chat streams.</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-100 p-4 transition-hover hover:border-zinc-200">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <CreditCard size={16} className="text-[#795bf4]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">PayNow Gateway</span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-600">Instant generation of secure invoice transactions without context switching.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Trust & Alignment Strip */}
        <section className="border-y border-zinc-200/60 bg-white py-10 px-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 md:text-left text-center">
              Powering communication paradigms across digital retail and operational environments
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale contrast-200">
              <span className="text-xl font-black tracking-tight">AMAZON</span>
              <span className="text-xl font-black tracking-tight">KPMG</span>
              <span className="text-xl font-black tracking-tight">NETFLIX</span>
              <span className="text-xl font-black tracking-tight">SHOPIFY</span>
            </div>
          </div>
        </section>

        {/* Premium Core Capability Columns Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-3xl border-l-4 border-[#795bf4] pl-6">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Designed to Scale</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Engineered for the absolute operational front-lines.
            </h2>
            <p className="mt-4 text-base text-zinc-500">
              Stop juggling isolated point solutions. Dock bridges client messaging directly with transactional capabilities to optimize conversion mechanics.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {coreCapabilities.map(({ title, body, Icon }) => (
              <div key={title} className="group relative rounded-3xl border border-zinc-200/70 bg-white p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-700 transition-colors group-hover:bg-[#795bf4]/10 group-hover:text-[#795bf4]">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-950">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* High-Fidelity Contextual Blueprint Section */}
        <section className="bg-zinc-950 px-6 py-20 text-white lg:py-24">
          <div className="mx-auto max-w-7xl">
            {/* Structural Blueprint Graphic Container - Replace src with your actual dashboard snapshot */}
            <div className="mb-16 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center z-10 p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#66dba3] mb-2">High-Fidelity UI Interface Placement</p>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">Drop your primary dashboard interface snapshot or analytics stream rendering here to establish visual authority.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Operational Transparency</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                  One workspace. Absolute command over analytics and conversations.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-400">
                  By nesting conversion engines, notification loops, and secure payment endpoints directly inside a centralized operational nexus, you eradicate overhead latency and completely eliminate dropped leads.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Why Teams Switch</p>
                <p className="mt-3 text-sm italic leading-relaxed text-zinc-300">
                  "Deploying Dock across our customer support centers immediately trimmed down multi-app task latency. We dropped setup friction completely and unlocked transparent communication tracking across five vital consumer networks concurrently on day one."
                </p>
                <div className="mt-4 border-t border-zinc-800 pt-4">
                  <p className="text-xs font-bold text-white">Operational Leadership Vector</p>
                  <p className="text-[11px] text-zinc-500">Enterprise Logistics Group</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Scalability Analytics Grid Block */}
        <section className="border-b border-zinc-200/60 bg-zinc-50 py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Empowering Modern Commerce Infrastructures</h2>
              <p className="mt-3 text-sm text-zinc-500">Measurable efficiency scaling across every single communication channel.</p>
            </div>
            
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ecosystemStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm text-center lg:text-left">
                  <p className="text-4xl font-black tracking-tight text-[#795bf4]">{stat.value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action-Oriented Bottom Closing Call to Action Segment */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28 text-center">
          <div className="rounded-[32px] border border-zinc-200 bg-white px-8 py-12 shadow-xl shadow-zinc-100/60 md:py-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Ready to Launch</span>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-zinc-950">
              Start configuring your client architecture today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-zinc-500 md:text-base">
              Browse tier matrices, review core functional components, and provision your personalized workspace when you are fully prepared to scale.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                View pricing layout
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#6847ef]"
              >
                Sign in to workspace
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Architecture Footer Ecosystem Component */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-zinc-950">dock</span>
            </Link>
            <p className="mt-4 text-xs font-medium leading-relaxed text-zinc-400">
              The professional multi-channel workspace constructed exclusively for scalable small business administration.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Apps & Extensions</h4>
            <ul className="mt-4 space-y-2 text-xs font-medium text-zinc-500">
              <li><Link href="#" className="hover:text-zinc-950">Unified Inbox Mobile</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Desktop Terminal</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Developer API Kit</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Browser Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Platform Learning</h4>
            <ul className="mt-4 space-y-2 text-xs font-medium text-zinc-500">
              <li><Link href="#" className="hover:text-zinc-950">Certification Academy</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Ecosystem Blueprint</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Developer Changelog</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">System Guide Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Community Support</h4>
            <ul className="mt-4 space-y-2 text-xs font-medium text-zinc-500">
              <li><Link href="#" className="hover:text-zinc-950">Knowledge Base</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">User Forum Group</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Partner Network</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Startup Accelerator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Company Vector</h4>
            <ul className="mt-4 space-y-2 text-xs font-medium text-zinc-500">
              <li><Link href="#" className="hover:text-zinc-950">Corporate Dossier</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Security Infrastructure</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Career Openings</Link></li>
              <li><Link href="#" className="hover:text-zinc-950">Press Resources</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-100 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] font-medium text-zinc-400">
          <p>© 2026 Dock Systems Automation Inc. All rights reserved globally.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-zinc-900">Privacy Protocols</Link>
            <Link href="#" className="hover:text-zinc-900">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-900">Security Architecture</Link>
            <Link href="#" className="hover:text-zinc-900">Data Processing (GDPR)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
