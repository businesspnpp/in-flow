import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  CreditCard,
  Inbox,
  MessagesSquare,
  Receipt,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';

const trustedLogos = ['Nomvula & Co', 'Kasi Fresh', 'Vuma Fitness', 'Thuto Learning', 'Mzansi Motors', 'Bloom Studio'];

const introCards = [
  {
    title: 'One inbox for every channel',
    body: 'WhatsApp, Instagram, and Facebook conversations land in a single queue, so nothing sits unread in five different apps.',
  },
  {
    title: 'Built for how you actually work',
    body: 'Reply, invoice, and confirm bookings without switching tabs. Set it up once, in minutes, not weeks.',
  },
  {
    title: 'Grows with your team',
    body: 'Assign chats, track response times, and keep every customer moving through a repeatable flow as headcount grows.',
  },
];

const channelTabs = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    dot: '#25d366',
    heading: 'Never miss a WhatsApp lead again',
    body: 'Route incoming messages to the right person, send templated replies, and trigger invoices or booking links straight from the thread.',
    cta: 'Connect WhatsApp',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    dot: '#d6249f',
    heading: 'Turn DMs into paying customers',
    body: 'Catch comments and story replies before they go cold. Every DM shows up next to your WhatsApp and Facebook threads.',
    cta: 'Connect Instagram',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    dot: '#1877f2',
    heading: 'Keep Page messages in the same queue',
    body: 'Facebook Business conversations flow into inFlow automatically, tagged by channel so your team knows where a reply is headed.',
    cta: 'Connect Facebook',
  },
];

const featureCards = [
  {
    title: 'Unified inbox',
    body: 'Every WhatsApp, Instagram, and Facebook conversation in one queue, sorted by channel and urgency.',
    Icon: Inbox,
  },
  {
    title: 'In-chat tools',
    body: 'Raise an invoice, send a quote, or share a payment link without leaving the conversation.',
    Icon: Receipt,
  },
  {
    title: 'Bookings, handled',
    body: 'Confirm appointments and send reminders automatically so slots stop slipping through the cracks.',
    Icon: CalendarCheck2,
  },
  {
    title: 'Fast, focused replies',
    body: 'Saved responses and assignment rules mean the right person answers, first time.',
    Icon: MessagesSquare,
  },
];

