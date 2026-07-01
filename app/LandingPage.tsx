import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  MessageSquareMore, 
  Sparkles, 
  CalendarCheck2, 
  Star, 
  Check, 
  Shield, 
  Zap, 
  Layers, 
  FileText,
  HelpCircle,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-sans">
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/dock-icon-2.png" alt="dock logo" className="h-11 w-11" />
            <span className="text-3xl font-semibold leading-none tracking-tight text-zinc-900">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/products" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Products</Link>
            <Link href="/solutions" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Solutions</Link>
            <Link href="/resources" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Resources</Link>
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Pricing</Link>
            <Link href="/login" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">Log in</Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6847ef]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* 2. HERO HEADER SECTION */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center md:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#795bf4]/30 bg-[#795bf4]/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#795bf4]">
            Customer Operations Governed
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-950 sm:text-6xl md:text-7xl leading-[1.05]">
            Your tools. Your rules. <br />One unified dock.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 md:text-xl">
            dock gives teams one singular place to set operation guardrails, manage channels, and see every customer interaction—so everyone can automate with confidence without waiting for technical permissions.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#6847ef] shadow-lg shadow-[#795bf4]/20"
            >
              Start free with email
            </Link>
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google icon" />
              Start free with Google
            </Link>
          </div>

          {/* Core Stat Badges */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-8 max-w-2xl mx-auto text-left">
            <div>
              <p className="text-2xl font-black text-zinc-950 md:text-3xl">450K+</p>
              <p className="text-xs font-medium text-zinc-500">Automations built</p>
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-950 md:text-3xl">9,000+</p>
              <p className="text-xs font-medium text-zinc-500">App integrations enabled</p>
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-950 md:text-3xl">3.39M+</p>
              <p className="text-xs font-medium text-zinc-500">Actions processed daily</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center text-xs font-semibold tracking-wider text-zinc-400 uppercase gap-6">
            <span>✓ SOC 2 Type II Compliant</span>
            <span>✓ GDPR & CCPA Compliant</span>
          </div>
        </section>

        {/* 3. INTEGRATIONS & BUILDER QUICK-START */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400">For Modern Builders</p>
            <h3 className="text-center text-xl font-bold text-zinc-950 mt-2">Get started in seconds</h3>
            
            <div className="mt-4 flex justify-center gap-2">
              <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-1 rounded">Unified API</span>
              <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-1 rounded">SDK</span>
              <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-1 rounded">CLI</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5 text-center items-center justify-center">
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
                <MessageSquareMore className="h-8 w-8 text-[#795bf4]" />
                <span className="text-sm font-semibold mt-2 text-zinc-700">WhatsApp</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
                <Sparkles className="h-8 w-8 text-[#66dba3]" />
                <span className="text-sm font-semibold mt-2 text-zinc-700">Instagram</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
                <CalendarCheck2 className="h-8 w-8 text-[#795bf4]" />
                <span className="text-sm font-semibold mt-2 text-zinc-700">BookedIt</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
                <Star className="h-8 w-8 text-[#66dba3]" />
                <span className="text-sm font-semibold mt-2 text-zinc-700">Reviews</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
                <Inbox className="h-8 w-8 text-zinc-800" />
                <span className="text-sm font-semibold mt-2 text-zinc-700">OmniInbox</span>
              </div>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div className="mt-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Trusted by fast-growing operations globally</p>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale contrast-200">
              <span className="text-xl font-black tracking-tight">NVIDIA</span>
              <span className="text-xl font-black tracking-tight">Airbnb</span>
              <span className="text-xl font-black tracking-tight">Meta</span>
              <span className="text-xl font-black tracking-tight">Samsung</span>
              <span className="text-xl font-black tracking-tight">Mastercard</span>
            </div>
          </div>
        </section>

        {/* 4. VALUE PROPOSITION SECTIONS GRID */}
        <section className="mx-auto max-w-7xl px-6 py-16 border-t border-zinc-200/60">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Every team has apps. Now they need a platform.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-zinc-500">
              Your squads are linking independent channels straight to your business core. Every tool performs alone. The bottleneck is whether they coordinate safely, visibly, and cleanly without collision loops.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-black text-zinc-950">Connect any operations tool to 9,000+ apps</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
                  Deploy secure webhooks for platforms like WhatsApp and Facebook. Utilize the dock SDK for highly custom business flows. Achieve one managed highway to all corporate structures.
                </p>
              </div>
              <div className="mt-8 bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-2">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-200/80 shadow-sm text-xs font-semibold">
                  <span>Active Workspaces</span>
                  <span className="text-[#795bf4] font-bold">5 Active Channels</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-200/80 shadow-sm text-xs font-semibold">
                  <span>Global Secure Bridge</span>
                  <span className="text-[#66dba3] font-bold">Connected</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-black text-zinc-950">Agents that trigger instantly across channels</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
                  Automate custom logic that handles incoming queries, routes complex support requests, generates booking invites, and dispatches invoice receipts autonomously, 24/7.
                </p>
              </div>
              <div className="mt-8 bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                <div className="h-3 w-2/3 bg-zinc-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-zinc-200 rounded mb-4"></div>
                <div className="bg-[#795bf4]/10 border border-[#795bf4]/30 text-[#795bf4] text-xs font-bold p-3 rounded-xl">
                  → System Routing: "If booking received send WhatsApp payment string"
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-black text-zinc-950">Every department managed under one roof</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
                  Equip every division with explicit tools, correct channel models, and precise security policies. Operations builds lines safely while IT defines clear global boundaries.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 text-xs font-bold text-zinc-700">
                <div className="bg-white border border-zinc-200 p-3 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#66dba3]"></div> RevOps Environment
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#795bf4]"></div> Support Sandbox
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-black text-zinc-950">Complete auditable compliance visibility</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
                  Every structural action logged. Every app interaction recorded instantly. When risk managers verify software states, answer immediately in under a minute.
                </p>
              </div>
              <div className="mt-8 bg-zinc-950 text-zinc-400 p-4 rounded-2xl font-mono text-[11px] space-y-1">
                <p className="text-emerald-400">[OK] 200 - WHATSAPP_INBOUND_HOOK received</p>
                <p className="text-[#795bf4]">[OP] ROUTE - Sent to PayNow validation core</p>
                <p className="text-zinc-500">[LOG] Audit pipeline state committed</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Link href="/governance" className="text-sm font-bold text-[#795bf4] hover:underline flex items-center gap-1">
              Learn more about governance <ArrowRight size={14} />
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/enterprise" className="text-sm font-bold text-zinc-900 hover:underline">
              Explore dock for Enterprise
            </Link>
          </div>
        </section>

        {/* 5. THE UNIFIED FRAMEWORK PROTOCOL LAYER */}
        <section className="bg-zinc-950 text-white py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">dock Engine + SDK Architecture</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">One secure pipeline. <br />For every operational surface.</h2>
                <p className="mt-6 text-base text-zinc-400 leading-relaxed">
                  Frontline staff and communication applications link smoothly through native interfaces. Technical developers and engineering teams write directly using the high-performance dock SDK. 
                </p>
                <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                  Different portals, identical building parameters. IT retains absolute oversight, encryption states remain locked, and dock's real-time framework runs the heavy structural loads.
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <div className="border-l-2 border-[#795bf4] pl-4">
                    <h4 className="font-bold text-white text-sm">One auth gateway</h4>
                    <p className="text-xs text-zinc-400 mt-1">Zero raw API strings. No broken access states. Every single authorization step is centralized via secure proxy controls.</p>
                  </div>
                  <div className="border-l-2 border-[#66dba3] pl-4">
                    <h4 className="font-bold text-white text-sm">One operational run-state</h4>
                    <p className="text-xs text-zinc-400 mt-1">Automatic fallback steps, smart token recovery, absolute data persistence. Guarded entirely by enterprise execution blocks.</p>
                  </div>
                </div>
              </div>

              {/* Graphical Workflow Visualizer Block */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">dock-flow-visualizer.config</span>
                </div>
                
                {/* Visual Pipeline Representation */}
                <div className="space-y-4">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#795bf4]/20 text-[#795bf4] rounded-lg"><MessageSquareMore size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-white">Inbound Lead Webhook</p>
                        <p className="text-[10px] text-zinc-500">WhatsApp / Instagram Broadcast API</p>
                      </div>
                    </div>
                    <Check size={14} className="text-[#66dba3]" />
                  </div>

                  <div className="flex justify-center"><ArrowRight size={16} className="rotate-90 text-zinc-700" /></div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#66dba3]/20 text-[#66dba3] rounded-lg"><Sparkles size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-white">Validation Router & Script</p>
                        <p className="text-[10px] text-zinc-500">dock Core Logic Pipeline Parsing</p>
                      </div>
                    </div>
                    <div className="animate-pulse h-2 w-2 rounded-full bg-[#66dba3]"></div>
                  </div>

                  <div className="flex justify-center"><ArrowRight size={16} className="rotate-90 text-zinc-700" /></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                      <p className="text-[11px] font-bold text-white">Dispatch Payments</p>
                      <p className="text-[9px] text-zinc-500 mt-1">PayNow Integration</p>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                      <p className="text-[11px] font-bold text-white">Log Calendar Slot</p>
                      <p className="text-[9px] text-zinc-500 mt-1">BookedIt API Engine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DETAILED ENTERPRISE CUSTOMER SUCCESS FOCUS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-3 items-center">
            <div className="lg:col-span-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Proven Bottom Line Metric ROI</span>
              <h3 className="text-3xl font-black tracking-tight text-zinc-950 mt-2">Zero operational noise. Straight forward outcomes.</h3>
              <p className="mt-4 text-sm font-medium text-zinc-500 leading-relaxed">
                Fast scaling companies map core communication logic pipelines into dock to protect data systems while accelerating frontline service execution times.
              </p>
              <div className="mt-8 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
                  <span className="text-3xl font-black text-[#795bf4]">42+ Hours</span>
                  <p className="text-xs font-semibold text-zinc-500 mt-1">Saved weekly per customer service pod</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
                  <span className="text-3xl font-black text-[#66dba3]">87% Dropped</span>
                  <p className="text-xs font-semibold text-zinc-500 mt-1">Reduction in workflow routing conflicts</p>
                </div>
              </div>
            </div>

            {/* In-depth Testimonial Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 p-8 text-zinc-800 font-serif text-9xl leading-none pointer-events-none select-none">“</div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3] bg-[#66dba3]/10 px-3 py-1 rounded-full border border-[#66dba3]/20">Enterprise Profile Case Study</span>
                <p className="mt-8 text-lg md:text-xl font-medium leading-relaxed text-zinc-200">
                  "dock has quickly solidified into the central backbone of our business operations architecture. Because we can deploy verified conversational paths safely from one dashboard, our customer teams resolve critical structural requests immediately without pulling technical engineers from deep sprint milestones."
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 border-t border-zinc-800 pt-6">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[#795bf4] border border-zinc-700">NM</div>
                <div>
                  <h5 className="font-bold text-white text-sm">Nina Mirabella</h5>
                  <p className="text-xs text-zinc-400">Senior Director, Marketing Operations at Superhuman</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. LIVE CONVERSATION & TASK METRIC COUNTER */}
        <section className="bg-zinc-50 border-y border-zinc-200 py-16 text-center px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Continuous Processing Metric State</p>
          <p className="mt-4 text-5xl font-black tracking-tight text-zinc-950 md:text-7xl">593,138,975</p>
          <p className="mt-2 text-sm font-semibold text-zinc-500">Global Customer Automations Securely Executed (and counting)</p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]"
            >
              Put your operations strategy to work
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* 8. PRE-BUILT CONFIGURATION MATRIX TEMPLATES */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Instant Integration Recipes</span>
              <h3 className="text-3xl font-black tracking-tight text-zinc-950 mt-2">Operational setups driving true outcomes</h3>
            </div>
            <Link href="/templates" className="mt-4 md:mt-0 text-sm font-bold text-[#795bf4] hover:underline flex items-center gap-1">
              See all deployment templates <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Template Card 1 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-[#795bf4]/10 text-[#795bf4] rounded-xl flex items-center justify-center mb-4"><MessageSquareMore size={20} /></div>
                <h4 className="font-bold text-zinc-950 text-base">Omni-Channel Lead Routing</h4>
                <p className="text-xs font-medium text-zinc-500 mt-2 leading-relaxed">Categorize and distribute inbound incoming inquiries across disparate target groups automatically based on pipeline priority tags.</p>
              </div>
              <button className="mt-6 w-full text-xs font-bold py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-800">Deploy Template</button>
            </div>

            {/* Template Card 2 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-[#66dba3]/10 text-[#66dba3] rounded-xl flex items-center justify-center mb-4"><CalendarCheck2 size={20} /></div>
                <h4 className="font-bold text-zinc-950 text-base">Booking & Calendar Sync</h4>
                <p className="text-xs font-medium text-zinc-500 mt-2 leading-relaxed">Detect booking slot choices instantly from chat interfaces and execute immediate calendar reservations for review pipelines.</p>
              </div>
              <button className="mt-6 w-full text-xs font-bold py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-800">Deploy Template</button>
            </div>

            {/* Template Card 3 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-4"><Sparkles size={20} /></div>
                <h4 className="font-bold text-zinc-950 text-base">Immediate Invoice Dispatch</h4>
                <p className="text-xs font-medium text-zinc-500 mt-2 leading-relaxed">Link validated conversion checkpoints to active transactional links via localized platform webhooks securely.</p>
              </div>
              <button className="mt-6 w-full text-xs font-bold py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-800">Deploy Template</button>
            </div>
          </div>
        </section>

        {/* 9. THE GOVERNANCE & SECURITY MATRIX CONTAINER */}
        <section className="bg-zinc-100 py-20 px-6 border-t border-zinc-200">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#795bf4]">Enterprise System Controls</span>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl mt-2">Enterprise-grade infrastructure that scales safely</h2>
              <p className="mt-3 text-sm font-medium text-zinc-500">Restrict endpoints, validate authentication layers, and monitor every running pipeline asset in real time.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <Shield className="h-8 w-8 text-[#795bf4] mb-4" />
                <h4 className="font-bold text-zinc-950 text-base">Granular Action Restrictions</h4>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Avoid basic binary block rules. dock allows endpoint-level permissions configuration across specific custom workspace groups cleanly.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <Layers className="h-8 w-8 text-[#66dba3] mb-4" />
                <h4 className="font-bold text-zinc-950 text-base">Isolated Shared Workspaces</h4>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Safely delegate system permissions to specific external operations groups without compromising cross-department analytical tracking.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <Zap className="h-8 w-8 text-zinc-900 mb-4" />
                <h4 className="font-bold text-zinc-950 text-base">Continuous Asset History</h4>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Every operational execution loop is structurally documented, recorded, and encrypted to prevent configuration drifts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL STRATEGIC CALL-TO-ACTION BANNER */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[3rem] bg-zinc-950 text-white p-8 md:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">Transition from Experiments to Scale</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl mt-4">Move your operations to real business results.</h2>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                Connect your customer endpoints. Establish explicit guardrails. Log structural workflows. Minutes to map out, completely eliminating system chaos.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/login?mode=signup"
                  className="rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef] shadow-lg shadow-[#795bf4]/20"
                >
                  Start free installation
                </Link>
                <Link
                  href="/sales"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Talk to sales engineers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. DEEP MODULAR SITE DIRECTORY FOOTER */}
      <footer className="bg-white border-t border-zinc-200 pt-16 pb-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 text-sm">
            
            {/* Column 1 - Global Index Links */}
            <div>
              <h6 className="font-bold text-zinc-950 text-xs uppercase tracking-wider mb-4">Integrations Directory</h6>
              <ul className="space-y-2 text-xs font-semibold text-zinc-500">
                <li><Link href="/apps/a" className="hover:text-zinc-900">Apps Alpha Index</Link></li>
                <li><Link href="/apps/popular" className="hover:text-zinc-900">Popular Connections</Link></li>
                <li><Link href="/apps/trending" className="hover:text-zinc-900">Trending Integrations</Link></li>
                <li><Link href="/apps/categories" className="hover:text-zinc-900">Category Layouts</Link></li>
              </ul>
            </div>

            {/* Column 2 - High Volume Apps */}
            <div>
              <h6 className="font-bold text-zinc-950 text-xs uppercase tracking-wider mb-4">Core Core Connections</h6>
              <ul className="space-y-2 text-xs font-semibold text-zinc-500">
                <li><Link href="/apps/whatsapp" className="hover:text-zinc-900">WhatsApp Pipeline</Link></li>
                <li><Link href="/apps/instagram" className="hover:text-zinc-900">Instagram Webhooks</Link></li>
                <li><Link href="/apps/bookedit" className="hover:text-zinc-900">BookedIt API Bridge</Link></li>
                <li><Link href="/apps/paynow" className="hover:text-zinc-900">PayNow Gateway</Link></li>
              </ul>
            </div>

            {/* Column 3 - Strategic Categories */}
            <div>
              <h6 className="font-bold text-zinc-950 text-xs uppercase tracking-wider mb-4">Top Operational Spaces</h6>
              <ul className="space-y-2 text-xs font-semibold text-zinc-500">
                <li><Link href="/categories/crm" className="hover:text-zinc-900">Customer Management</Link></li>
                <li><Link href="/categories/marketing" className="hover:text-zinc-900">Marketing Triggers</Link></li>
                <li><Link href="/categories/helpdesk" className="hover:text-zinc-900">Support Routing Pods</Link></li>
                <li><Link href="/categories/payments" className="hover:text-zinc-900">Transactional Logic</Link></li>
              </ul>
            </div>

            {/* Column 4 - Educational Content */}
            <div>
              <h6 className="font-bold text-zinc-950 text-xs uppercase tracking-wider mb-4">Verified Curations</h6>
              <ul className="space-y-2 text-xs font-semibold text-zinc-500">
                <li><Link href="/blog/best-crm" className="hover:text-zinc-900">Best CRM Infrastructure</Link></li>
                <li><Link href="/blog/best-chat" className="hover:text-zinc-900">Best Omni-Inbox Tools</Link></li>
                <li><Link href="/blog/security-audit" className="hover:text-zinc-900">System Security Guidelines</Link></li>
                <li><Link href="/blog/roi-metrics" className="hover:text-zinc-900">Operational ROI Playbooks</Link></li>
              </ul>
            </div>

            {/* Column 5 - Corporate Navigation */}
            <div>
              <h6 className="font-bold text-zinc-950 text-xs uppercase tracking-wider mb-4">Platform Architecture</h6>
              <ul className="space-y-2 text-xs font-semibold text-zinc-500">
                <li><Link href="/pricing" className="hover:text-zinc-900">Pricing Matrices</Link></li>
                <li><Link href="/developer" className="hover:text-zinc-900">Developer SDK Docs</Link></li>
                <li><Link href="/enterprise" className="hover:text-zinc-900">Enterprise Solutions</Link></li>
                <li><Link href="/careers" className="hover:text-zinc-900">Engineering Careers</Link></li>
              </ul>
            </div>

          </div>

          {/* Sub-Footer Legal Block */}
          <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 font-bold tracking-tight text-sm">dock</span>
              <span>© 2026 dock Inc. All rights reserved global code pipelines.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/cookies" className="hover:text-zinc-600">Manage Cookies</Link>
              <Link href="/legal" className="hover:text-zinc-600">Legal Clauses</Link>
              <Link href="/privacy" className="hover:text-zinc-600">Privacy Safeguards</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
