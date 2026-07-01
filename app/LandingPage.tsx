import Link from 'next/link';
import { Archivo, Inter, IBM_Plex_Mono } from 'next/font/google';
import { ArrowRight } from 'lucide-react';

const display = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

const manifestRows = [
  { code: '01', channel: 'WhatsApp', note: '42 open threads', status: 'CLEARED' },
  { code: '02', channel: 'Instagram', note: '11 new DMs', status: 'CLEARED' },
  { code: '03', channel: 'Facebook', note: '3 awaiting reply', status: 'IN TRANSIT' },
  { code: '04', channel: 'Email', note: '9 quotes sent', status: 'CLEARED' },
];

const channels = ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Email', 'SMS'];

const manifestItems = [
  {
    code: '01',
    title: 'Unified inbox',
    body: 'WhatsApp, Instagram, Facebook, TikTok, and email arrive on one thread instead of six separate tabs.',
  },
  {
    code: '02',
    title: 'In-chat tools',
    body: 'Raise an invoice, quote a job, or send a payment link without ever leaving the conversation.',
  },
  {
    code: '03',
    title: 'Bookings & payments',
    body: 'Hold the slot, send the reminder, take the deposit. Three steps your team already does, now in one place.',
  },
  {
    code: '04',
    title: 'Review growth',
    body: 'Every closed job rolls into a review follow-up, so good work keeps compounding into new leads.',
  },
];

const ledgerStats = [
  { value: '5+', label: 'channels on one thread' },
  { value: '8', label: 'tools without leaving chat' },
  { value: '<15', label: 'minutes to set up' },
];

export default function LandingPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#F7F7F4] text-[#14171B]`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#E2E1DB] bg-[#F7F7F4]/95 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 bg-[#14171B]" />
              <span className="absolute right-0 top-0 h-3.5 w-3.5 bg-[#FF5B1F]" />
            </span>
            <span
              className="text-xl font-[800] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              dock
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/pricing" className="text-sm font-medium text-[#4B4E54] hover:text-[#14171B]">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-[#4B4E54] hover:text-[#14171B]">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-[3px] bg-[#14171B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF5B1F]"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 lg:pt-24">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4B4E54]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="h-2 w-2 bg-[#FF5B1F]" />
                Berth 04 &mdash; Customer operations
              </div>

              <h1
                className="mt-6 max-w-xl text-[3.1rem] font-[900] leading-[0.98] tracking-tight text-[#14171B] sm:text-[3.8rem]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Run your customer operations from one <span className="text-[#FF5B1F]">dock</span>.
              </h1>

              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#4B4E54]">
                Every WhatsApp message, DM, booking, and invoice lands on one manifest &mdash;
                logged, actioned, and cleared without switching tabs.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#14171B] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FF5B1F]"
                >
                  Start free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-[3px] border border-[#14171B]/20 px-6 py-3.5 text-sm font-bold text-[#14171B] transition-colors hover:border-[#14171B]"
                >
                  View pricing
                </Link>
              </div>

              <div
                className="mt-12 flex divide-x divide-[#E2E1DB] border-t border-[#E2E1DB] pt-6"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {ledgerStats.map((stat) => (
                  <div key={stat.label} className="flex-1 pr-6 first:pl-0 [&:not(:first-child)]:pl-6">
                    <p className="text-2xl font-semibold text-[#14171B]">{stat.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#4B4E54]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manifest ticket */}
            <div className="relative rounded-[6px] border border-[#14171B]/15 bg-white shadow-[0_1px_0_rgba(20,23,27,0.04)]">
              <div className="h-1.5 w-full rounded-t-[5px] bg-[#FF5B1F]" />
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-dashed border-[#E2E1DB] pb-4">
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8D93]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Manifest No. 0417
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#14171B]">Today&rsquo;s workspace</p>
                  </div>
                  <span
                    className="rounded-[3px] border border-[#14171B]/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#14171B]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Dock
                  </span>
                </div>

                <div className="mt-4 space-y-0">
                  {manifestRows.map((row, i) => (
                    <div
                      key={row.channel}
                      className={`flex items-center justify-between gap-3 py-3 ${
                        i !== manifestRows.length - 1 ? 'border-b border-[#EFEEE9]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs text-[#8A8D93]"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {row.code}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#14171B]">{row.channel}</p>
                          <p className="text-xs text-[#8A8D93]">{row.note}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-[3px] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                          row.status === 'CLEARED'
                            ? 'bg-[#1F8A5F]/10 text-[#1F8A5F]'
                            : 'bg-[#FF5B1F]/10 text-[#FF5B1F]'
                        }`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#E2E1DB] pt-4">
                  <p className="text-xs text-[#8A8D93]">128 conversations cleared today</p>
                  <span
                    className="flex -rotate-6 items-center gap-1 rounded-full border border-dashed border-[#1F8A5F] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F8A5F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    &#10003; Cleared
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Channel ticker */}
          <div
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[#E2E1DB] py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8D93]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="text-[#14171B]">On the manifest:</span>
            {channels.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </section>

        {/* ───────────────────────── Feature manifest ───────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2
              className="text-3xl font-[800] tracking-tight text-[#14171B] sm:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What&rsquo;s on the manifest
            </h2>
            <p
              className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[#8A8D93] sm:block"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              4 items &middot; ready to load
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
            {manifestItems.map((item) => (
              <div key={item.code} className="border-t border-[#E2E1DB] py-8">
                <span
                  className="text-xs font-semibold text-[#8A8D93]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.code}
                </span>
                <h3
                  className="mt-3 text-xl font-[800] tracking-tight text-[#14171B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#4B4E54]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────────────────── Dark ledger band ───────────────────────── */}
        <section className="bg-[#0D1420] py-20 text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF8A5C]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Log entry
              </p>
              <h2
                className="mt-4 text-3xl font-[800] leading-tight tracking-tight sm:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Why teams move their operations onto one dock.
              </h2>
            </div>
            <p className="text-lg font-medium leading-relaxed text-[#B9BDC6]">
              One inbox instead of six. Fewer leads lost between apps. Replies that go out in
              minutes instead of hours. Bookings that hold, invoices that get paid, and a team
              that can actually keep up &mdash; from the first week onward.
            </p>
          </div>
        </section>

        {/* ───────────────────────── Final CTA ───────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-8 rounded-[6px] border border-[#14171B] bg-[#14171B] px-8 py-12 text-white sm:flex-row sm:items-end sm:justify-between md:px-12">
            <div className="max-w-xl">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF8A5C]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Departure
              </p>
              <h2
                className="mt-3 text-3xl font-[800] tracking-tight sm:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Clear your inbox. Keep the conversation.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#B9BDC6]">
                Start free today, check pricing when you&rsquo;re ready to grow, or sign back in
                to pick up where your team left off.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-[3px] border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white"
              >
                View pricing
              </Link>
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#FF5B1F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF7A45]"
              >
                Start free
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
