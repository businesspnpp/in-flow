import Link from 'next/link';
import { ArrowRight, MessageSquareMore, Sparkles, CalendarCheck2, Star, CreditCard } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
      
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <img src="/dock-icon-2.png" alt="dock logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight text-zinc-900">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/products" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Products</Link>
            <Link href="/customers" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Customers</Link>
            <Link href="/partners" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Partners</Link>
            <Link href="/resources" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Resources</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Sign In</Link>
            <Link
              href="/login?mode=signup"
              className="rounded-md bg-[#795bf4] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#6847ef]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO CHAMBER (Centered Headline & Subtitle) */}
        <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 text-center md:px-12 lg:pt-28">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-950 md:text-6xl lg:text-[64px] lg:leading-[1.1]">
            Your life's work,<br />powered by our life's work
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-zinc-500 md:text-xl">
            A unique and powerful software suite to transform the way you work. Designed for businesses of all sizes, built by a company that values your privacy.
          </p>
          <div className="mt-8">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center justify-center rounded-md bg-[#795bf4] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#6847ef]"
            >
              Get Started for Free <span className="ml-2">&gt;</span>
            </Link>
          </div>
        </section>

        {/* 3. ASYMMETRIC APP GRID (Zia Feature Promo Banner Left + Featured Apps Right) */}
        <section className="mx-auto max-w-7xl px-6 py-8 md:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            
            {/* Left AI Feature Showcase Card */}
            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#795bf4] to-[#5134c9] p-8 text-white shadow-sm">
              <div>
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">Introducing</span>
                <h3 className="mt-6 text-3xl font-extrabold tracking-tight">Dock Agent Studio</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-100">
                  Build autonomous workspace streams that can qualify inbound leads, auto-resolve tickets, draft contextual emails, and process workflows instantly.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/agents" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white hover:underline">
                  Explore Dock Agents <span className="ml-1.5">&gt;</span>
                </Link>
              </div>
            </div>

            {/* Right Standard Core Application Grid */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Featured Apps</span>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                
                {/* App 1 */}
                <div className="group flex flex-col justify-between rounded-xl border border-zinc-100 p-5 transition-all hover:border-zinc-200 hover:shadow-sm">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#795bf4]/10 text-[#795bf4]"><MessageSquareMore size={20} /></div>
                    <h4 className="mt-4 font-bold text-zinc-950">Unified Inbox</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">Handle WhatsApp, Instagram, Facebook, and email channels from one focused platform.</p>
                  </div>
                </div>

                {/* App 2 */}
                <div className="group flex flex-col justify-between rounded-xl border border-zinc-100 p-5 transition-all hover:border-zinc-200 hover:shadow-sm">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#66dba3]/10 text-[#66dba3]"><Sparkles size={20} /></div>
                    <h4 className="mt-4 font-bold text-zinc-950">In-Chat Tools</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">Generate invoices, quotes, bookings, and smart dynamic action layouts natively within chats.</p>
                  </div>
                </div>

                {/* App 3 */}
                <div className="group flex flex-col justify-between rounded-xl border border-zinc-100 p-5 transition-all hover:border-zinc-200 hover:shadow-sm">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#795bf4]/10 text-[#795bf4]"><CalendarCheck2 size={20} /></div>
                    <h4 className="mt-4 font-bold text-zinc-950">Bookings</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">Lock in direct appointments, handle real-time modifications, and trigger auto-alerts.</p>
                  </div>
                </div>

                {/* App 4 */}
                <div className="group flex flex-col justify-between rounded-xl border border-zinc-100 p-5 transition-all hover:border-zinc-200 hover:shadow-sm">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#66dba3]/10 text-[#66dba3]"><CreditCard size={20} /></div>
                    <h4 className="mt-4 font-bold text-zinc-950">PayNow Docs</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">Drop ultra-secure payment request assets into conversational context without hopping windows.</p>
                  </div>
                </div>

                {/* App 5 */}
                <div className="group flex flex-col justify-between rounded-xl border border-zinc-100 p-5 transition-all hover:border-zinc-200 hover:shadow-sm">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#795bf4]/10 text-[#795bf4]"><Star size={20} /></div>
                    <h4 className="mt-4 font-bold text-zinc-950">Review Growth</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">Keep retention flows tracking with smart customer automated feedback pipelines.</p>
                  </div>
                </div>

                {/* App 6 Link Box */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-50 p-5 text-center">
                  <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">
                    Explore All Products <span className="ml-1">&gt;</span>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. SOLID CONTRAST SUITE HIGHLIGHT (The Zoho One Bright Banner Clone) */}
        <section className="mt-12 bg-[#795bf4] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">All-In-One Suite</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">dock One</h2>
              <p className="mt-2 text-lg font-medium text-white/90">The operating system for business</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                Run your entire infrastructure on dock—our fully unified operations platform packed with more than 50 integrated system applications matching every business need.
              </p>
              <div className="mt-6">
                <Link href="/dock-one" className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-900">
                  Try dock One <span className="ml-2">&gt;</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="text-xl font-medium italic leading-relaxed text-white/90">
                "Dock continues to modify, adapt, grow, and cleanly append strategic utilities to the engine workspace that our operations find massive iterative value in daily."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20" />
                <div>
                  <p className="text-sm font-bold">Paul Grimes</p>
                  <p className="text-xs text-white/70">Chief Operating Officer, Lubrication Engineers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TRUSTED ENTERPRISE BRANDS LOGO TICKER */}
        <section className="border-b border-zinc-200/60 bg-white py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Brands That Trust Us</p>
          <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-10 px-6 font-bold tracking-wider text-zinc-300 md:gap-16">
            <span className="text-xl uppercase transition-colors hover:text-zinc-400">amazon</span>
            <span className="text-xl uppercase transition-colors hover:text-zinc-400">kpmg</span>
            <span className="text-xl uppercase transition-colors hover:text-zinc-400">netflix</span>
            <span className="text-xl uppercase transition-colors hover:text-zinc-400">shopify</span>
            <span className="text-xl uppercase transition-colors hover:text-zinc-400">stripe</span>
          </div>
          <div className="mt-6">
            <Link href="/case-studies" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">
              Customer Stories <span className="ml-1">&gt;</span>
            </Link>
          </div>
        </section>

        {/* 6. TWIN COLUMN ENTERPRISE ECOSYSTEM DISPLAY */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-950 md:text-4xl">dock for Enterprise</h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-500">
                Discover the hyper-scalable ecosystem we've engineered for large-scale transformation operations. Explore dock's structural platform capabilities, dedicated developer tools, enterprise architecture security, and global professional services integrations.
              </p>
              <div className="mt-6">
                <Link href="/enterprise" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#795bf4] hover:underline">
                  Learn More <span className="ml-1.5">&gt;</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-8">
              <p className="text-lg font-medium italic leading-relaxed text-zinc-700">
                "Dock's corporate operating network framework is fundamentally robust and consistently indexes the unified systemic logic of our whole international enterprise business database."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-300" />
                <div>
                  <p className="text-sm font-bold text-zinc-900">Aurian De Maupeou</p>
                  <p className="text-xs text-zinc-500">Co-Founder, Selectra</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FULL WIDTH HERO BANNER VISUAL SEPARATOR */}
        <section className="relative flex h-[340px] items-center justify-center bg-zinc-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#795bf4]/40 to-black/60 z-10" />
          <div className="relative z-20 px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Dock Community Summit</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">DOCKOLICS IS BACK</h2>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow transition-transform hover:scale-[1.02]">
                Watch Event Video
              </button>
            </div>
          </div>
        </section>

        {/* 8. FOUR-COLUMN CORE BRAND VALUES MATRIX */}
        <section className="bg-white py-20 border-b border-zinc-200/60">
          <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 md:text-4xl">The core values and principles that drive us</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
              
              {/* Value Card 1 */}
              <div>
                <h4 className="text-lg font-bold text-zinc-950 border-l-2 border-[#795bf4] pl-3">Long-term commitment</h4>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Over 30 years of operating a structurally profitable organization gives us a profound perspective on the core engineering problems growing businesses hit.
                </p>
              </div>

              {/* Value Card 2 */}
              <div>
                <h4 className="text-lg font-bold text-zinc-950 border-l-2 border-[#66dba3] pl-3">Customer-first system</h4>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Throughout our history, it is our deep client validation network that directly builds sustainable scale. Regardless of framework size, we keep systems tracking upward.
                </p>
              </div>

              {/* Value Card 3 */}
              <div>
                <h4 className="text-lg font-bold text-zinc-950 border-l-2 border-[#795bf4] pl-3">Absolute privacy priority</h4>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  We do not monitor, trade, or package corporate dataset insights, and explicitly bypass ad-revenue frameworks. Revenue comes uniquely from deployment subscription structures.
                </p>
              </div>

              {/* Value Card 4 */}
              <div>
                <h4 className="text-lg font-bold text-zinc-950 border-l-2 border-[#66dba3] pl-3">Relentless R&D craft</h4>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Software is our definitive workspace craft. We structurally invest capital direct to basic core engineering pipelines, hosting completely localized global server centers.
                </p>
              </div>

            </div>
            <div className="mt-10">
              <Link href="/story" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">Read Our Full Story &gt;</Link>
            </div>
          </div>
        </section>

        {/* 9. GLOBAL STATS GRID STRIP */}
        <section className="bg-[#795bf4] text-white py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold tracking-tight">Business Software. Our Craft. Our Passion.</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-10 text-center sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <p className="text-4xl font-extrabold tracking-tight md:text-5xl">150M+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">Users Globally</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold tracking-tight md:text-5xl">150+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">Countries Served</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold tracking-tight md:text-5xl">60+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">Products Built</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold tracking-tight md:text-5xl">30+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">Years in Operations</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-4xl font-extrabold tracking-tight md:text-5xl">19K+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">Global Professionals</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link href="/about" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white border-b border-white/40 pb-0.5 hover:border-white">
                More About Dock
              </Link>
            </div>
          </div>
        </section>

        {/* 10. BOTOM CONVERSION SIGNUP BANNER */}
        <section className="bg-zinc-50 py-20 text-center border-b border-zinc-200/80">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 md:text-4xl">Ready to do your best work?</h2>
          <p className="mt-3 text-zinc-500">Let's get you setup with an integrated account workflow inside 15 minutes.</p>
          <div className="mt-8">
            <Link
              href="/login?mode=signup"
              className="rounded-md bg-[#795bf4] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#6847ef]"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>

      {/* 11. FOUR-COLUMN CORPORATE FOOTER DIRECTORY */}
      <footer className="bg-white px-6 py-16 md:px-12 text-xs text-zinc-500">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Apps & Integrations</h5>
            <ul className="mt-4 space-y-2.5 font-medium">
              <li><Link href="/mobile" className="hover:text-zinc-900">Mobile Applications</Link></li>
              <li><Link href="/desktop" className="hover:text-zinc-900">Desktop Packages</Link></li>
              <li><Link href="/developer" className="hover:text-zinc-900">Developer Center API</Link></li>
              <li><Link href="/workspace" className="hover:text-zinc-900">Google Workspace Plugin</Link></li>
              <li><Link href="/extensions" className="hover:text-zinc-900">Browser Extension Center</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Learning Assets</h5>
            <ul className="mt-4 space-y-2.5 font-medium">
              <li><Link href="/announcements" className="hover:text-zinc-900">Announcements Hub</Link></li>
              <li><Link href="/academy" className="hover:text-zinc-900">Training & Academy Certification</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-900">Operational Blog</Link></li>
              <li><Link href="/knowledge" className="hover:text-zinc-900">Base Knowledge Directory</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Community Core</h5>
            <ul className="mt-4 space-y-2.5 font-medium">
              <li><Link href="/community" className="hover:text-zinc-900">User Community Forum</Link></li>
              <li><Link href="/stories" className="hover:text-zinc-900">Client Case Stories</Link></li>
              <li><Link href="/partners" className="hover:text-zinc-900">Partner Program Work</Link></li>
              <li><Link href="/startups" className="hover:text-zinc-900">Dock for Startups Program</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Company Network</h5>
            <ul className="mt-4 space-y-2.5 font-medium">
              <li><Link href="/about" className="hover:text-zinc-900">About Our Identity</Link></li>
              <li><Link href="/careers" className="hover:text-zinc-900">Careers & Opportunities</Link></li>
              <li><Link href="/press" className="hover:text-zinc-900">Press Kit Elements</Link></li>
              <li><Link href="/status" className="hover:text-zinc-900">System Service Status</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900">Contact Sales & Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-zinc-200/60 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[11px] font-medium text-zinc-400">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <Link href="/security" className="hover:text-zinc-700">Security Compliance</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-zinc-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-700">Privacy Policy</Link>
            <span>•</span>
            <Link href="/gdpr" className="hover:text-zinc-700">GDPR Framework</Link>
          </div>
          <p>© 2026 Dock Corporation Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
