import Link from 'next/link';
import { ArrowRight, ChevronDown, MessageSquare, Sparkles, User, Shield, HelpCircle, Layers, Settings, Globe, Phone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-[#795bf4]/20">
      
      {/* 1. Global Announcement Banner */}
      <div className="bg-[#795bf4] text-white px-4 py-2.5 text-center text-xs font-medium tracking-wide">
        AI Masterclass 2026: Join live workshops to assess AI readiness and build a plan to scale agentic service.{' '}
        <Link href="#" className="underline font-bold hover:text-zinc-100 ml-1 inline-flex items-center gap-0.5">
          Register now <ArrowRight size={12} />
        </Link>
      </div>

      {/* 2. Global Sticky Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9" />
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900">dock</span>
            </Link>
            <nav className="hidden items-center gap-8 lg:flex text-[14px] font-semibold text-zinc-600">
              <Link href="#" className="flex items-center gap-1 hover:text-zinc-900">Platform <ChevronDown size={14} /></Link>
              <Link href="#" className="flex items-center gap-1 hover:text-zinc-900">Products <ChevronDown size={14} /></Link>
              <Link href="#" className="flex items-center gap-1 hover:text-zinc-900">Solutions <ChevronDown size={14} /></Link>
              <Link href="#" className="flex items-center gap-1 hover:text-zinc-900">Resources <ChevronDown size={14} /></Link>
              <Link href="/pricing" className="hover:text-zinc-900">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden text-[14px] font-semibold text-zinc-600 hover:text-zinc-900 sm:block">
              Contact us
            </Link>
            <Link href="/login" className="text-[14px] font-semibold text-zinc-600 hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-[#795bf4] px-5 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#6847ef] shadow-sm hover:shadow"
            >
              Try for free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 3. Hero Split Section */}
        <section className="bg-[#795bf4] text-white overflow-hidden relative">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:items-center lg:py-32">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3] bg-[#66dba3]/10 px-3 py-1 rounded-full border border-[#66dba3]/20">
                AI-POWERED SERVICE PLATFORM
              </span>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                Move beyond deflection. Deliver <span className="text-[#66dba3]">real resolutions.</span>
              </h1>
              <p className="max-w-xl text-lg font-medium text-purple-100/90 leading-relaxed md:text-xl">
                Self-improving AI agents that learn, adapt, and outperform. On every channel, on any platform.
              </p>
              
              <div className="pt-4">
                <div className="flex max-w-md flex-col gap-3 sm:flex-row bg-white p-1.5 rounded-2xl shadow-xl">
                  <input
                    type="email"
                    placeholder="Enter work email"
                    className="w-full bg-transparent px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none text-sm"
                  />
                  <button className="whitespace-nowrap rounded-xl bg-[#66dba3] px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-[#55c490]">
                    Try for free
                  </button>
                </div>
                <p className="mt-3 text-xs text-purple-200/80 pl-2">
                  14-day free trial. No credit card required.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              {/* Decorative Glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#66dba3]/20 to-transparent blur-3xl rounded-full" />
              {/* Mockup Window UI */}
              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
                <div className="rounded-2xl bg-white p-5 text-zinc-900 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#66dba3] animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">dock AI agent</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">Active</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-zinc-50 border border-zinc-100 p-3.5 rounded-2xl max-w-[85%]">
                      <p className="font-bold text-[11px] text-zinc-400 uppercase tracking-tight mb-0.5">dock AI</p>
                      <p className="text-zinc-700 leading-relaxed">Sure, happy to help! Can you please confirm your register email?</p>
                    </div>
                    <div className="bg-[#795bf4]/10 border border-[#795bf4]/10 p-3.5 rounded-2xl max-w-[85%] ml-auto text-right">
                      <p className="font-bold text-[11px] text-[#795bf4] uppercase tracking-tight mb-0.5">Mia</p>
                      <p className="text-zinc-800 leading-relaxed">Mia@email.com. It says ineligible but I've definitely earned these points.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Infinite Trust Banner Component */}
        <section className="bg-white py-16 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              22,000+ SERVICE TEAMS TRUST DOCK AI
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 text-2xl font-black tracking-tight text-zinc-300">
              <span className="hover:text-zinc-500 transition-colors cursor-default">SIEMENS</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">GitHub</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">Uber</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">box</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">vimeo</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">LUSH</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">TESCO</span>
              <span className="hover:text-zinc-500 transition-colors cursor-default">Discord</span>
            </div>
          </div>
        </section>

        {/* 5. Resolution Learning Signal Sequence Loop */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl lg:text-6xl leading-[1.05]">
                AI that gets smarter with every resolution.
              </h2>
              <p className="text-lg font-medium leading-relaxed text-zinc-500">
                Achieve up to 80% automation with AI Agents that continuously learn from every interaction, handle more complex workflows, and deliver better outcomes.
              </p>
              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-2 font-bold text-[#795bf4] hover:text-[#6847ef] transition-colors text-base group">
                  Explore the platform <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Every conversation becomes a learning signal
                </span>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-[#795bf4] flex items-center justify-center shrink-0"><MessageSquare size={16} /></div>
                  <div className="text-sm">
                    <p className="font-bold text-zinc-900">"What is your return policy?"</p>
                    <p className="text-zinc-500 mt-1">Sorry, I'm not sure. I'll transfer you to a human agent.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#66dba3] block">
                  Dock AI turns signals into improvement
                </span>
                <div className="p-4 bg-[#66dba3]/5 rounded-xl border border-[#66dba3]/20">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Topic Identified</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">Return policy</p>
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
                    <span>Fill knowledge gaps automatically</span>
                    <span className="text-[#795bf4] font-bold">Create article</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Quantitative Dashboard Statistics Banner */}
        <section className="bg-zinc-50 border-y border-zinc-200/60 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md max-w-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#66dba3]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live AI Resolution</span>
                    </div>
                    <span className="bg-[#66dba3]/10 text-[#55c490] px-2.5 py-0.5 rounded-full text-xs font-bold">Success</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">"Can I still return my item?"</p>
                  <p className="mt-2.5 text-sm text-zinc-600 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 leading-relaxed">
                    <strong>dock AI:</strong> Yes. We allow refunds for up to 30 days, and I see you placed your order 2 weeks ago. Want to start a return?
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl leading-none">
                  Faster resolutions. Stronger loyalty. Better outcomes.
                </h2>
                <p className="text-zinc-500 font-medium">
                  Trillions of data points turned into billions of successful outcomes.
                </p>
                
                <div className="grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">22K+</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">AI Customers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">830M</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">AI Interactions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">4.8B</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Resolutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Keynote Showcase Frame */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-[32px] p-8 md:p-12 text-white overflow-hidden relative shadow-xl">
            <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-[#795bf4]/10 rounded-full blur-3xl" />
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="text-xs font-bold text-[#66dba3] tracking-widest uppercase">dock relate 2026</span>
              <h3 className="text-3xl font-black tracking-tight md:text-4xl leading-tight">
                Revisit the stage with bold headliners, industry thought leaders, and big-brand experts.
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                From visionary keynotes to deep-dive product stories, the best of 2026 is ready when you are.
              </p>
              <div className="pt-2">
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-100 flex items-center gap-2">
                  Watch now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Functional Capabilities Matrix Side-By-Side */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24 space-y-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl leading-[1.1]">
              Self-improving AI agents, for every channel and platform
            </h2>
            <p className="text-lg text-zinc-500 font-medium">
              Dock AI agents now reason, act, and resolve across every channel—improving with every single interaction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#795bf4] flex items-center justify-center"><MessageSquare size={22} /></div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Build Custom Agents</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Build custom agents to automate critical AI and human workflows. Extend your intelligence baseline safely across any operational workspace.
                </p>
              </div>
              <div className="pt-6">
                <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#795bf4] hover:underline">
                  Explore AI agents <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#66dba3]/10 text-[#55c490] flex items-center justify-center"><Sparkles size={22} /></div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">A Copilot for every role</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Dock Copilots now guide every role—helping agents resolve tasks faster, admins optimize operations, knowledge teams keep content fresh, and analysts turn insight into action.
                </p>
              </div>
              <div className="pt-6">
                <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#795bf4] hover:underline">
                  Explore Copilot <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Forethought Integrated Native Strategy Hub */}
        <section className="bg-zinc-950 text-white rounded-t-[48px] py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="max-w-3xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3] bg-[#66dba3]/10 px-3 py-1 rounded-full border border-[#66dba3]/20">
                DOCK FORETHOUGHT <span className="ml-1 text-[10px] bg-white text-zinc-950 px-1.5 py-0.5 rounded font-black">NEW</span>
              </span>
              <h2 className="text-4xl font-black tracking-tight md:text-6xl leading-[1.05]">
                Self-improving AI Agents on any platform.
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Deploy AI agents that learn and improve on any platform. Powered by the Dock Resolution Learning Loop, every resolution makes the next one better, improving performance over time.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                  Request Forethought demo
                </button>
                <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
                  Learn more
                </button>
              </div>
            </div>

            {/* Architecture Structural Grid Overviews */}
            <div className="mt-24 grid gap-8 border-t border-zinc-800 pt-16 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2"><Layers size={14} /></div>
                <h4 className="text-sm font-bold text-white">Designed for AI-first customer service</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">A unified system that brings AI and human teamwork together to deliver high-quality resolutions across every channel and service model.</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2"><MessageSquare size={14} /></div>
                <h4 className="text-sm font-bold text-white">Manage high volume autonomously</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Free your team from repetition. AI agents understand intent and sentiment to resolve tasks end-to-end without human intervention.</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2"><Sparkles size={14} /></div>
                <h4 className="text-sm font-bold text-white">Launch in minutes, not months</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Zero intense specialized historical data preparation cycles or custom model tuning required out-of-the-box.</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2"><Shield size={14} /></div>
                <h4 className="text-sm font-bold text-white">Scale without adding headcount</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Keep operational structural efficiencies and system stability consistent under massive unpredictable conversation surges.</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2"><Phone size={14} /></div>
                <h4 className="text-sm font-bold text-white">Modernize voice with Agentic AI</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Bridge your complex enterprise transactional intelligence networks directly into real-time interactive vocal service tracks natively.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Operational Framework Vertical Alignment */}
        <section className="bg-white py-24 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                Extend the power of AI-first service across your entire organization.
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/60 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Employee Service</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Get AI-native employee service management with none of the bloat. Offer instant answers right where your employees work, with permissions and governance built in. Resolve internal requests instantly, eliminate complexity, and delight employees.
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <Link href="#" className="rounded-xl bg-[#795bf4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6847ef]">Try for free</Link>
                  <Link href="#" className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Explore Al agents for Employee Service</Link>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/60 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Contact Center</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Replace fragmented legacy stacks with a unified system that embeds AI natively across voice and digital channels. Deliver an enterprise-grade contact center without the middleware, custom integrations, or architecture complexity.
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <Link href="#" className="rounded-xl bg-[#795bf4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6847ef]">Contact sales</Link>
                  <Link href="#" className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Learn more</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Gartner Analyst & Enterprise Placement Report Block */}
        <section className="bg-zinc-900 text-white py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3] block">REPORT ACHIEVEMENT</span>
              <h3 className="text-3xl font-black tracking-tight md:text-5xl leading-tight">
                Dock named a Leader in the 2025 Gartner Magic Quadrant™ for the CRM Customer Engagement Center
              </h3>
              <p className="text-sm text-zinc-400 max-w-xl">
                Recognized for continuous system innovation, vision framework layouts, and consistent product execution in AI-powered scalable service infrastructure.
              </p>
              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-1.5 font-bold text-[#66dba3] hover:underline text-sm">
                  Read the full report <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 h-80 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
                <div className="h-6 w-16 bg-zinc-700 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-zinc-700 rounded" />
                  <div className="h-4 w-3/4 bg-zinc-700 rounded" />
                </div>
                <div className="h-10 w-full bg-[#795bf4] rounded-xl flex items-center justify-center text-xs font-bold">Gartner 2025</div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. Corporate Review & Customer Validation Proof Grid */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center lg:py-32 space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              Built for businesses of all sizes
            </h2>
            <p className="text-zinc-500 font-medium">From startups to enterprises, we deliver the specialized support you need to win.</p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-[32px] max-w-5xl mx-auto p-8 md:p-12 text-left flex flex-col md:flex-row items-start gap-8 shadow-sm">
            <div className="bg-zinc-950 text-white font-black text-xs px-4 py-2 rounded-lg tracking-widest uppercase shrink-0">
              SEAT GEEK
            </div>
            <div className="space-y-4">
              <blockquote className="text-xl font-medium text-zinc-800 leading-relaxed">
                “The zero-training model has been amazing. It can surface content based on an event, like the Mets versus Yankees, and it feels very personalized.”
              </blockquote>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-[#795bf4] font-bold"><User size={18} /></div>
                <div>
                  <p className="text-sm font-bold text-zinc-950">Whitney Thomas</p>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Senior business systems Analyst at seatgeek</p>
                  <Link href="#" className="text-xs text-[#795bf4] font-bold block mt-1 hover:underline">Read customer story</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13. System Integrations Alignment Banner */}
        <section className="bg-zinc-50 border-t border-zinc-200/60 py-20">
          <div className="mx-auto max-w-7xl px-6 text-center max-w-3xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Connect your ecosystem. Your way.
            </h2>
            <p className="text-zinc-500 font-medium max-w-xl mx-auto leading-relaxed">
              Quickly integrate your favorite tools and partners to get value immediately, and tailor the setup to your organization's exact needs.
            </p>
            <div className="pt-2">
              <Link href="#" className="font-bold text-[#795bf4] text-sm hover:underline inline-flex items-center gap-1">
                Learn more about integration frameworks <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 14. Additional Data Metric Resource Cards */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-32 border-t border-zinc-100">
          <div className="lg:col-span-4 space-y-6 mb-12 lg:mb-0">
            <h3 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Additional resources</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">Explore standard industry trends, toolkits, case metrics, and structural whitepapers built to maximize agent operations.</p>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <p className="text-5xl font-black text-[#795bf4] tracking-tight">51.5%</p>
              <p className="text-sm font-bold text-zinc-800">automated resolution rate</p>
              <p className="text-xs text-zinc-400 leading-relaxed">Average verified baseline automation metrics attained within 30 active platform days.</p>
            </div>
          </div>

          <div className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">PRODUCT FEATURED</span>
                <h4 className="text-lg font-bold text-zinc-950 leading-snug">A powerful, flexible platform tracking operational scale</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline inline-flex items-center gap-0.5">Learn more <ArrowRight size={12} /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#795bf4] block">REPORT</span>
                <h4 className="text-lg font-bold text-zinc-950 leading-snug">CX Trends 2026: The Agentic Revolution Framework</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline inline-flex items-center gap-0.5">Learn more <ArrowRight size={12} /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-2">
                <div className="text-xl font-black text-[#55c490] flex items-center gap-1">6% <span className="text-xs font-bold text-zinc-400 font-normal">Increase</span></div>
                <h4 className="text-base font-bold text-zinc-800">Increase in automated resolutions performance quarterly</h4>
              </div>
              <Link href="#" className="mt-4 text-xs font-bold text-[#795bf4] hover:underline inline-flex items-center gap-0.5">Learn more <ArrowRight size={12} /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-2">
                <div className="text-xl font-black text-[#55c490] flex items-center gap-1">2x <span className="text-xs font-bold text-zinc-400 font-normal">Growth</span></div>
                <h4 className="text-base font-bold text-zinc-800">increase in AI agent CSAT satisfaction evaluation metrics</h4>
              </div>
              <Link href="#" className="mt-4 text-xs font-bold text-[#795bf4] hover:underline inline-flex items-center gap-0.5">Learn more <ArrowRight size={12} /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between sm:col-span-2 hover:border-zinc-300 transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#795bf4] block">GUIDE</span>
                <h4 className="text-lg font-bold text-zinc-950">Dock AI: the service superpower toolsets operational manual</h4>
              </div>
              <Link href="#" className="mt-4 text-xs font-bold text-[#795bf4] hover:underline inline-flex items-center gap-0.5">Learn more <ArrowRight size={12} /></Link>
            </div>
          </div>
        </section>

        {/* 15. Tier Pricing Call-out Intermediary Frame */}
        <section className="bg-zinc-50 py-16 border-y border-zinc-200/60 text-center">
          <div className="mx-auto max-w-4xl px-6 space-y-4">
            <h3 className="text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">Pricing built for your success</h3>
            <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
              Get faster resolutions, happier customers, and a team that does more with less at a price that scales with you.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button className="rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                See plans & pricing
              </button>
              <button className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50">
                Calculate your ROI
              </button>
            </div>
          </div>
        </section>

        {/* 16. Final Interactive Call to Action Panel */}
        <section className="bg-zinc-900 text-white py-24 rounded-b-[48px] text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 relative z-10 space-y-6">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Launch your first AI agent today
            </h2>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button className="rounded-xl bg-[#66dba3] px-8 py-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-[#55c490] shadow-lg">
                Try for free
              </button>
              <button className="rounded-xl bg-zinc-800 border border-zinc-700 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-700">
                Get a demo
              </button>
            </div>
            <div className="pt-4 text-xs text-zinc-400 space-y-1">
              <p>Need to know more explicitly regarding data metrics?</p>
              <Link href="#" className="font-bold text-[#66dba3] hover:underline flex items-center justify-center gap-0.5">View FAQs <HelpCircle size={12} /></Link>
            </div>
          </div>
        </section>
      </main>

      {/* 17. Mega Cross-Referenced Directory Sitemap Footer */}
      <footer className="bg-zinc-950 text-zinc-400 text-xs py-20 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Products</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Dock for customer service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock for employee service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock for contact center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">System status</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sign in</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Demo tracks</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Features</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">AI agents</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Copilot</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock AI features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Messaging and live chat</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Advanced Data Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Knowledge base</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ticketing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Voice infrastructure</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Reporting & analytics</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Resources</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Help center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security vectors</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API and developers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog insights</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">AI research loops</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Events & webinars</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Customer stories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Academy courses</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Company</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Newsroom hub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers pipeline</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Inclusion & Belonging</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Accessibility Plan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sustainability report</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock Foundation</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Compare</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Dock vs. Intercom</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock vs. Salesforce</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock vs. Freshdesk</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Business Size</h5>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-white transition-colors">Dock for Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock for Small Business</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dock for Startups</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Meta Terms Section */}
        <div className="mx-auto max-w-7xl px-6 mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-zinc-500">
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 Dock Inc. All rights reserved. Clone architecture replication complete.</p>
            <p className="text-zinc-600">All brand imagery text loops transformed systematically into your operational brand identities.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie settings</Link>
            <Link href="#" className="hover:text-white transition-colors">Trust Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
