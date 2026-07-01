import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  GitBranch,
  Cog,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 antialiased selection:bg-[#795bf4]/20">
      <div className="bg-[#795bf4] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white">
        Dock Growth Sessions 2026: Join live workshops to launch faster conversations, bookings, and payments.
        <Link href="/login?mode=signup" className="ml-1 inline-flex items-center gap-0.5 font-bold underline hover:text-zinc-100">
          Start now <ArrowRight size={12} strokeWidth={1.5} />
        </Link>
      </div>

      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/dock-icon-2.png" alt="dock icon" className="h-9 w-9" />
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900">dock</span>
            </Link>
            <nav className="hidden items-center gap-8 text-[14px] font-semibold text-zinc-600 lg:flex">
              <Link href="/dashboard" className="flex items-center gap-1 hover:text-zinc-900">
                Platform <ChevronDown size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/tools" className="flex items-center gap-1 hover:text-zinc-900">
                Products <ChevronDown size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/chats" className="flex items-center gap-1 hover:text-zinc-900">
                Solutions <ChevronDown size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/privacy" className="flex items-center gap-1 hover:text-zinc-900">
                Resources <ChevronDown size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/pricing" className="hover:text-zinc-900">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hidden text-[14px] font-semibold text-zinc-600 hover:text-zinc-900 sm:block">
              Contact us
            </Link>
            <Link href="/login" className="text-[14px] font-semibold text-zinc-600 hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#6847ef]"
            >
              Try for free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#795bf4] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 lg:grid-cols-12 lg:items-center lg:py-28">
            <div className="space-y-5 lg:col-span-7">
              <span className="rounded-lg border border-[#66dba3]/30 bg-[#66dba3]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#66dba3]">
                AI-POWERED CUSTOMER OPS PLATFORM
              </span>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">Run your customer operations from one dock.</h1>
              <p className="max-w-xl text-lg font-medium leading-relaxed text-purple-100/90 md:text-xl">
                Unify Dock-Streams, bookings, quotes, invoices, promotions, and follow-ups in one place your team can use from day one.
              </p>

              <div className="pt-4">
                <div className="flex max-w-md flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter work email"
                    className="w-full bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                  <Link
                    href="/login?mode=signup"
                    className="whitespace-nowrap rounded-lg bg-[#66dba3] px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-[#55c490]"
                  >
                    Try for free
                  </Link>
                </div>
                <p className="pl-2 pt-3 text-xs text-purple-200/80">14-day free trial. No credit card required.</p>
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-sm bg-[#66dba3]" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">dock workspace</span>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Active</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="max-w-[85%] rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
                      <p className="mb-0.5 text-[11px] font-bold uppercase tracking-tight text-zinc-400">dock assistant</p>
                      <p className="leading-relaxed text-zinc-700">Your customer asked for tomorrow at 2 PM. Should I confirm and send the deposit link?</p>
                    </div>
                    <div className="ml-auto max-w-[85%] rounded-lg border border-[#795bf4]/20 bg-[#795bf4]/10 p-3.5 text-right">
                      <p className="mb-0.5 text-[11px] font-bold uppercase tracking-tight text-[#795bf4]">Ava</p>
                      <p className="leading-relaxed text-zinc-800">Yes please. Send the quote and payment link so we can lock it in.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">22,000+ GROWING TEAMS TRUST DOCK</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 text-2xl font-black tracking-tight text-zinc-300">
              <span className="cursor-default transition-colors hover:text-zinc-500">GlowSpa</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">Northline</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">Aster</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">BriteCare</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">Luma</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">WaveFit</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">Bloom</span>
              <span className="cursor-default transition-colors hover:text-zinc-500">Nexa</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl">
                AI that gets better with every customer interaction.
              </h2>
              <p className="text-lg font-medium leading-relaxed text-zinc-500">
                Reach up to 80% faster resolution cycles as Dock learns what your team books, sells, and sends every day.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 text-base font-bold text-[#795bf4] transition-colors hover:text-[#6847ef]"
                >
                  Explore the platform
                  <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                  Every message becomes a learning signal
                </span>
                <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700">
                    <GitBranch size={16} strokeWidth={1.5} />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-zinc-900">&quot;Can you invoice and reserve me for Friday?&quot;</p>
                    <p className="mt-1 text-zinc-500">I can draft both now and pass this to your teammate.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#66dba3]">Dock turns signals into actions</span>
                <div className="rounded-lg border border-[#66dba3]/25 bg-[#66dba3]/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Action identified</p>
                  <p className="mt-0.5 text-sm font-bold text-zinc-900">Send invoice + confirm booking</p>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-xs text-zinc-500">
                    <span>Fill workflow gaps automatically</span>
                    <span className="font-bold text-[#795bf4]">Build automation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700">
                        <Cog size={16} strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live customer resolution</span>
                    </div>
                    <span className="rounded-lg bg-[#66dba3]/10 px-2.5 py-0.5 text-xs font-bold text-[#55c490]">Success</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">&quot;Can I pay now and lock this time slot?&quot;</p>
                  <p className="mt-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 text-sm leading-relaxed text-zinc-600">
                    <strong>dock:</strong> Yes. I sent your payment link and held Friday at 2 PM for the next 30 minutes.
                  </p>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-5">
                <h2 className="text-4xl font-black leading-none tracking-tight text-zinc-950 md:text-5xl">
                  Faster replies. Better bookings. More revenue.
                </h2>
                <p className="font-medium text-zinc-500">Billions of customer moments turned into repeatable outcomes.</p>

                <div className="grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">22K+</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Teams</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">830M</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Messages</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-[#795bf4] md:text-4xl">4.8B</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Actions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 p-8 text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:p-10">
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#66dba3]">dock spotlight 2026</span>
              <h3 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Watch how real teams run Dock-Streams, bookings, and payments from one workspace.
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Get practical workflows from operators using Dock daily, from first reply to paid confirmation.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-100"
                >
                  Watch now <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-10 px-6 py-20 lg:py-24">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-zinc-950 md:text-5xl">
              Self-improving operations across Dock-Streams and every customer channel
            </h2>
            <p className="text-lg font-medium text-zinc-500">
              Dock helps teams reason, act, and close loops faster with Streams across WhatsApp, Instagram, Facebook, email, and web.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700">
                    <GitBranch size={22} strokeWidth={1.5} />
                  </div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Build Dock-Streams workflows</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Automate repeatable responses, route urgent messages, and keep every customer stream moving with clear next actions.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/dashboard/chats" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#795bf4] hover:underline">
                  Explore Streams <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700">
                  <Cog size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Equip every teammate</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Give every role a guided copilot for bookings, invoices, promos, and follow-ups without adding operational complexity.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/dashboard/tools" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#795bf4] hover:underline">
                  Explore tools <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-lg border border-zinc-200 bg-[#66dba3] py-28 text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="relative z-10 mx-auto max-w-7xl px-10 py-4 md:px-14 lg:px-20">
            <div className="max-w-3xl space-y-7">
              <span className="rounded-lg border border-zinc-900/20 bg-white/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-900">
                dock workflows
              </span>
              <h2 className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">AI workflows that improve on any channel.</h2>
              <p className="text-lg leading-relaxed text-zinc-800">
                Every reply, booking, and payment teaches Dock what good outcomes look like so your team gets faster over time.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/login?mode=signup" className="rounded-lg bg-zinc-950 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
                  Request a demo
                </Link>
                <Link href="/pricing" className="rounded-lg border border-zinc-900 bg-white/70 px-6 py-3.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-white">
                  Learn more
                </Link>
              </div>
            </div>

            <div className="mt-24 grid gap-6 border-t border-zinc-900/20 px-1 pt-16 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/20 bg-white/50 text-xs font-black text-zinc-900">
                  01
                </div>
                <h4 className="text-sm font-bold text-zinc-950">Built for modern service teams</h4>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Keep AI and human actions in one operational surface for cleaner handoffs and consistent outcomes.
                </p>
              </div>
              <div className="space-y-2">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/20 bg-white/50 text-xs font-black text-zinc-900">
                  02
                </div>
                <h4 className="text-sm font-bold text-zinc-950">Handle volume without chaos</h4>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Auto-resolve repetitive customer requests while preserving the context your team needs for higher-value work.
                </p>
              </div>
              <div className="space-y-2">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/20 bg-white/50 text-xs font-black text-zinc-900">
                  03
                </div>
                <h4 className="text-sm font-bold text-zinc-950">Launch in minutes</h4>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Start with ready-to-run templates and adapt quickly as your process evolves.
                </p>
              </div>
              <div className="space-y-2">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/20 bg-white/50 text-xs font-black text-zinc-900">
                  04
                </div>
                <h4 className="text-sm font-bold text-zinc-950">Scale with confidence</h4>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Keep controls, approvals, and visibility as conversation volume grows.
                </p>
              </div>
              <div className="space-y-2">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/20 bg-white/50 text-xs font-black text-zinc-900">
                  05
                </div>
                <h4 className="text-sm font-bold text-zinc-950">Expand beyond text channels</h4>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Extend your playbooks to voice and callback workflows when your team is ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-100 bg-white py-24">
          <div className="mx-auto max-w-7xl space-y-12 px-6">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                Extend customer operations across your whole organization.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col justify-between space-y-6 rounded-xl border border-zinc-200 bg-zinc-50 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Frontline Teams</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    Give operators fast actions for quotes, bookings, and payment requests so they can close threads while the customer is still engaged.
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <Link href="/login?mode=signup" className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6847ef]">
                    Try for free
                  </Link>
                  <Link href="/dashboard/tools" className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
                    Explore tools
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-6 rounded-xl border border-zinc-200 bg-zinc-50 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Ops & Leadership</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    Track pipeline health, response performance, and revenue conversion from one dashboard without stitching tools together.
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <Link href="/pricing" className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6847ef]">
                    View pricing
                  </Link>
                  <Link href="/dashboard" className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-900 py-24 text-white">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-7">
              <span className="block text-xs font-bold uppercase tracking-widest text-[#66dba3]">RECOGNITION</span>
              <h3 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Dock recognized by operators for practical, high-velocity customer operations.
              </h3>
              <p className="max-w-xl text-sm text-zinc-400">
                Teams choose Dock for clarity, speed, and the ability to run Dock-Streams, bookings, and payments without jumping between tools.
              </p>
              <div className="pt-2">
                <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#66dba3] hover:underline">
                  See how Dock compares <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:col-span-5">
              <div className="flex h-80 w-64 flex-col justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="h-6 w-16 rounded bg-zinc-700" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-zinc-700" />
                  <div className="h-4 w-3/4 rounded bg-zinc-700" />
                </div>
                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-[#795bf4] text-xs font-bold">Dock 2026</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-12 px-6 py-24 text-center lg:py-32">
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">Built for teams at every stage</h2>
            <p className="font-medium text-zinc-500">From local businesses to multi-location brands, Dock scales with your workflow.</p>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:flex-row md:p-12">
            <div className="shrink-0 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">NOVA STUDIO</div>
            <div className="space-y-4">
              <blockquote className="text-xl font-medium leading-relaxed text-zinc-800">
                &quot;We replaced five separate tools with Dock. Replies are faster, bookings are cleaner, and we collect deposits right in chat.&quot;
              </blockquote>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white font-bold text-zinc-700">
                  <Building2 size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-950">Tariq Mensah</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Operations Lead at Nova Studio</p>
                  <Link href="/dashboard" className="mt-1 block text-xs font-bold text-[#795bf4] hover:underline">
                    Read customer story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200/60 bg-zinc-50 py-20">
          <div className="mx-auto max-w-7xl space-y-4 px-6 text-center">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Connect your stack your way.</h2>
            <p className="mx-auto max-w-xl font-medium leading-relaxed text-zinc-500">
              Plug Dock into your favorite channels and workflows, then adapt over time without rebuilding everything.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/tools" className="inline-flex items-center gap-1 text-sm font-bold text-[#795bf4] hover:underline">
                Explore integrations <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto border-t border-zinc-100 px-6 py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-12 lg:py-32">
          <div className="mb-12 space-y-6 lg:col-span-4 lg:mb-0">
            <h3 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Additional resources</h3>
            <p className="text-sm font-medium leading-relaxed text-zinc-500">
              Learn from tactical playbooks, growth examples, and workflow guides built for customer-facing teams.
            </p>
            <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="text-5xl font-black tracking-tight text-[#795bf4]">51.5%</p>
              <p className="text-sm font-bold text-zinc-800">average automation rate</p>
              <p className="text-xs leading-relaxed text-zinc-400">Verified benchmarks from active teams within 30 days of setup.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-2">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">FEATURED</span>
                <h4 className="text-lg font-bold leading-snug text-zinc-950">How high-performing teams run customer ops in one place</h4>
              </div>
              <Link href="/dashboard" className="mt-6 inline-flex items-center gap-0.5 text-xs font-bold text-[#795bf4] hover:underline">
                Learn more <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-2">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#795bf4]">REPORT</span>
                <h4 className="text-lg font-bold leading-snug text-zinc-950">Customer Ops Trends 2026: Faster paths from Streams to payment</h4>
              </div>
              <Link href="/pricing" className="mt-6 inline-flex items-center gap-0.5 text-xs font-bold text-[#795bf4] hover:underline">
                Learn more <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xl font-black text-[#55c490]">
                  6% <span className="text-xs font-normal font-bold text-zinc-400">Increase</span>
                </div>
                <h4 className="text-base font-bold text-zinc-800">Quarter-over-quarter improvements in handled conversations</h4>
              </div>
              <Link href="/dashboard/chats" className="mt-4 inline-flex items-center gap-0.5 text-xs font-bold text-[#795bf4] hover:underline">
                Learn more <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xl font-black text-[#55c490]">
                  2x <span className="text-xs font-normal font-bold text-zinc-400">Growth</span>
                </div>
                <h4 className="text-base font-bold text-zinc-800">Increase in successful booking confirmations from conversation flows</h4>
              </div>
              <Link href="/dashboard/tools" className="mt-4 inline-flex items-center gap-0.5 text-xs font-bold text-[#795bf4] hover:underline">
                Learn more <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-zinc-300 sm:col-span-2">
              <div className="space-y-2">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#795bf4]">GUIDE</span>
                <h4 className="text-lg font-bold text-zinc-950">The Dock playbook for modern customer operations</h4>
              </div>
              <Link href="/dashboard" className="mt-4 inline-flex items-center gap-0.5 text-xs font-bold text-[#795bf4] hover:underline">
                Learn more <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200/60 bg-zinc-50 py-16 text-center">
          <div className="mx-auto max-w-4xl space-y-4 px-6">
            <h3 className="text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">Pricing built to grow with your team</h3>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-500">
              Choose the plan that fits your current volume, then scale as your conversation and conversion goals expand.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/pricing" className="rounded-lg bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]">
                See plans and pricing
              </Link>
              <Link href="/login?mode=signup" className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50">
                Calculate your ROI
              </Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-900 py-24 text-center text-white">
          <div className="relative z-10 mx-auto max-w-4xl space-y-6 px-6">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">Launch your first Dock stream today</h2>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/login?mode=signup" className="rounded-lg bg-[#66dba3] px-8 py-4 text-sm font-bold text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#55c490]">
                Try for free
              </Link>
              <Link href="/pricing" className="rounded-lg border border-zinc-700 bg-zinc-800 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-700">
                Get a demo
              </Link>
            </div>
            <div className="space-y-1 pt-4 text-xs text-zinc-400">
              <p>Need deeper rollout details for your team?</p>
              <Link href="/privacy" className="flex items-center justify-center gap-2 font-bold text-[#66dba3] hover:underline">
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-zinc-500/60 bg-zinc-800 text-zinc-300">
                  <ShieldCheck size={12} strokeWidth={1.5} />
                </span>
                View FAQs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-20 text-xs text-zinc-400">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Products</h5>
            <ul className="space-y-2.5">
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Dock for customer ops</Link></li>
              <li><Link href="/dashboard/chats" className="transition-colors hover:text-white">Dock inbox</Link></li>
              <li><Link href="/dashboard/tools" className="transition-colors hover:text-white">Dock tools</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-white">Integrations</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">System status</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-white">Sign in</Link></li>
              <li><Link href="/login?mode=signup" className="transition-colors hover:text-white">Demo tracks</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Features</h5>
            <ul className="space-y-2.5">
              <li><Link href="/dashboard/chats" className="transition-colors hover:text-white">AI suggestions</Link></li>
              <li><Link href="/dashboard/tools" className="transition-colors hover:text-white">Copilot actions</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Customer timelines</Link></li>
              <li><Link href="/dashboard/chats" className="transition-colors hover:text-white">Dock-Streams messaging</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">Advanced privacy</Link></li>
              <li><Link href="/dashboard/tools" className="transition-colors hover:text-white">Knowledge workflows</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Analytics</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Resources</h5>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="transition-colors hover:text-white">Help center</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">Security</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">API and developers</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Blog insights</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Events and webinars</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Customer stories</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Company</h5>
            <ul className="space-y-2.5">
              <li><Link href="/" className="transition-colors hover:text-white">About Dock</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">Newsroom</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">Careers</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white">Accessibility</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Compare</h5>
            <ul className="space-y-2.5">
              <li><Link href="/pricing" className="transition-colors hover:text-white">Dock vs Intercom</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-white">Dock vs HubSpot</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-white">Dock vs Freshdesk</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Business Size</h5>
            <ul className="space-y-2.5">
              <li><Link href="/pricing" className="transition-colors hover:text-white">Enterprise</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-white">Small business</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-white">Startups</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-zinc-900 px-6 pt-8 text-[11px] text-zinc-500 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 Dock Inc. All rights reserved.</p>
            <p className="text-zinc-600">Designed for modern customer operations teams running chat-to-action workflows.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-zinc-400">
            <Link href="/privacy" className="transition-colors hover:text-white">Terms of Use</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Notice</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Cookie settings</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Trust Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
