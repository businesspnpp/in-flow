import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CreditCard, MessageSquareMore, Sparkles, Star } from 'lucide-react';

const featuredApps = [
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-zinc-900">dock</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
              <Link href="#" className="hover:text-zinc-900">Platform</Link>
              <Link href="#" className="hover:text-zinc-900">Customers</Link>
              <Link href="#" className="hover:text-zinc-900">Partners</Link>
              <Link href="#" className="hover:text-zinc-900">Resources</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900">Sign In</Link>
            <Link 
              href="/login?mode=signup" 
              className="rounded border border-[#795bf4] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#795bf4] transition-colors hover:bg-[#795bf4]/5"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO BLOCK */}
        <section className="bg-gradient-to-b from-zinc-50/50 to-white px-6 pt-16 pb-12 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Run your customer operations from one dock.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-zinc-500 sm:text-lg">
              Dock gives small businesses one place to manage chats, automate replies, send invoices, confirm bookings, and keep customers moving.
            </p>
            <div className="mt-8">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center rounded bg-[#795bf4] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#6847ef]"
              >
                Get Started For Free &gt;
              </Link>
            </div>
          </div>
        </section>

        {/* 3. HERO SPLIT CONTAINER / FEATURED HERO CARD ROW */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm lg:grid-cols-12">
            
            {/* Left Big Highlight Box */}
            <div className="rounded-xl bg-gradient-to-br from-[#795bf4] to-[#5135cb] p-8 text-white lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Featured System Upgrade</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Introducing Live Customer Workspace</h3>
                <p className="mt-2 text-sm text-zinc-100/80">
                  Chats, tools, and direct payment infrastructure combined into a single operational interface.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/login?mode=signup" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#66dba3] hover:underline">
                  Explore Hub Ecosystem &gt;
                </Link>
              </div>
            </div>

            {/* Right Mini App Grid Link Blocks */}
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Core Utility Applications</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredApps.map(({ title, body, Icon }) => (
                  <div key={title} className="rounded-xl border border-zinc-100 bg-white p-4 hover:border-zinc-200 transition-all">
                    <div className="flex items-center gap-2 text-zinc-900">
                      <div className="text-[#795bf4]"><Icon size={16} /></div>
                      <h4 className="text-sm font-bold tracking-tight">{title}</h4>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. SOLID HIGHLIGHT STRIP SECTION (ZOHO ONE ROW MECHANIC) */}
        <section className="bg-[#66dba3] px-6 py-12 text-zinc-950">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-900">All-In-One Operations Suite</span>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">dock Suite</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed max-w-md opacity-90">
                The integrated operating system designed explicitly for small business infrastructure. Run your entire business pipeline inside our unified communications model.
              </p>
              <div className="mt-6">
                <Link href="/login?mode=signup" className="inline-flex items-center justify-center rounded bg-zinc-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-900">
                  Try dock Suite &gt;
                </Link>
              </div>
            </div>
            <div className="border-l-2 border-emerald-700/30 pl-6">
              <p className="text-lg font-bold italic leading-relaxed">
                "Dock gave us a scalable operational model that instantly saved hours spent navigating separate windows."
              </p>
              <p className="mt-4 text-xs font-bold tracking-wider uppercase">— Customer Lead Executive, Verified Enterprise Review</p>
            </div>
          </div>
        </section>

        {/* 5. LOGO ACCORD BANNER */}
        <section className="border-b border-zinc-100 bg-white py-12 px-6 text-center">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Brands that trust us</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-12 text-sm font-black tracking-widest text-zinc-300 opacity-80 select-none">
              <span>AMAZON</span>
              <span>KPMG</span>
              <span>NETFLIX</span>
              <span>SHOPIFY</span>
            </div>
          </div>
        </section>

        {/* 6. SYSTEM OVERVIEW / DUAL CALLOUT COMPONENT */}
        <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Dock for growing teams</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Discover the full ecosystem we've engineered to manage multi-tenant growth matrices. Track cross-platform chats, deploy automated tools, and verify pipeline actions natively.
            </p>
            <div className="mt-4">
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">Learn More &gt;</Link>
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-6 border border-zinc-100">
            <p className="text-sm italic leading-relaxed text-zinc-600">
              "The dynamic tracking and direct billing modules work without friction. One inbox, fewer missed context threads, and incredibly faster answers."
            </p>
          </div>
        </section>

        {/* 7. FULL BLEED PHOTO PLACEHOLDER / VIDEO ACTION HERO BLOCK */}
        <section className="relative w-full aspect-[21/9] min-h-[300px] bg-zinc-900 flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url("/product-team-screenshot.jpg")' }}></div>
          <div className="relative z-10 text-center px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Product Walkthrough</span>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-4xl">See the Dock Engine in Action</h2>
            <button className="mt-4 inline-flex items-center gap-2 rounded bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-zinc-100 transition-colors">
              Watch Video &gt;
            </button>
          </div>
        </section>

        {/* 8. WHITE OVERLAY CARD PANE: THE CORE PILLARS BLOCK */}
        <section className="relative -mt-16 mx-auto max-w-5xl px-6 pb-16 z-20">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-100">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-xl font-bold tracking-tight text-zinc-950">The core features and parameters that drive us</h3>
              <div className="h-[2px] w-8 bg-[#795bf4] mx-auto mt-3"></div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="shrink-0 text-[#795bf4] mt-1"><MessageSquareMore size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-zinc-900">Unified Multi-Channel Feed</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">Handle WhatsApp, Instagram, Facebook, TikTok, and email conversations concurrently without switching tabs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 text-[#795bf4] mt-1"><Sparkles size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-zinc-900">In-Chat Execution Blocks</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">Generate instantly verifiable invoices, instant quotations, and direct reservation cards right inside your active threads.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 text-[#795bf4] mt-1"><CalendarCheck2 size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-zinc-900">Bookings & Secure Settlement</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">Lock down operational appointments, schedule automated transactional notifications, and log user balance settlements easily.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 text-[#795bf4] mt-1"><Star size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-zinc-900">Continuous Growth Loop</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">Organize follow-up review pathways automatically to sustain retention flows and increase public business ratings.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center border-t border-zinc-100 pt-6">
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">Read Our Story &gt;</Link>
            </div>
          </div>
        </section>

        {/* 9. STATS MATRIC GRID BANNER */}
        <section className="bg-zinc-950 py-12 px-6 text-white text-center">
          <div className="mx-auto max-w-5xl">
            <h3 className="text-lg font-bold tracking-tight opacity-90">Business Software. Engineered Natively.</h3>
            <div className="h-[2px] w-6 bg-[#66dba3] mx-auto mt-2 mb-8"></div>
            
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              <div>
                <p className="text-3xl font-black tracking-tight text-[#66dba3]">5+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Channels Connected</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight text-[#66dba3]">8</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">In-Chat Utilities</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight text-[#66dba3]">&lt; 15m</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Setup Duration</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight text-[#66dba3]">99.9%</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Active Uptime</p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#66dba3] hover:underline">More About dock &gt;</Link>
            </div>
          </div>
        </section>

        {/* 10. CLOSING ACTION AREA */}
        <section className="bg-zinc-50 py-16 px-6 text-center border-b border-zinc-200">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">Ready to do your best work?</h2>
            <p className="mt-2 text-sm text-zinc-500">Let's get your setup configured.</p>
            <div className="mt-6">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center rounded bg-[#795bf4] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#6847ef]"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 11. ENTERPRISE COLUMNED SITEMAP FOOTER */}
      <footer className="bg-white px-6 pt-16 pb-12 text-xs font-medium text-zinc-500">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          
          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-900 mb-4">Apps & System</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-zinc-900">Mobile Hub Terminal</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Desktop Interface</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Developer Platform</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Integrations Framework</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-900 mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-zinc-900">System Academy</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Operational Blog</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Platform Blueprint</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Product Updates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-900 mb-4">Community</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-zinc-900">Knowledge Network</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">User Forums</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Partner Portals</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Developer Slack</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-zinc-900">Our Core Story</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Press Kit Elements</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Careers Pipeline</Link></li>
              <li><Link href="#" className="hover:text-zinc-900">Security Architecture</Link></li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-6 w-6" />
              <span className="text-base font-bold tracking-tight text-zinc-900">dock</span>
            </Link>
            <p className="text-zinc-400 leading-relaxed max-w-xs">
              The precise operational system structured around modern small business needs.
            </p>
          </div>
        </div>

        {/* Legal Grid Strip */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-100 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] text-zinc-400">
          <p>© 2026 Dock Automation Inc. All Rights Reserved Natively.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="#" className="hover:text-zinc-900">Contact Us</Link>
            <Link href="#" className="hover:text-zinc-900">Security Matrix</Link>
            <Link href="#" className="hover:text-zinc-900">Compliance Code</Link>
            <Link href="#" className="hover:text-zinc-900">Terms & Conditions</Link>
            <Link href="#" className="hover:text-zinc-900">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
