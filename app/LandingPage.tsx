import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CreditCard, MessageSquareMore, Sparkles, Star } from 'lucide-react';

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

const statCards = [
  { label: 'Channels connected', value: '5+' },
  { label: 'Tools in chat', value: '8' },
  { label: 'Setup time', value: '< 15 min' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/dock-icon-2.png" alt="dock icon" className="h-11 w-11" />
            <span className="text-3xl font-semibold leading-none tracking-tight text-zinc-900">dock</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#795bf4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6847ef]"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#66dba3] bg-[#66dba3]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66dba3]">
              Customer conversations, bookings, payments
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-zinc-950 md:text-7xl">
              Run your customer operations from one dock.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 md:text-xl">
              Dock gives small businesses one place to manage chats, automate replies, send invoices, confirm bookings, and keep customers moving.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]"
              >
                Start free
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                View pricing
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-black tracking-tight text-zinc-950">{card.value}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-500">{card.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-[0_20px_60px_rgba(24,24,27,0.08)]">
            <div className="rounded-[24px] border border-zinc-100 bg-zinc-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-zinc-950">Live customer workspace</p>
                  <p className="mt-1 text-xs text-zinc-500">Chats, tools, and payments in one place.</p>
                </div>
                <div className="rounded-full bg-[#66dba3]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#66dba3]">
                  dock
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">Customer wants a booking tomorrow</p>
                      <p className="mt-1 text-xs text-zinc-500">WhatsApp lead detected. Suggested response ready.</p>
                    </div>
                    <div className="rounded-full bg-[#66dba3]/12 px-2.5 py-1 text-[10px] font-semibold text-[#66dba3]">
                      New lead
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-[#66dba3]">
                      <CalendarCheck2 size={16} />
                      <span className="text-sm font-semibold">BookedIt</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-500">Confirm appointment slots and send them into the conversation instantly.</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-[#66dba3]">
                      <CreditCard size={16} />
                      <span className="text-sm font-semibold">PayNow</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-500">Drop a secure payment request without switching apps or losing context.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#66dba3] bg-[#66dba3]/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#66dba3]">Why teams switch</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-700">
                    One inbox, fewer missed leads, faster replies, cleaner bookings, and direct payment actions your team can use from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, body, Icon }) => (
              <div key={title} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#66dba3]/12 text-[#66dba3]">
                  <Icon size={20} strokeWidth={2.25} />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight text-zinc-950">{title}</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="rounded-[32px] border border-zinc-900 bg-zinc-950 px-8 py-10 text-white shadow-[10px_10px_0px_0px_rgba(24,24,27,1)] md:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c7bbff]">Ready to launch</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Start from the landing page, move into pricing, then sign in when you are ready.</h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                  Browse pricing, review the product, and use the login page only when you choose to create an account or sign in.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#795bf4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6847ef]"
                >
                  Sign in
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