const stats = [
  { value: '3', label: 'Channels, one queue' },
  { value: '< 15 min', label: 'To get connected' },
  { value: '0', label: 'Missed leads on your watch' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d10] text-[#f5f5f7] antialiased">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0d0d10]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#f5a623] text-sm font-black text-[#0d0d10]">
              iF
            </span>
            <span className="text-[19px] font-semibold tracking-tight">inFlow</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            <Link href="/product" className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white">
              Product
            </Link>
            <Link href="/channels" className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white">
              Channels
            </Link>
            <Link href="/pricing" className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white">
              Sign in
            </Link>
          </nav>

          <Link
            href="/login?mode=signup"
            className="rounded-[9px] bg-[#f5a623] px-4 py-2 text-[13px] font-semibold text-[#0d0d10] transition-colors hover:bg-[#ffb843]"
          >
            Start free
          </Link>
        </div>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
              Built for South African small business
            </div>

            <h1 className="mt-6 max-w-xl text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[58px]">
              Every customer chat.
              <br />
              One dashboard.
              <br />
              <span className="text-[#f5a623]">Zero missed leads.</span>
            </h1>

            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/55">
              inFlow brings WhatsApp, Instagram, and Facebook into a single workspace — so you can reply, invoice, and
              book appointments without ever opening five different apps.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#f5a623] px-6 py-3.5 text-[14px] font-semibold text-[#0d0d10] transition-colors hover:bg-[#ffb843]"
              >
                Start free
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-[10px] border border-white/12 px-6 py-3.5 text-[14px] font-semibold text-white/85 transition-colors hover:bg-white/[0.05]"
              >
                See pricing
              </Link>
            </div>

            <p className="mt-5 text-[12.5px] text-white/35">No credit card required · Cancel anytime</p>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/[0.08] pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[22px] font-semibold tracking-tight text-white">{s.value}</p>
                  <p className="mt-1 text-[12px] leading-snug text-white/45">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signature element: live conversation / tool card */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[#f5a623]/[0.06] blur-2xl" />
            <div className="rounded-[26px] border border-white/10 bg-[#131316] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#25d366]" />
                  <p className="text-[12.5px] font-semibold text-white/80">Unified inbox</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#25d366' }} />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#d6249f' }} />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#1877f2' }} />
                </div>
              </div>

              <div className="mt-4 rounded-[16px] border border-white/[0.08] bg-[#0d0d10] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: '#25d366' }}
                    >
                      NM
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-white">Nomvula M.</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/50">
                        Hi! Do you have a slot open tomorrow afternoon?
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f5a623]/12 px-2.5 py-1 text-[10px] font-semibold text-[#f5a623]">
                    New lead
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] border border-white/[0.08] bg-[#0d0d10] p-3.5">
                  <div className="flex items-center gap-2 text-[#f5a623]">
                    <CalendarCheck2 size={15} />
                    <span className="text-[12.5px] font-semibold text-white">Confirm booking</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-white/40">
                    Send tomorrow's 2 PM slot in one tap.
                  </p>
                </div>
                <div className="rounded-[16px] border border-white/[0.08] bg-[#0d0d10] p-3.5">
                  <div className="flex items-center gap-2 text-[#f5a623]">
                    <CreditCard size={15} />
                    <span className="text-[12.5px] font-semibold text-white">Send payment link</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-white/40">
                    Get paid before the appointment starts.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-[16px] border border-[#f5a623]/25 bg-[#f5a623]/[0.06] p-4">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#f5a623]">Why teams switch</p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                  One inbox, faster replies, and every tool your team needs — without leaving the conversation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Trust logos ---------- */}
        <section className="border-y border-white/[0.06] bg-white/[0.015] py-9">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
            {trustedLogos.map((name) => (
              <span key={name} className="text-[13.5px] font-semibold tracking-tight text-white/25">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ---------- Intro cards ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Why inFlow</p>
            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.01em] text-white md:text-[38px]">
              The operations dashboard built for how small teams actually sell
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {introCards.map((card) => (
              <div key={card.title} className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-7">
                <h3 className="text-[16px] font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Channel tabs ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Channels</p>
            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.01em] text-white md:text-[38px]">
              Meet customers where they already message you
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {channelTabs.map((tab) => (
              <div key={tab.key} className="flex flex-col rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-7">
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${tab.dot}1f` }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tab.dot }} />
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">{tab.label}</p>
                <h3 className="mt-2 text-[17px] font-semibold leading-snug text-white">{tab.heading}</h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-white/50">{tab.body}</p>
                <button className="mt-6 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#f5a623]">
                  {tab.cta}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Feature grid ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, body, Icon }) => (
              <div key={title} className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#f5a623]/12 text-[#f5a623]">
                  <Icon size={19} strokeWidth={2.25} />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-white">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Product screenshot placeholder ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">See it in action</p>
              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.01em] text-white md:text-[34px]">
                A dashboard your whole team will actually use
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/50">
                Assign conversations, track who replied and when, and see every booking and payment in one place —
                built to stay fast even on a busy Monday morning.
              </p>
              <ul className="mt-6 space-y-3">
                {['Real-time channel status', 'Per-agent response times', 'Exportable payment history'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-white/70">
                    <Check size={15} className="text-[#f5a623]" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Replace this block with an <img src="/screenshots/dashboard.png" /> of the real product */}
            <div className="aspect-[4/3] rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-2">
              <div className="flex h-full w-full items-center justify-center rounded-[16px] border border-dashed border-white/15 text-[13px] text-white/30">
                Product screenshot goes here
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Security ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.02] p-10 md:p-14">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Trust &amp; security</p>
                <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.01em] text-white md:text-[30px]">
                  Your customers' data, handled properly
                </h2>
                <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/50">
                  Every channel connection runs through verified business APIs, with encrypted storage and access
                  controls built in from day one.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-5 py-4">
                <ShieldCheck size={22} className="text-[#f5a623]" />
                <div>
                  <p className="text-[13px] font-semibold text-white">POPIA-aligned</p>
                  <p className="text-[11.5px] text-white/40">Data handling built for SA compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Testimonial strip ---------- */}
        <section className="border-y border-white/[0.06] bg-white/[0.015] py-20">
          <div className="mx-auto w-full max-w-7xl px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">What teams say</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { name: 'Thabo K.', role: 'Owner, Kasi Fresh', quote: 'We stopped losing WhatsApp orders overnight.' },
                { name: 'Zanele P.', role: 'Front desk, Vuma Fitness', quote: 'Booking confirmations run themselves now.' },
                { name: 'Sipho D.', role: 'Founder, Bloom Studio', quote: 'One inbox changed how fast we respond.' },
              ].map((t) => (
                <div key={t.name} className="rounded-[20px] border border-white/[0.08] bg-[#131316] p-6">
                  <div className="flex gap-0.5 text-[#f5a623]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="#f5a623" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/75">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-[12.5px] font-semibold text-white/90">{t.name}</p>
                  <p className="text-[11.5px] text-white/40">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="rounded-[28px] border border-[#f5a623]/30 bg-[#131316] px-8 py-12 shadow-[10px_10px_0px_0px_rgba(245,166,35,0.15)] md:px-14 md:py-16">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">
                  <Zap size={13} />
                  Ready when you are
                </p>
                <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.01em] text-white md:text-[36px]">
                  Set up your first channel in under fifteen minutes
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/50">
                  No credit card, no onboarding call required. Connect WhatsApp, Instagram, or Facebook and see every
                  conversation land in one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-[10px] border border-white/15 px-6 py-3.5 text-[14px] font-semibold text-white/85 transition-colors hover:bg-white/[0.05]"
                >
                  See pricing
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#f5a623] px-6 py-3.5 text-[14px] font-semibold text-[#0d0d10] transition-colors hover:bg-[#ffb843]"
                >
                  Start free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/[0.06] py-14">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f5a623] text-[13px] font-black text-[#0d0d10]">
                  iF
                </span>
                <span className="text-[16px] font-semibold tracking-tight">inFlow</span>
              </Link>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/35">
                Customer conversations, bookings, and payments — in one dashboard, built for South African small
                business.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Product</p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-white/55">
                  <li><Link href="/product" className="hover:text-white">Overview</Link></li>
                  <li><Link href="/channels" className="hover:text-white">Channels</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Company</p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-white/55">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Legal</p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-white/55">
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/[0.06] pt-6">
            <p className="text-[12px] text-white/30">© 2026 Xanzi Tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
