import Link from 'next/link';
import { ArrowRight, MessageSquareMore, Sparkles, CalendarCheck2, CreditCard, Star, ShieldCheck, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-[#795bf4]/20">
      
      {/* =========================================================================
          1. STICKY TOP GLOBAL NAVIGATION HEADER
         ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dock-icon-2.png" alt="dock logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-zinc-900">dock</span>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden items-center gap-6 lg:flex">
              <Link href="/products" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Products</Link>
              <Link href="/customers" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Customers</Link>
              <Link href="/partners" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Partners</Link>
              <Link href="/resources" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Resources</Link>
            </nav>
          </div>

          {/* Right Action Framework */}
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Sign In</Link>
            <Link
              href="/login?mode=signup"
              className="rounded bg-[#ef4444] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#dc2626]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        
        {/* =========================================================================
            2. HERO CHAMBER (Centered Headline, Copy, & Primary Action Button)
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center lg:px-10 lg:pt-20">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
            Your life's work,<br />powered by our life's work
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-500 sm:text-lg">
            A unique and powerful software suite to transform the way you work. Designed for businesses of all sizes, built by a company that values your privacy.
          </p>
          <div className="mt-8">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center justify-center rounded bg-[#ef4444] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#dc2626]"
            >
              Get Started for Free &gt;
            </Link>
          </div>
        </section>

        {/* =========================================================================
            3. SPLIT APPS INTERACTION GRID (Left AI Promo Box + Right Multi-App Panel)
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] items-stretch">
            
            {/* Left AI Side-Chamber (Zia Agent Studio Replica) */}
            <div className="flex flex-col justify-between rounded-md bg-gradient-to-br from-[#795bf4] to-[#4c31bd] p-8 text-white shadow-sm">
              <div>
                <span className="inline-block text-xs font-medium uppercase tracking-wider text-[#66dba3]/90">Introducing</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">dock Agent Studio</h3>
                <p className="mt-3 text-xs leading-relaxed text-zinc-200/90">
                  Build autonomous workspace streams that can qualify inbound leads, auto-resolve tickets, draft contextual emails, and process heavy workflows instantly.
                </p>
              </div>
              <div className="mt-12 border-t border-white/10 pt-4">
                <Link href="/agents" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white hover:underline">
                  Explore dock Agents <span className="ml-1">&gt;</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Apps Matrix Block */}
            <div className="rounded-md border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Featured Apps</span>
                <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">Explore All Products</Link>
              </div>
              
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                
                {/* App Box 1 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#795bf4]/10 text-[#795bf4]"><MessageSquareMore size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Unified Inbox</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Handle WhatsApp, Instagram, Facebook, and email channels natively.</p>
                  </div>
                </div>

                {/* App Box 2 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#66dba3]/10 text-[#66dba3]"><Sparkles size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">In-Chat Tools</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Generate invoices, quotes, bookings, and custom smart dynamic parameters.</p>
                  </div>
                </div>

                {/* App Box 3 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#795bf4]/10 text-[#795bf4]"><CalendarCheck2 size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Bookings</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Lock in direct appointments, schedule automatic triggers, and coordinate times.</p>
                  </div>
                </div>

                {/* App Box 4 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#66dba3]/10 text-[#66dba3]"><CreditCard size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">PayNow Docs</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Drop ultra-secure billing requests directly inside ongoing text contexts cleanly.</p>
                  </div>
                </div>

                {/* App Box 5 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#795bf4]/10 text-[#795bf4]"><Star size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Review Growth</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Track user follow-ups and construct retention logic easily.</p>
                  </div>
                </div>

                {/* App Box 6 */}
                <div className="flex gap-4 rounded-lg p-2 transition-all hover:bg-zinc-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#66dba3]/10 text-[#66dba3]"><Cpu size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Integrations</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Link third party tooling databases with single-click API systems.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            4. BRIGHT ALL-IN-ONE SUITE STRIP (Zoho One Yellow Section Replica)
           ========================================================================= */}
        <section className="mt-12 bg-[#795bf4] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            
            {/* Left Strategic Segment */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">All-In-One Suite</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">dock One</h2>
              <p className="mt-1 text-base font-semibold text-zinc-100">The operating system for business</p>
              <p className="mt-4 max-w-lg text-xs leading-relaxed text-zinc-100/90">
                Run your entire business on dock—our fully unified operating platform architecture packed with more than 50 integrated platform applications matching every transactional workflow need.
              </p>
              <div className="mt-6">
                <Link href="/dock-one" className="inline-flex items-center justify-center rounded bg-zinc-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-900">
                  Try dock One &gt;
                </Link>
              </div>
            </div>

            {/* Right Institutional Quote Block */}
            <div className="border-t border-white/20 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <p className="text-base font-medium italic leading-relaxed text-zinc-100">
                "Dock continues to modify, adapt, grow, and add things to the platform that our business sees value in."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20" />
                <div>
                  <p className="text-xs font-bold">Paul Grimes</p>
                  <p className="text-[11px] text-zinc-200">Chief Operating Officer, Lubrication Engineers</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            5. CORPORATE BRAND TICKER STRIP
           ========================================================================= */}
        <section className="bg-white py-10 text-center border-b border-zinc-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Brands That Trust Us</p>
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-10 px-6 font-extrabold tracking-widest text-zinc-300 sm:gap-14">
            <span className="text-lg uppercase">amazon</span>
            <span className="text-lg uppercase">kpmg</span>
            <span className="text-lg uppercase">netflix</span>
            <span className="text-lg uppercase">shopify</span>
            <span className="text-lg uppercase">stripe</span>
          </div>
          <div className="mt-5">
            <Link href="/case-studies" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">
              Customer Stories &gt;
            </Link>
          </div>
        </section>

        {/* =========================================================================
            6. TWIN COLUMN ECOSYSTEM MODULE (Enterprise Segment)
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            
            {/* Left Enterprise Copy */}
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">dock for Enterprise</h3>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Discover the ecosystem we've built for large-scale transformation operations. Explore dock's structural platform capabilities, specialized developer tools, enterprise architecture security matrix, and global network deployment channels.
              </p>
              <div className="mt-4">
                <Link href="/enterprise" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#795bf4] hover:underline">
                  Learn More &gt;
                </Link>
              </div>
            </div>

            {/* Right Enterprise Validation Box */}
            <div className="rounded border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm font-medium italic leading-relaxed text-zinc-600">
                "Dock's operating system is very robust and contains the collective memory of Selectra's entire business."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-300" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Aurian De Maupeou</p>
                  <p className="text-[11px] text-zinc-400">Co-Founder, Selectra</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            7. FULL WIDTH VISUAL DISPLAY SEPARATOR BLOCK (The Event/Summit Banner)
           ========================================================================= */}
        <section className="relative flex h-64 items-center justify-center bg-zinc-900 text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80')" }} />
          <div className="relative z-10 px-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-wider sm:text-4xl">DOCKOLICS</h2>
            <div className="mt-4">
              <button className="rounded bg-[#ef4444] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#dc2626]">
                Watch Video &gt;
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. THE 4-COLUMN BRAND PILLARS MATRIX
           ========================================================================= */}
        <section className="bg-white py-16 border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">The core values and principles that drive us</h2>
            
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Pillar 1 */}
              <div className="flex flex-col gap-3">
                <div className="text-[#795bf4]"><MessageSquareMore size={24} /></div>
                <h4 className="text-base font-bold text-zinc-900">Long-term commitment</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  30+ years of running a profitable organization gives us a good sense of challenges that a growing business faces. We take pride in running a sustainable business that's powered by you, our customer.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="flex flex-col gap-3">
                <div className="text-[#66dba3]"><Star size={24} /></div>
                <h4 className="text-base font-bold text-zinc-900">Customer-first philosophy</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  In all these years, it's our customers' trust and goodwill that has helped us establish a strong position in the market. No matter the size of your business, we're here to help you grow.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col gap-3">
                <div className="text-[#795bf4]"><ShieldCheck size={24} /></div>
                <h4 className="text-base font-bold text-zinc-900">Privacy and security as a priority</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  We do not own or sell your data, and we most certainly do not bank on advertising-based business models. The only way we make money is from the software license fees you pay us.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="flex flex-col gap-3">
                <div className="text-[#66dba3]"><Sparkles size={24} /></div>
                <h4 className="text-base font-bold text-zinc-900">Focus on research and development</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  Software is our craft and we back it up with our relentless investments in R&D. So much so that we prefer to own the entire technology stack, including running our data centers globally.
                </p>
              </div>

            </div>

            <div className="mt-10 text-center">
              <Link href="/story" className="text-xs font-bold uppercase tracking-wider text-[#795bf4] hover:underline">
                Read Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. CORPORATE SCALE MATRIX METRICS (Solid Blue Strip Clone)
           ========================================================================= */}
        <section className="bg-zinc-900 text-white py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-zinc-300">Business Software. Our Craft. Our Passion.</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <p className="text-3xl font-extrabold tracking-tight md:text-4xl">150M+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">Users Globally</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight md:text-4xl">150+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">Countries Served</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight md:text-4xl">60+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">Products</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight md:text-4xl">30+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">Years in Business</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-3xl font-extrabold tracking-tight md:text-4xl">19K+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">Employees Worldwide</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-[#66dba3] hover:underline">
                More About dock &gt;
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            10. BOTTOM ACTIONS CALL TO ACTION BANNER
           ========================================================================= */}
        <section className="bg-zinc-50 py-16 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Ready to do your best work?</h2>
          <p className="mt-2 text-xs text-zinc-500">Let's get you started.</p>
          <div className="mt-6">
            <Link
              href="/login?mode=signup"
              className="rounded bg-[#ef4444] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#dc2626]"
            >
              Sign Up Now
            </Link>
          </div>
        </section>

      </main>

      {/* =========================================================================
          11. FOUR-COLUMN SYSTEM INDEX FOOTER DIRECTORY
         ========================================================================= */}
      <footer className="bg-white px-6 pt-12 pb-8 border-t border-zinc-200 text-[11px] text-zinc-500 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Apps</h5>
            <ul className="mt-3 space-y-2">
              <li><Link href="/mobile" className="hover:text-zinc-900">Mobile Apps</Link></li>
              <li><Link href="/desktop" className="hover:text-zinc-900">Desktop Apps</Link></li>
              <li><Link href="/developer" className="hover:text-zinc-900">Developer Center</Link></li>
              <li><Link href="/workspace" className="hover:text-zinc-900">Google Workspace Integration</Link></li>
              <li><Link href="/extensions" className="hover:text-zinc-900">Browser Extensions</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Learn</h5>
            <ul className="mt-3 space-y-2">
              <li><Link href="/announcements" className="hover:text-zinc-900">Announcements Hub</Link></li>
              <li><Link href="/academy" className="hover:text-zinc-900">Training and Certification</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-900">Blog</Link></li>
              <li><Link href="/knowledge" className="hover:text-zinc-900">Knowledge Base</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Community</h5>
            <ul className="mt-3 space-y-2">
              <li><Link href="/community" className="hover:text-zinc-900">User Community</Link></li>
              <li><Link href="/stories" className="hover:text-zinc-900">Customer Stories</Link></li>
              <li><Link href="/partners" className="hover:text-zinc-900">Work With a Partner</Link></li>
              <li><Link href="/startups" className="hover:text-zinc-900">dock for Startups</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-950 uppercase tracking-wider">Company</h5>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="hover:text-zinc-900">About Us</Link></li>
              <li><Link href="/story" className="hover:text-zinc-900">Our Story</Link></li>
              <li><Link href="/press" className="hover:text-zinc-900">Press</Link></li>
              <li><Link href="/status" className="hover:text-zinc-900">Service Status</Link></li>
              <li><Link href="/careers" className="hover:text-zinc-900">Careers</Link></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Strip */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-100 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-zinc-400">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/security" className="hover:text-zinc-600">Security Compliance</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-zinc-600">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-600">Privacy Policy</Link>
            <span>•</span>
            <Link href="/gdpr" className="hover:text-zinc-600">GDPR Compliance</Link>
          </div>
          <p>© 2026 dock Corporation Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
