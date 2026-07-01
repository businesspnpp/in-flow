import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CreditCard, MessageSquareMore, Sparkles, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
      {/* Top Banner Opportunity */}
      <div className="bg-[#795bf4] text-white px-4 py-2.5 text-center text-xs font-semibold tracking-wide">
        AI Masterclass 2026: Join live workshops to assess AI readiness and build a plan to scale agentic service.{' '}
        <Link href="#" className="underline hover:text-zinc-100 ml-1">Register now</Link>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9" />
              <span className="text-2xl font-bold tracking-tight text-zinc-900">dock</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex text-sm font-semibold text-zinc-600">
              <Link href="#" className="hover:text-zinc-900">Platform</Link>
              <Link href="#" className="hover:text-zinc-900">Products</Link>
              <Link href="#" className="hover:text-zinc-900">Solutions</Link>
              <Link href="#" className="hover:text-zinc-900">Resources</Link>
              <Link href="/pricing" className="hover:text-zinc-900">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden text-sm font-semibold text-zinc-600 hover:text-zinc-900 sm:block">
              Contact us
            </Link>
            <Link href="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6847ef]"
            >
              Try for free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Hero Split Block */}
        <section className="bg-[#795bf4] text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">
                AI-POWERED SERVICE PLATFORM
              </span>
              <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Move beyond deflection. Deliver real resolutions.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium text-purple-100">
                Self-improving AI agents that learn, adapt, and outperform. On every channel, on any platform.
              </p>
              
              <div className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter work email"
                  className="w-full rounded-xl border-none bg-white px-4 py-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#66dba3]"
                />
                <button className="whitespace-nowrap rounded-xl bg-[#66dba3] px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition-colors hover:bg-[#55c490]">
                  Try for free
                </button>
              </div>
              <p className="mt-3 text-xs text-purple-200">
                14-day free trial. No credit card required.
              </p>
            </div>

            {/* Simulated Live Interface Widget */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-xl">
              <div className="rounded-2xl bg-white p-5 text-zinc-900 shadow-lg">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <div className="h-2 w-2 rounded-full bg-[#66dba3]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">AI Agent</span>
                </div>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="bg-zinc-100 p-3 rounded-xl max-w-[85%]">
                    <p className="font-semibold text-xs text-zinc-500 mb-0.5">dock AI</p>
                    Sure, happy to! Can you please share your email?
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl max-w-[85%] ml-auto text-right">
                    <p className="font-semibold text-xs text-[#795bf4] mb-0.5">Mia</p>
                    Mia@email.com. It says ineligible but I've definitely earned these points.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Trust Banner & Core Feature Loop */}
        <section className="bg-white py-16 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              22,000+ SERVICE TEAMS TRUST DOCK AI
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-xl font-black tracking-tight text-zinc-300 sm:gap-16">
              <span className="hover:text-zinc-400 transition-colors">SIEMENS</span>
              <span className="hover:text-zinc-400 transition-colors">GitHub</span>
              <span className="hover:text-zinc-400 transition-colors">Uber</span>
              <span className="hover:text-zinc-400 transition-colors">Discord</span>
              <span className="hover:text-zinc-400 transition-colors">TESCO</span>
              <span className="hover:text-zinc-400 transition-colors">LUSH</span>
            </div>
          </div>
        </section>

        {/* Section 3: Learning Signals & Context Loop */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
                AI that gets smarter with every resolution.
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-500">
                Achieve up to 80% automation with AI Agents that continuously learn from every interaction, handle more complex workflows, and deliver better outcomes.
              </p>
              <div className="mt-8">
                <Link href="#" className="inline-flex items-center gap-2 font-bold text-[#795bf4] hover:underline">
                  Explore the platform <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Conversation signals block */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Every conversation becomes a learning signal</span>
                <div className="mt-3 flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-[#795bf4]"><MessageSquareMore size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">"What is your return policy?"</p>
                    <p className="mt-1 text-xs text-zinc-400">AI Agent: Transferring to human fallback channel...</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#66dba3]">Dock AI turns signals into improvement</span>
                <div className="mt-3">
                  <div className="inline-block rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                    Topic Identified: Return Policy
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Creating suggested fallback knowledge articles automatically...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Resolution & Outcomes Showcase */}
        <section className="bg-zinc-50 border-y border-zinc-200/60 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#66dba3] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-[#66dba3] mb-3">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Automated Resolution Success</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-800">"Can I still return my item?"</p>
                  <p className="mt-2 text-sm text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <strong>AI Agent:</strong> Yes. We allow refunds for up to 30 days, and I see you placed your order 2 weeks ago. Want to start a return?
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
                  Faster resolutions. Stronger loyalty. Better outcomes.
                </h2>
                <p className="mt-4 text-zinc-500 font-medium">
                  Trillions of data points turned into billions of successful outcomes.
                </p>
                
                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-zinc-200 pt-8">
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4]">22K+</p>
                    <p className="text-xs font-semibold text-zinc-400 uppercase mt-1">AI Customers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4]">830M</p>
                    <p className="text-xs font-semibold text-zinc-400 uppercase mt-1">AI Interactions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4]">4.8B</p>
                    <p className="text-xs font-semibold text-zinc-400 uppercase mt-1">Resolutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Highlight Capabilities Matrix */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
              Self-improving AI agents, for every channel and platform
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Dock AI agents now reason, act, and resolve across every channel—improving with every single interaction.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:border-zinc-300 transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-[#795bf4] mb-6">
                <MessageSquareMore size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Build Custom Agents</h3>
              <p className="mt-3 text-zinc-500 leading-relaxed">
                Build custom agents to automate critical AI and human workflows. Extend your intelligence baseline safely across any operational workspace.
              </p>
              <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#795bf4] hover:underline">
                Explore AI agents <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:border-zinc-300 transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#66dba3]/20 flex items-center justify-center text-[#55c490] mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-950">A Copilot for every role</h3>
              <p className="mt-3 text-zinc-500 leading-relaxed">
                Dock Copilots now guide every role—helping agents resolve tasks faster, admins optimize operations, and analysts turn raw insight into immediate actions.
              </p>
              <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#795bf4] hover:underline">
                Explore Copilots <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Unified System Strategy Block */}
        <section className="bg-zinc-950 text-white py-20 rounded-t-[40px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">
                DOCK AGENTIC WORKSPACE
              </span>
              <h2 className="text-4xl font-black tracking-tight mt-4 md:text-6xl">
                Self-improving AI Agents on any platform.
              </h2>
              <p className="mt-6 text-lg text-zinc-400">
                Deploy AI agents that learn and improve on any channel ecosystem. Powered by the Resolution Learning Loop, every outcome makes the next one faster.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                  Request a demo
                </button>
                <button className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
                  Learn more
                </button>
              </div>
            </div>

            <div className="mt-20 grid gap-8 border-t border-zinc-800 pt-16 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="text-lg font-bold text-white">Manage high volume autonomously</h4>
                <p className="mt-2 text-sm text-zinc-400">Free your human support vectors from repetition entirely.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Launch in minutes, not months</h4>
                <p className="mt-2 text-sm text-zinc-400">Zero intense specialized training cycles required out-of-the-box.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Scale without adding headcount</h4>
                <p className="mt-2 text-sm text-zinc-400">Keep structural framework efficiencies consistent under immense loads.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Modernize voice with Agentic AI</h4>
                <p className="mt-2 text-sm text-zinc-400">Bridge digital execution intelligence directly into traditional voice tracks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Verticals Expansion (Employee Service vs Contact Center) */}
        <section className="bg-white py-20 lg:py-28 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
            <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/60 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Employee Service</h3>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                  Get AI-native employee service management with none of the typical system bloat. Resolve internal requests instantly, eliminate complex handoffs, and keep internal teams moving smoothly.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="#" className="text-sm font-bold text-[#795bf4] hover:underline">Try for free</Link>
                <Link href="#" className="text-sm font-bold text-zinc-500 hover:underline">Learn more</Link>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/60 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Contact Center</h3>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                  Replace fragmented legacy software stacks with a single unified workspace that embeds conversational agent intelligence natively across voice and digital engagement pipelines seamlessly.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="#" className="text-sm font-bold text-[#795bf4] hover:underline">Contact sales</Link>
                <Link href="#" className="text-sm font-bold text-zinc-500 hover:underline">Learn more</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Social Proof & Analyst Validation */}
        <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-28">
          <div className="inline-block bg-purple-50 text-[#795bf4] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            REPORT ACHIEVEMENTS
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl max-w-3xl mx-auto">
            Dock recognized for innovation, vision, and execution.
          </h2>
          
          <div className="mt-12 bg-zinc-50 border border-zinc-200 p-8 rounded-3xl max-w-4xl mx-auto text-left flex flex-col md:flex-row items-start gap-6">
            <div className="text-4xl font-black text-[#795bf4] tracking-tighter">“</div>
            <div>
              <p className="text-lg font-medium text-zinc-800 leading-relaxed">
                The zero-training model has been amazing. It can surface content contextually based on real-time triggers, and it feels completely personalized to our operational workflow.
              </p>
              <div className="mt-4">
                <p className="font-bold text-zinc-950 text-sm">Whitney Thomas</p>
                <p className="text-xs text-zinc-500">Senior Business Systems Analyst at SeatGeek</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Ecosystem and Integrations Grid */}
        <section className="bg-zinc-50 border-t border-zinc-200/60 py-20">
          <div className="mx-auto max-w-7xl px-6 text-center max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Connect your ecosystem. Your way.
            </h2>
            <p className="mt-4 text-zinc-500 font-medium">
              Quickly integrate your favorite operational tools and channel structures to maximize immediate efficiency value, tailoring setups exact to your rules.
            </p>
            <div className="mt-6">
              <Link href="#" className="font-bold text-[#795bf4] text-sm hover:underline">Learn more</Link>
            </div>
          </div>
        </section>

        {/* Section 10: Additional Metric Resources & Stats */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:grid lg:grid-cols-3 lg:gap-12 lg:py-28">
          <div className="lg:col-span-1 space-y-6 mb-12 lg:mb-0">
            <h3 className="text-3xl font-black tracking-tight text-zinc-950">Additional resources</h3>
            <p className="text-zinc-500 text-sm font-medium">Explore standard industry trends, toolkits, metrics, and guides built to help maximize agent operations.</p>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <p className="text-5xl font-black text-[#795bf4]">51.5%</p>
              <p className="mt-2 text-sm font-bold text-zinc-800">Automated Resolution Rate</p>
              <p className="mt-1 text-xs text-zinc-400">Average benchmark attained within 30 operational days.</p>
            </div>
          </div>

          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">CX Trends Report</span>
                <h4 className="mt-2 text-lg font-bold text-zinc-950">The Service Superpower Guide</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline">Learn more</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Product Feature</span>
                <h4 className="mt-2 text-lg font-bold text-zinc-950">A powerful, flexible agent ecosystem</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline">Learn more</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#66dba3]">Growth metrics</span>
                <h4 className="mt-2 text-lg font-bold text-zinc-950">6% Increase in automated resolutions</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline">Learn more</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#66dba3]">Satisfaction benchmarks</span>
                <h4 className="mt-2 text-lg font-bold text-zinc-950">2x Increase in native AI Agent CSAT score</h4>
              </div>
              <Link href="#" className="mt-6 text-xs font-bold text-[#795bf4] hover:underline">Learn more</Link>
            </div>
          </div>
        </section>

        {/* Section 11: Call To Action Footer Frame */}
        <section className="bg-zinc-50 border-t border-zinc-200 py-20 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
              Launch your first AI agent today
            </h2>
            <p className="mt-4 text-zinc-500 font-medium max-w-xl mx-auto">
              Pricing built completely for your continuous success. Get faster resolutions at a flexible price point that scales seamlessly with you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                Try for free
              </button>
              <button className="rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50">
                Get a demo
              </button>
            </div>
            <div className="mt-4">
              <Link href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-600 underline">View FAQs</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Comprehensive Footer Directory */}
      <footer className="bg-zinc-950 text-zinc-400 text-xs py-16 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Products</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Customer Service</Link></li>
              <li><Link href="#" className="hover:text-white">Employee Service</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Center</Link></li>
              <li><Link href="#" className="hover:text-white">Integrations</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing Plans</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Features</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">AI Agents</Link></li>
              <li><Link href="#" className="hover:text-white">Copilot Tools</Link></li>
              <li><Link href="#" className="hover:text-white">Live Chat & SMS</Link></li>
              <li><Link href="#" className="hover:text-white">Ticketing Pipelines</Link></li>
              <li><Link href="#" className="hover:text-white">Voice & Phone</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Resources</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">API Docs</Link></li>
              <li><Link href="#" className="hover:text-white">AI Research</Link></li>
              <li><Link href="#" className="hover:text-white">Customer Stories</Link></li>
              <li><Link href="#" className="hover:text-white">Academy Modules</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Company</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-white">Foundation</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Compare</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">vs Intercom</Link></li>
              <li><Link href="#" className="hover:text-white">vs Salesforce</Link></li>
              <li><Link href="#" className="hover:text-white">vs Freshdesk</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Business Size</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">For Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white">For Small Business</Link></li>
              <li><Link href="#" className="hover:text-white">For Startups</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Dock Inc. All rights reserved. Built using brand colors and layout architecture overrides.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Terms of Use</Link>
            <Link href="#" className="hover:text-white">Privacy Notice</Link>
            <Link href="#" className="hover:text-white">Cookie Settings</Link>
            <Link href="#" className="hover:text-white">Trust Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
