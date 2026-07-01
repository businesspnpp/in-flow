import Link from 'next/link';
import { ArrowRight, Star, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0826] text-white font-sans antialiased selection:bg-[#66dba3]/30">
      
      {/* 1. TOP BANNER */}
      <div className="w-full bg-[#1b0d45] border-b border-white/5 py-3 px-4 text-center text-xs md:text-sm font-medium tracking-wide">
        <span>Dock Waves '26 tickets are live. Join us in Prague, Oct 19-20, for two days of operations, automation, and what's next. </span>
        <Link href="/pricing" className="text-[#66dba3] hover:underline ml-1 font-semibold">
          Save with early-bird pricing →
        </Link>
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0826]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9" />
              <span className="text-2xl font-bold tracking-tight text-white">dock</span>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex text-sm font-medium text-zinc-400">
              <button className="flex items-center gap-1 hover:text-white transition-colors">What is Dock <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Dock AI <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Solutions <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Resources <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Partners <ChevronDown size={14} /></button>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Talk to sales</button>
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors px-3 py-2">Sign in</Link>
            <Link
              href="/login?mode=signup"
              className="rounded-xl bg-[#795bf4] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#6847ef] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 3. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 text-center md:pt-24 md:pb-32 relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#795bf4]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight leading-[1.05] sm:text-7xl bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
            The visual workspace <br />automation platform
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-zinc-400 font-medium leading-relaxed">
            Connect any app, data source, or tool. Build and manage automations and internal customer agents—visually, in code, or with a prompt.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto rounded-xl bg-[#795bf4] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#6847ef] shadow-lg shadow-[#795bf4]/20 hover:scale-[1.02]"
            >
              Get started free
            </Link>
            <button className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              Talk to sales
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5">✓ No credit card required</span>
            <span className="flex items-center gap-1.5">✓ No time limit on Free plan</span>
          </div>

          {/* CUSTOMER LOGOS ROW */}
          <div className="mt-20 border-t border-b border-white/[0.04] py-8">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Trusted by scaling operators everywhere</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale contrast-200">
              <span className="text-xl font-black tracking-tighter">Bamboo</span>
              <span className="text-xl font-black tracking-tighter">&gt; BNY</span>
              <span className="text-xl font-black tracking-tighter">Bolt</span>
              <span className="text-xl font-black tracking-tighter">FINN</span>
              <span className="text-xl font-black tracking-tighter">Perk</span>
            </div>
          </div>
        </section>

        {/* 4. SOCIAL PROOF RATINGS GRID */}
        <section className="bg-white/[0.01] border-b border-white/[0.04] py-10">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { provider: 'Capterra', score: '4.8' },
              { provider: 'G2', score: '4.7' },
              { provider: 'Getapp', score: '4.8' },
              { provider: 'Gartner', score: '4.6' }
            ].map((rating, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{rating.provider}</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-[#66dba3] text-[#66dba3]" />
                  <span className="text-sm font-bold text-zinc-200">{rating.score}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CORE CAPABILITIES (3-COLUMN BOXES) */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            The platform to build and manage all <br />your operational flows and agents
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {/* Box 1 */}
            <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#795bf4]/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#795bf4]/10 text-[#795bf4] group-hover:bg-[#795bf4]/20 transition-colors">
                <span className="text-lg font-bold">01</span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-white">Adopt workflows across your business.</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-400">
                Deploy customized operations and automated sequences instantly using over 3,000 deep network integrations.
              </p>
            </div>

            {/* Box 2 */}
            <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#795bf4]/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#66dba3]/10 text-[#66dba3] group-hover:bg-[#66dba3]/20 transition-colors">
                <span className="text-lg font-bold">02</span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-white">From idea to live execution. Fast.</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-400">
                Build workspaces by standard natural language prompt, drag-and-drop structural design, or deep custom protocol integration.
              </p>
            </div>

            {/* Box 3 */}
            <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#795bf4]/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#795bf4]/10 text-[#795bf4] group-hover:bg-[#795bf4]/20 transition-colors">
                <span className="text-lg font-bold">03</span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-white">Scale without losing critical visibility.</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-400">
                Monitor every moving transaction, interaction state, and edge connector within one infinite visual dashboard environment.
              </p>
            </div>
          </div>

          <button className="mt-12 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
            Explore core features
          </button>
        </section>

        {/* 6. TABBED SOLUTION PREVIEW SECTION */}
        <section className="border-t border-white/[0.04] bg-gradient-to-b from-white/[0.01] to-transparent py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#66dba3]">Solutions</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-white">
              Adapt at speed with visual-first orchestration
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-zinc-400 font-medium">
              Dock drives organization efficiencies, addresses scaling limits, and fuels rapid tool deployment by unifying cross-department workflows.
            </p>

            {/* Tab Links */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.06] pb-4">
              {['IT System', 'Operations', 'Marketing', 'Sales', 'Finance', 'Customer Support', 'HR Teams'].map((tab, idx) => (
                <button 
                  key={tab} 
                  className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${idx === 0 ? 'bg-[#795bf4]/20 text-[#66dba3] border border-[#795bf4]/30' : 'text-zinc-400 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dynamic Layout Splitting Preview */}
            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center text-left">
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#795bf4]/10 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500">live_workspace_flow.json</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xl text-blue-400">G</div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400">TRIGGER EVENT DETECTED</p>
                      <p className="text-sm font-semibold text-white">Incoming unstructured database inquiry</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gradient-to-b from-[#795bf4] to-transparent ml-9" />
                  <div className="flex items-center gap-4 rounded-xl border border-[#66dba3]/20 bg-[#66dba3]/5 p-4 ml-6">
                    <div className="h-10 w-10 rounded-lg bg-[#66dba3]/20 flex items-center justify-center text-xl">⚡</div>
                    <div>
                      <p className="text-xs font-bold text-[#66dba3]">AUTOMATED RESOLUTION ACTION</p>
                      <p className="text-sm font-semibold text-white">Generate smart workspace record payload</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Core System Automation</h3>
                <p className="mt-4 text-base font-medium leading-relaxed text-zinc-400">
                  Cut complex operational overhead and execute faster by automating tasks from server monitoring down to instant manual escalation response routing.
                </p>
                <p className="mt-3 text-base font-medium leading-relaxed text-zinc-400">
                  Securely link internal applications, integrate contextual intelligence engine rules, map custom field triggers, and set teams free to design solutions.
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#795bf4] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                  Automate custom systems <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. PRE-BUILT APPS OVERVIEW SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#66dba3]">Integrations</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-white">
            3,000+ pre-built connectors. Limitless scaling.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-zinc-400 font-medium">
            Quickly adjust actions to marketplace movements by instantly syncing your software configuration stack. Use our out-of-the-box templates or plug into open custom endpoints seamlessly.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {['OpenAI', 'HubSpot', 'Monday.com', 'NetSuite', 'Salesforce', 'Slack', 'Asana', 'Jira', 'Notion'].map((app) => (
              <div key={app} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-6 py-4 flex items-center gap-3 font-semibold text-sm text-zinc-200">
                <div className="h-6 w-6 rounded bg-[#795bf4]/20 flex items-center justify-center text-xs font-black">d</div>
                {app}
              </div>
            ))}
          </div>

          <button className="mt-10 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
            Browse all app layers
          </button>
        </section>

        {/* 8. COMPLIANCE & TRUST PILLARS */}
        <section className="border-t border-white/[0.04] bg-white/[0.01] py-20">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Built on secure enterprise foundations</h2>
              <p className="mt-4 text-base font-medium text-zinc-400 max-w-2xl leading-relaxed">
                Dock ensures internal operational visibility is preserved while safeguarding high-volume transaction points with strict adherence to built-in GDPR compliance, SOC 2 Type II controls, absolute end-to-end encryption, and robust Single Sign-On (SSO) configurations.
              </p>
              <button className="mt-6 text-sm font-bold text-[#66dba3] hover:underline flex items-center gap-1">
                View platform trust parameters →
              </button>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-start lg:justify-end max-w-md">
              {['AICPA SOC', 'SOC2 Type II', 'GDPR Ready', 'SSO Vault', 'AES Encryption'].map((badge) => (
                <div key={badge} className="rounded-xl border border-[#66dba3]/20 bg-[#66dba3]/5 px-5 py-3 text-xs font-bold tracking-wide text-[#66dba3]">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. STATS & INFRASTRUCTURE ABSTRACT */}
        <section className="border-t border-b border-white/[0.04] py-20 text-center">
          <div className="mx-auto max-w-5xl px-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Global Infrastructure Scale</span>
            <p className="mt-4 text-xl md:text-2xl font-medium tracking-tight text-zinc-300 leading-relaxed">
              Dock represents the standard configuration system trusted by over <strong className="text-white font-bold">400,000 businesses</strong> spanning across <strong className="text-white font-bold">200+ global operating regions</strong>. Formed by engineers to help ventures scale workflows safely.
            </p>
            <button className="mt-8 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
              Learn about our ecosystem
            </button>
          </div>
        </section>

        {/* 10. CUSTOMER SUCCESS CARDS */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#66dba3]">Success Stories</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-white">
            Proven engineering impact in the wild
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-zinc-400 font-medium">
            Cut past market hype and see exactly how leading software teams unlock raw velocity, drop operational overhead, and extract absolute clarity.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {[
              {
                title: 'How Dock allows Perk to unlock core internal engineering efficiencies.',
                tag: 'Operations'
              },
              {
                title: 'How Dock automation helped Celonis lower recurring expense parsing overhead.',
                tag: 'Finance Layer'
              },
              {
                title: 'How Dock saves FranklinCovey $100,000+ while preserving product focus hours.',
                tag: 'Enterprise Scaled'
              }
            ].map((story, idx) => (
              <div key={idx} className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8 flex flex-col justify-between min-h-[260px] hover:border-white/10 transition-colors">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#66dba3] bg-[#66dba3]/10 px-2.5 py-1 rounded-full">
                    {story.tag}
                  </span>
                  <h3 className="mt-6 text-lg font-bold leading-snug text-white">
                    {story.title}
                  </h3>
                </div>
                <button className="mt-6 text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                  Read complete analysis →
                </button>
              </div>
            ))}
          </div>

          <button className="mt-12 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
            Explore all customer metrics
          </button>
        </section>

        {/* 11. ORCHESTRATION & AGENT BLUEPRINTS */}
        <section className="border-t border-white/[0.04] bg-gradient-to-b from-transparent to-white/[0.01] py-24">
          <div className="mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Visual Agent Mesh Graphic */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex items-center justify-center relative min-h-[340px] overflow-hidden">
              <div className="absolute inset-0 bg-[#795bf4]/5 blur-3xl rounded-full" />
              <div className="relative flex items-center justify-center">
                {/* Center node */}
                <div className="h-16 w-16 rounded-full bg-[#795bf4] flex items-center justify-center font-black shadow-xl shadow-[#795bf4]/40 z-10">
                  <img src="/dock-icon-2.png" alt="dock logo" className="h-8 w-8 invert" />
                </div>
                {/* Orbital nodes loop */}
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute h-10 w-10 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center font-bold text-xs"
                    style={{
                      transform: `rotate(${i * 60}deg) translate(100px) rotate(-${i * 60}deg)`
                    }}
                  >
                    ✦
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#66dba3]">Agent Ecosystem</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Scale and orchestrate your autonomous engine layers
              </h2>
              <p className="mt-4 text-base font-medium text-zinc-400 leading-relaxed">
                Build fast, adaptable workspaces with stateful automated actions that your management can actually track, verify, and modify at point-of-sale. Scale operations safely by deploying specialized agents alongside existing human engineering streams.
              </p>
              <button className="mt-6 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                Explore automation parameters
              </button>
            </div>

          </div>
        </section>

        {/* 12. ENTERPRISE ORCHESTRATION PROFILE */}
        <section className="border-t border-white/[0.04] py-24">
          <div className="mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-2 lg:items-center">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Enterprise Ready</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Realize your organization's ultimate transactional velocity
              </h2>
              <p className="mt-4 text-base font-medium text-zinc-400 leading-relaxed">
                Empower distributed departments to safely collaborate, draft complex cross-app logic sequences, and adjust structures at scale. Keep absolute control over compliance boundaries through visual logs, enterprise encryption configurations, and reliable system monitoring.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                  Explore corporate solutions
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  Speak with accounts division
                </button>
              </div>
            </div>

            {/* Visual Profile History Log */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 font-mono text-xs text-zinc-400 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-bold text-zinc-200">SYSTEM AUDIT LOG</span>
                <span className="text-[#66dba3] animate-pulse">● Active Connection</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border-l-2 border-[#795bf4]">
                <p className="text-white font-semibold">[Scenario Modified Succesfully]</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Author identification: Operator ID #4920</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border-l-2 border-zinc-700">
                <p className="font-semibold">[Network Token Exchanged Key]</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Payload route sync matched 48 apps</p>
              </div>
            </div>

          </div>
        </section>

        {/* 13. BOTTOM TRANSITIONAL INTAKE ACTION */}
        <section className="mx-auto max-w-7xl px-6 pb-24 text-center">
          <div className="rounded-[32px] bg-gradient-to-br from-[#1b0d45] to-[#0f0826] border border-[#795bf4]/30 px-8 py-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#66dba3]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
              Realize your company's full potential
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link 
                href="/login?mode=signup"
                className="w-full sm:w-auto rounded-xl bg-[#795bf4] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#6847ef] shadow-lg shadow-[#795bf4]/20"
              >
                Get started free
              </Link>
              <button className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
                Talk to sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 14. FOOTER GRID PATTERN */}
      <footer className="border-t border-white/[0.06] bg-zinc-950 text-xs text-zinc-400 py-16">
        <div className="mx-auto max-w-7xl px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/dock-icon-2.png" alt="dock logo" className="h-7 w-7" />
              <span className="text-lg font-bold tracking-tight text-white">dock</span>
            </div>
            <p className="leading-relaxed text-zinc-500">
              Subscribe to operational updates.
            </p>
            <div className="flex gap-2 max-w-xs">
              <input 
                type="email" 
                placeholder="Work email" 
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#795bf4]" 
              />
              <button className="bg-[#795bf4] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#6847ef]">
                Join
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 leading-tight">
              By submitting, you agree to storage processing parameters detailed inside our privacy protocols.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-4">Product Ecosystem</h4>
            <ul className="space-y-2.5 font-medium">
              <li><button className="hover:text-white transition-colors">Dock Core Flow</button></li>
              <li><button className="hover:text-white transition-colors">Dock Intelligence</button></li>
              <li><button className="hover:text-white transition-colors">Connected Apps Layers</button></li>
              <li><button className="hover:text-white transition-colors">Pricing Profiles</button></li>
              <li><button className="hover:text-white transition-colors">Enterprise Grade</button></li>
              <li><button className="hover:text-white transition-colors">System Operational Status</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-4">Solutions Layout</h4>
            <ul className="space-y-2.5 font-medium">
              <li><button className="hover:text-white transition-colors">System Infrastructure</button></li>
              <li><button className="hover:text-white transition-colors">Marketing Operations</button></li>
              <li><button className="hover:text-white transition-colors">Sales Sequences</button></li>
              <li><button className="hover:text-white transition-colors">Financial Parsing</button></li>
              <li><button className="hover:text-white transition-colors">Human Resource Sync</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-4">Resources Matrix</h4>
            <ul className="space-y-2.5 font-medium">
              <li><button className="hover:text-white transition-colors">Dock Academy Module</button></li>
              <li><button className="hover:text-white transition-colors">Community Knowledge</button></li>
              <li><button className="hover:text-white transition-colors">System Help Center</button></li>
              <li><button className="hover:text-white transition-colors">Developer Engine Hub</button></li>
              <li><button className="hover:text-white transition-colors">Operational Weblog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-4">Corporate Pillar</h4>
            <ul className="space-y-2.5 font-medium">
              <li><button className="hover:text-white transition-colors">About Team Blueprint</button></li>
              <li><button className="hover:text-white transition-colors">Active Engineering Careers</button></li>
              <li><button className="hover:text-white transition-colors">Media Press Center</button></li>
              <li><button className="hover:text-white transition-colors">Security Boundaries</button></li>
              <li><button className="hover:text-white transition-colors">Ethics & Compliance Protocol</button></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-6 mt-16 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 font-medium">
          <p>© 2026 dock Operational Systems, Inc. All rights reserved.</p>
          <div className="flex gap-6 text-[11px]">
            <button className="hover:text-zinc-400">Terms & Conditions</button>
            <button className="hover:text-zinc-400">Privacy & GDPR Mesh</button>
            <button className="hover:text-zinc-400">System Disclaimers</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
