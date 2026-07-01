import Link from 'next/link';
import { 
  ArrowRight, 
  CalendarCheck2, 
  CreditCard, 
  MessageSquareMore, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Users 
} from 'lucide-react';

const featureCards = [
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#795bf4] text-white text-xs font-semibold py-2.5 px-4 text-center tracking-wide">
        🚀 New feature update: Sync multi-channel broadcast campaigns instantly.{' '}
        <Link href="/pricing" className="underline ml-1 hover:text-[#66dba3] transition-colors">
          Learn more &rarr;
        </Link>
      </div>

      {/* 2. Premium Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/dock-icon-2.png" alt="dock icon" className="h-10 w-10 transition-transform group-hover:rotate-3" />
            <span className="text-2xl font-bold tracking-tight text-zinc-950">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Features</Link>
            <Link href="#solutions" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Solutions</Link>
            <Link href="/pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Pricing</Link>
            <span className="h-4 w-px bg-zinc-200"></span>
            <Link href="/login" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">Sign in</Link>
            <Link
              href="/login?mode=signup"
              className="rounded-xl bg-[#795bf4] px-4.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6847ef] hover:shadow"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* 3. High-Conversion Elegant Hero Section */}
        <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center sm:px-8 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#66dba3]"></span>
              The Central Hub for Small Business Operations
            </div>
            
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-zinc-950 sm:text-7xl lg:leading-[1.1]">
              Run your customer operations <br className="hidden sm:inline" />
              from <span className="text-[#795bf4]">one single dock.</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-500 sm:text-xl">
              Dock unifies your chats, automates contextual replies, requests secure payments, and schedules client appointments all inside a single premium workspace.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login?mode=signup"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#795bf4]/20 transition-all hover:bg-[#6847ef] hover:translate-y-[-1px]"
              >
                Start your workspace free
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 py-4 text-base font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50"
              >
                View plans
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#66dba3]" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#66dba3]" /> Setup in under 15 minutes</span>
            </div>
          </div>

          {/* 4. Elegant Product Showcase / Hero Mockup Frame */}
          <div className="mx-auto mt-16 max-w-6xl px-2 sm:mt-24">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-3 shadow-[0_32px_96px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-inner aspect-[16/9]">
                {/* PLACEHOLDER FOR MAIN PRODUCT SCREENSHOT */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Mock Window Header */}
                  <div className="flex h-11 items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-zinc-200"></div>
                      <div className="h-3 w-3 rounded-full bg-zinc-200"></div>
                      <div className="h-3 w-3 rounded-full bg-zinc-200"></div>
                    </div>
                    <div className="rounded bg-zinc-100 px-12 py-1 text-[10px] text-zinc-400 font-medium">app.dock.com/workspace</div>
                    <div className="w-14"></div>
                  </div>
                  {/* Mock Window Canvas */}
                  <div className="flex flex-1 items-center justify-center bg-zinc-50/30 p-8">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Replace with your main product dashboard screenshot</p>
                      <p className="text-xs text-zinc-400 mt-1">1920x1080 Aspect Ratio Recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Clean, Minimalist Trust & Metrics Section */}
        <section className="border-t border-zinc-200/60 bg-white py-12">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-3 lg:grid-cols-3">
              <div className="border-r border-zinc-100 last:border-none">
                <p className="text-4xl font-extrabold tracking-tight text-zinc-950 lg:text-5xl">5+</p>
                <p className="mt-2 text-sm font-medium text-zinc-500">Channels Connected Seamlessly</p>
              </div>
              <div className="border-r border-zinc-100 last:border-none md:border-none lg:border-r">
                <p className="text-4xl font-extrabold tracking-tight text-zinc-950 lg:text-5xl">8</p>
                <p className="mt-2 text-sm font-medium text-zinc-500">Native In-Chat Actions</p>
              </div>
              <div className="col-span-2 md:col-span-1 last:border-none">
                <p className="text-4xl font-extrabold tracking-tight text-zinc-950 lg:text-5xl">&lt; 15m</p>
                <p className="mt-2 text-sm font-medium text-zinc-500">Average Integration Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Professional Industry Grid Layout (Feature Deck) */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Capabilities</h2>
            <p className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
              Everything required to run frontline client operations.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ title, body, Icon }) => (
              <div key={title} className="group relative rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#795bf4]/5 text-[#795bf4] transition-colors group-hover:bg-[#795bf4] group-hover:text-white">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-zinc-950 tracking-tight">{title}</h3>
                <p className="mt-2.5 text-sm font-medium leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Structured Solution / Split Feature Section (Aesthetic Shift) */}
        <section id="solutions" className="bg-zinc-950 text-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Next-Gen Workflow</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Deep context. Faster conversion execution.
                </h2>
                <p className="mt-6 text-base font-medium leading-relaxed text-zinc-400">
                  Instead of constantly jumping tabs across scheduling tools, payment processors, and chat boxes, your team stays inside a singular conversation container.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#66dba3]/20 text-[#66dba3]">
                      <Zap size={12} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Automated Lead Identification</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Detect client intents from multi-channel inputs natively.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#66dba3]/20 text-[#66dba3]">
                      <Layers size={12} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Embedded Payment Gateways</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Drop instant payment requests smoothly inside your primary chat streams.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Dashboard Element Mockup Side */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl">
                  <div className="rounded-xl border border-white/5 bg-zinc-900 p-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Live Customer Streams</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Consolidated workspace timeline overview</p>
                      </div>
                      <div className="rounded-full bg-[#66dba3]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#66dba3]">
                        Active Stream
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white">Client intent detected: "Book tomorrow"</p>
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300">WhatsApp Link</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-2">Suggested Action: Insert BookedIt Calendar Block</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.03] transition-colors">
                          <div className="flex items-center gap-2 text-[#66dba3]">
                            <CalendarCheck2 size={14} />
                            <span className="text-xs font-bold">BookedIt API</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-2">Generate client schedules instantly within the chat window.</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.03] transition-colors">
                          <div className="flex items-center gap-2 text-[#66dba3]">
                            <CreditCard size={14} />
                            <span className="text-xs font-bold">PayNow Terminal</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-2">Issue frictionless payment requests seamlessly without context loss.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Impactful Enterprise Call to Action */}
        <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:py-32">
          <div className="relative overflow-hidden rounded-[32px] border border-zinc-200 bg-white px-8 py-12 shadow-sm sm:px-16 sm:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.purple.50),white)] opacity-70" />
            
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Ready to transform?</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
                Upgrade your workflows today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-zinc-500">
                Create a free account to test the multi-channel dashboard, configure instant in-app payment requests, and sync your team.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#6847ef]"
                >
                  Start free workspace
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-200 bg-white px-7 py-3.5 text-sm font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Premium Corporate Footer */}
      <footer className="border-t border-zinc-200 bg-white py-16 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:gap-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <img src="/dock-icon-2.png" alt="dock logo" className="h-7 w-7" />
                <span className="text-base font-bold text-zinc-950">dock</span>
              </Link>
              <p className="mt-4 max-w-sm font-medium leading-relaxed text-zinc-400">
                Unifying operational chat layers, client booking sequences, and global point-of-sale platforms inside an optimized workspace.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-950 uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2.5 font-medium">
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Unified Inbox</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Integrations</Link></li>
                <li><Link href="/pricing" className="hover:text-zinc-950 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-950 uppercase tracking-wider">Solutions</h4>
              <ul className="mt-4 space-y-2.5 font-medium">
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Small Business</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Customer Ops</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Retention Flows</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-950 uppercase tracking-wider">Resources</h4>
              <ul className="mt-4 space-y-2.5 font-medium">
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-950 uppercase tracking-wider">Company</h4>
              <ul className="mt-4 space-y-2.5 font-medium">
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-zinc-950 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col gap-4 border-t border-zinc-100 pt-8 sm:flex-row sm:items-center sm:justify-between font-medium text-zinc-400">
            <p>&copy; 2026 dock, Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-zinc-950 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-zinc-950 transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-zinc-950 transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
