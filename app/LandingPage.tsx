import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Check, Star, Globe, Shield, Lock, Cpu, Menu, X } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-[#795bf4]/20">
      
      {/* SECTION 1: TOP NOTIFICATION BANNER */}
      <div className="w-full bg-[#1b0d45] text-white py-2.5 px-4 text-center text-xs font-medium relative z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 pr-8">
          <span>Make Waves '26 tickets are live. Join us in Prague, Oct 19-20, for two days of AI, automation, and what's next.</span>
          <Link href="/pricing" className="text-[#66dba3] hover:underline font-semibold whitespace-nowrap">
            Save with early-bird pricing!
          </Link>
        </div>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm">×</button>
      </div>

      {/* SECTION 2: NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#0f0826] text-white border-b border-white/[0.08]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dock-icon-2.png" alt="dock logo" className="h-8 w-8" />
              <span className="text-2xl font-black tracking-tight text-white">dock</span>
            </Link>
            
            <nav className="hidden items-center gap-6 xl:flex text-sm font-medium text-zinc-300">
              <button className="flex items-center gap-1 hover:text-white transition-colors">What is Dock <ChevronDown size={14} className="text-zinc-500" /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Dock + AI <ChevronDown size={14} className="text-zinc-500" /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Solutions <ChevronDown size={14} className="text-zinc-500" /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Resources <ChevronDown size={14} className="text-zinc-500" /></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Partners <ChevronDown size={14} className="text-zinc-500" /></button>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:inline-block text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Talk to sales</button>
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Sign in</Link>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-[#795bf4] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#6847ef]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 3: DARK HERO BLOCK */}
      <section className="bg-[#0f0826] text-white pt-20 pb-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12 lg:items-center relative z-10">
          
          <div className="lg:col-span-7">
            <h1 className="text-5xl font-black tracking-tight leading-[1.05] sm:text-6xl xl:text-7xl">
              The visual AI automation <br />platform
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-zinc-400 font-medium leading-relaxed">
              Connect any app, data source, or AI model. Build and manage automations and AI agents—visually, in code, or with a prompt.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/login?mode=signup"
                className="rounded-full bg-[#795bf4] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#6847ef]"
              >
                Get started free
              </Link>
              <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
                Talk to sales
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-[#66dba3]" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-[#66dba3]" /> No time limit on Free plan</span>
            </div>
          </div>

          {/* Isometric Flow Chart Rendering Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="w-72 h-72 rounded-3xl bg-gradient-to-tr from-[#795bf4]/20 to-[#66dba3]/20 border border-white/10 rotate-[15deg] transform skew-x-[-10deg] p-6 relative shadow-2xl flex flex-col justify-between">
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-[#795bf4]" />
                <div className="h-6 w-6 rounded-full bg-[#66dba3]" />
              </div>
              <div className="h-32 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center animate-pulse">🤖</div>
              </div>
              <div className="w-full h-4 bg-white/10 rounded-full" />
            </div>
          </div>

        </div>

        {/* Brand Logos Row Block */}
        <div className="mx-auto max-w-7xl px-6 mt-24">
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-40 grayscale contrast-200 text-sm font-black tracking-widest text-zinc-500">
            <span>BAMBOO</span>
            <span>&gt; BNY</span>
            <span>BOLT</span>
            <span>FINN</span>
            <span>PERK</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: RATINGS BLOCK */}
      <section className="bg-white border-b border-zinc-200 py-12">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { name: 'Capterra', score: '4.8' },
            { name: 'G2', score: '4.7' },
            { name: 'Getapp', score: '4.8' },
            { name: 'Gartner', score: '4.6' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">{item.name}</span>
              <div className="flex items-center gap-1 text-zinc-900 font-bold text-base">
                <Star size={16} className="fill-[#795bf4] text-[#795bf4]" />
                <span>{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: GRID CAPABILITIES */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center bg-white">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          The platform to build and manage all <br />your AI agents and automations
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
          
          <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#795bf4] flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">Adopt AI across your business.</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
              Deploy AI agents and workflows using 3,000+ integrations to completely automate operational task pipelines.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#66dba3] flex items-center justify-center text-zinc-900 font-bold text-sm">
              ✦
            </div>
            <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">From idea to live automation. Fast.</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
              Build by prompt, drag-and-drop workflow visual interfaces or via direct customized MCP development hooks.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-sm">
              ■
            </div>
            <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">Scale without losing visibility.</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">
              See everything in one single visual landscape. Fully robust, enterprise ready, and traceable line-by-line.
            </p>
          </div>

        </div>

        <button className="mt-12 rounded-full bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
          Explore more
        </button>
      </section>

      {/* SECTION 6: SOLUTIONS TAB LAYOUT */}
      <section className="bg-zinc-50 border-t border-b border-zinc-200 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#795bf4]">Solutions</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Adapt at speed with visual-first <br />automation and AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-zinc-500 font-medium">
            Dock drives efficiencies, solves performance friction, and speeds systematic innovation by breaking down data silos across your business units.
          </p>

          {/* HORIZONTAL TAB WRAPPER */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-zinc-200 pb-4">
            {['IT', 'Operations', 'Marketing', 'Sales', 'Finance', 'CX', 'People'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${idx === 0 ? 'bg-white text-[#795bf4] border border-[#795bf4]' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TWO-COLUMN TAB CONTENT PANEL */}
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-center text-left">
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <div className="w-full h-48 bg-zinc-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#795bf4]/10 to-transparent" />
                <span className="text-4xl">💻</span>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">G</div>
                <div className="h-2 w-12 bg-zinc-200 rounded" />
                <div className="h-10 w-10 rounded-full bg-[#795bf4]/20 flex items-center justify-center text-sm">🔄</div>
              </div>
            </div>

            <div className="lg:col-span-7 pl-0 lg:pl-8">
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">IT automation</h3>
              <p className="mt-4 text-sm md:text-base font-medium leading-relaxed text-zinc-500">
                Cut complexity and move faster by automating everything from system resource monitoring down to active event incident response. Connect internal legacy tooling, integrate active AI models, cut deep manual tasks, and free your engineering team to focus entirely on product innovation.
              </p>
              <button className="mt-6 rounded-full bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                Automate IT
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: APPLICATIONS SLIDER SIMULATOR */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center bg-white">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#795bf4]">Applications</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
          3,000+ pre-built apps. Limitless integration.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-500 font-medium">
          Quickly adapt to new market demands by connecting your entire tech stack. Use our massive library of pre-built apps for instant workflows, and our flexible platform to integrate any custom system.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
          {['OpenAI (ChatGPT)', 'HubSpot CRM', 'monday.com', 'NetSuite', 'Salesforce', 'Slack'].map((app) => (
            <div key={app} className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-bold text-zinc-700 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#795bf4]" />
              {app}
            </div>
          ))}
        </div>

        <button className="mt-10 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-50">
          Browse apps
        </button>
      </section>

      {/* SECTION 8: TRUST PILLARS */}
      <section className="bg-zinc-50 border-t border-b border-zinc-200 py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#795bf4]">Security</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">Built on strong foundations</h2>
            <p className="mt-4 text-sm md:text-base font-medium text-zinc-500 leading-relaxed">
              Dock helps you to keep your infrastructure data secure with native, built-in GDPR compliance parameters, SOC 3 assertions, SOC 2 Type II strict alignments, advanced rest encryption protocols, and Enterprise Single Sign-On (SSO).
            </p>
            <button className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
              Security details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['SOC 2 Type II', 'GDPR Compliant', 'SSO Vault Access', 'Data Encryption'].map((badge) => (
              <div key={badge} className="bg-white border border-zinc-200 rounded-2xl p-5 text-center font-bold text-zinc-800 text-sm shadow-sm flex flex-col items-center justify-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#66dba3]/20 text-zinc-900 flex items-center justify-center">✓</div>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: MISSION BLOCK */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center bg-white">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">About Us</h2>
        <p className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 leading-relaxed">
          Dock is the leading operational automation architecture, trusted by over <span className="text-[#795bf4]">400,000 organizations</span> across 200+ countries. Founded with vision and backed globally, we represent an expert software group helping businesses from startups to enterprises map scaling flows natively.
        </p>
        <button className="mt-8 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
          Learn about Dock
        </button>
      </section>

      {/* SECTION 10: SUCCESS STORIES BLOCK (DARK DEEP PURPLE PANEL) */}
      <section className="bg-[#0f0826] text-white py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#66dba3]">Success Stories</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-white">
            Automation success stories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 font-medium">
            Go beyond the system hype and see how leading companies are achieving real production results with automated agents. Discover practical engineering insights.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {[
              { title: 'How Dock helps Perk unlock deep internal production efficiencies.', date: 'Mar 12, 2026' },
              { title: 'How Dock Agents help Celonis lower recurring operational audit overhead.', date: 'Nov 25, 2025' },
              { title: 'How Dock helps FranklinCovey save $100,000s and free up hundreds of internal hours.', date: 'Oct 30, 2025' }
            ].map((story, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between min-h-[280px]">
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{story.date}</span>
                  <h3 className="mt-4 text-lg font-bold text-white leading-snug">{story.title}</h3>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#66dba3] font-bold">
                  <span>Case Study</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-12 rounded-full bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
            Explore success stories
          </button>
        </div>
      </section>

      {/* SECTION 11: TWO-COLUMN SYSTEM STACK DETAIL BLOCK */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-16 lg:grid-cols-2 lg:items-center bg-white">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#795bf4]">AI and Automation</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Scale and orchestrate your AI automations
          </h2>
          <p className="mt-4 text-sm md:text-base font-medium text-zinc-500 leading-relaxed">
            Build faster, more adaptable production lines with agentic tracking frameworks you can map visually and optimize. Scale with deep workspace processing units functioning seamlessly alongside human personnel streams. Maximize reliability with over 400 specialized system logic integrations.
          </p>
          <button className="mt-6 rounded-full bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
            Explore AI automation
          </button>
        </div>
        
        {/* Abstract System Web Mockup */}
        <div className="border border-zinc-200 bg-zinc-50 rounded-3xl p-8 flex items-center justify-center min-h-[300px] shadow-inner relative">
          <div className="h-16 w-16 rounded-full bg-[#795bf4] flex items-center justify-center font-black text-white shadow-xl">d</div>
          <div className="absolute top-12 left-12 h-10 w-10 rounded-full bg-zinc-200 border border-zinc-300" />
          <div className="absolute bottom-12 right-12 h-12 w-12 rounded-full bg-zinc-200 border border-zinc-300" />
        </div>
      </section>

      {/* SECTION 12: SECOND TWO-COLUMN DETAIL BLOCK */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-24">
        <div className="mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* Layout Audit Logger UI Rendering Screen */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 font-mono text-xs text-zinc-600 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="font-bold text-zinc-900">WORKSPACE_HISTORY</span>
              <span className="text-xs text-zinc-400">v2.4.1</span>
            </div>
            <p className="text-zinc-500">• Scenario sequence compilation verified by root</p>
            <p className="text-zinc-500">• Variable parsing completed: 0 warning faults</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#795bf4]">Enterprise</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Automation and AI impact for enterprise
            </h2>
            <p className="mt-4 text-sm md:text-base font-medium text-zinc-500 leading-relaxed">
              Empower enterprise cross-functional teams to securely build, deploy, verify, and scale data rules. Retain architectural ownership with structured flow monitoring dashboards, strict corporate isolation mechanics, audit compliance standards, and continuous technical support loops.
            </p>
            <button className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
              Explore enterprise solutions
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 13: BOTTOM ACTION CONVERSION BLOCK (DARK DEEP PURPLE BACKGROUND) */}
      <section className="bg-[#0f0826] text-white py-20 border-b border-white/5 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Realize your business's full potential
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              Talk to sales
            </button>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-[#795bf4] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#6847ef]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 14: FULL EXPANDED INDEX FOOTER BLOCK */}
      <footer className="bg-[#0f0826] text-white pt-20 pb-12 text-xs font-medium border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 sm:grid-cols-2 md:grid-cols-6">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/dock-icon-2.png" alt="dock logo" className="h-6 w-6" />
              <span className="text-xl font-black tracking-tight text-white">dock</span>
            </div>
            <p className="text-zinc-400 font-normal leading-relaxed">
              Subscribe to news updates. Keep up with custom integration releases.
            </p>
            <div className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Work email" 
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#795bf4]" 
              />
              <button className="bg-[#795bf4] text-white rounded-full px-4 py-2 font-bold hover:bg-[#6847ef]">
                SUBSCRIBE
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2 text-zinc-300">
              <li><button className="hover:text-white transition-colors">Dock AI</button></li>
              <li><button className="hover:text-white transition-colors">Dock AI Agents</button></li>
              <li><button className="hover:text-white transition-colors">Apps Ecosystem</button></li>
              <li><button className="hover:text-white transition-colors">Dock Grid</button></li>
              <li><button className="hover:text-white transition-colors">Pricing Layout</button></li>
              <li><button className="hover:text-white transition-colors">Get Demo</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-[10px]">Solutions</h4>
            <ul className="space-y-2 text-zinc-300">
              <li><button className="hover:text-white transition-colors">How-to Guides</button></li>
              <li><button className="hover:text-white transition-colors">Success Stories</button></li>
              <li><button className="hover:text-white transition-colors">Flow Templates</button></li>
              <li><button className="hover:text-white transition-colors">Partner Directory</button></li>
              <li><button className="hover:text-white transition-colors">Idea Exchange</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-[10px]">Resources</h4>
            <ul className="space-y-2 text-zinc-300">
              <li><button className="hover:text-white transition-colors">Dock Academy</button></li>
              <li><button className="hover:text-white transition-colors">Dock Community</button></li>
              <li><button className="hover:text-white transition-colors">Help Center</button></li>
              <li><button className="hover:text-white transition-colors">Developers Hub</button></li>
              <li><button className="hover:text-white transition-colors">System Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-2 text-zinc-300">
              <li><button className="hover:text-white transition-colors">About Team</button></li>
              <li><button className="hover:text-white transition-colors">Active Careers</button></li>
              <li><button className="hover:text-white transition-colors">Contact US</button></li>
              <li><button className="hover:text-white transition-colors">Press Modules</button></li>
              <li><button className="hover:text-white transition-colors">Security Bounds</button></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© 2026 Celonis, Inc. All rights reserved to Dock Operational Systems.</p>
          <div className="flex gap-6 font-normal">
            <button className="hover:text-zinc-300">Terms & conditions</button>
            <button className="hover:text-zinc-300">Privacy and GDPR</button>
            <button className="hover:text-zinc-300">Disclaimer</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
