'use client';

import { useMemo, useState } from 'react';

const bookingKpis = [
  { label: 'Bookings today', value: '18', note: '4 pending confirmation', tone: 'emerald' },
  { label: 'Orders in progress', value: '27', note: '6 awaiting payment', tone: 'violet' },
  { label: 'On-time completion', value: '93%', note: 'Last 30 days', tone: 'zinc' },
  { label: 'Average ticket', value: 'R1,340', note: 'Across paid orders', tone: 'emerald' },
] as const;

type TabKey = 'bookings' | 'orders' | 'overview';

const bookings = [
  {
    customer: 'Thabo Nkosi',
    service: 'Haircut + treatment',
    channel: 'WhatsApp',
    time: '10:30',
    status: 'Confirmed',
    duration: '45 min',
  },
  {
    customer: 'Amina Diop',
    service: 'Consultation call',
    channel: 'Instagram',
    time: '11:15',
    status: 'Pending',
    duration: '30 min',
  },
  {
    customer: 'Sipho Mthembu',
    service: 'Weekly booking',
    channel: 'WhatsApp',
    time: '13:00',
    status: 'Confirmed',
    duration: '60 min',
  },
  {
    customer: 'Lindiwe Dlamini',
    service: 'Product pickup',
    channel: 'Email',
    time: '15:45',
    status: 'Reschedule',
    duration: '15 min',
  },
  {
    customer: 'Dumi Ndlovu',
    service: 'Quick follow-up',
    channel: 'WhatsApp',
    time: '16:30',
    status: 'Confirmed',
    duration: '20 min',
  },
];

const orders = [
  {
    id: 'ORD-2041',
    customer: 'Marcus Vance',
    amount: 'R8,750',
    stage: 'Packed',
    eta: 'Today 17:00',
    payment: 'Paid',
  },
  {
    id: 'ORD-2042',
    customer: 'Zanele Khumalo',
    amount: 'R12,500',
    stage: 'Awaiting payment',
    eta: 'Waiting',
    payment: 'Pending',
  },
  {
    id: 'ORD-2043',
    customer: 'Chloe Jenkins',
    amount: 'R1,180',
    stage: 'Out for delivery',
    eta: 'Today 16:30',
    payment: 'Paid',
  },
  {
    id: 'ORD-2044',
    customer: 'James Okafor',
    amount: 'R3,400',
    stage: 'Processing',
    eta: 'Tomorrow 10:00',
    payment: 'Paid',
  },
  {
    id: 'ORD-2045',
    customer: 'Amina Diop',
    amount: 'R980',
    stage: 'Awaiting payment',
    eta: 'Today 15:15',
    payment: 'Pending',
  },
];

const timelineBlocks = [
  { time: '09:00', label: 'Prep window', detail: 'Quick service setup and reminders' },
  { time: '10:30', label: 'Booked session', detail: 'Thabo Nkosi - confirmed' },
  { time: '11:15', label: 'Pending call', detail: 'Amina Diop - awaiting approval' },
  { time: '13:00', label: 'Midday booking', detail: 'Sipho Mthembu - confirmed' },
  { time: '15:45', label: 'Pickup / handoff', detail: 'Lindiwe Dlamini - reschedule needed' },
];

function statusClass(status: string) {
  if (status === 'Confirmed') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (status === 'Pending') return 'bg-[#795bf4]/10 text-[#5a3fe0] border-[#795bf4]/25';
  if (status === 'Reschedule') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function stageClass(stage: string) {
  if (stage === 'Out for delivery') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (stage === 'Awaiting payment') return 'bg-[#795bf4]/10 text-[#5a3fe0] border-[#795bf4]/25';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function paymentClass(payment: string) {
  return payment === 'Paid'
    ? 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30'
    : 'bg-amber-50 text-amber-700 border-amber-200';
}

function toneRing(tone: (typeof bookingKpis)[number]['tone']) {
  if (tone === 'emerald') return 'ring-[#66dba3]/20 bg-[#66dba3]/10 text-[#2ea66f]';
  if (tone === 'violet') return 'ring-[#795bf4]/20 bg-[#795bf4]/10 text-[#5a3fe0]';
  return 'ring-zinc-200 bg-zinc-50 text-zinc-700';
}

export default function BookingsOrdersContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const visibleBookings = useMemo(() => {
    if (activeTab === 'orders') return bookings.slice(0, 3);
    return bookings;
  }, [activeTab]);

  const visibleOrders = useMemo(() => {
    if (activeTab === 'bookings') return orders.slice(0, 3);
    return orders;
  }, [activeTab]);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a3fe0]">Bookings & Orders</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Schedule control and fulfillment in one place</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                Move between appointments and order operations without losing context. Confirm bookings, resolve payment gaps, and keep the pipeline moving.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-[#795bf4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6847ef]">
                New booking
              </button>
              <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                New order
              </button>
              <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                Export view
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bookingKpis.map((item) => (
            <article key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-zinc-900">{item.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
                </div>
                <span className={`rounded-full p-2 ring-1 ${toneRing(item.tone)}`}>
                  <span className="block h-2.5 w-2.5 rounded-full bg-current" />
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center gap-2 p-3">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'orders', label: 'Orders' },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'bg-[#795bf4] text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-[#66dba3]" /> Live workspace data
            </div>
          </div>
        </section>

        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <article className="xl:col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Today&apos;s booking flow</h2>
                  <p className="text-xs text-zinc-500">Track the day from prep through completion.</p>
                </div>
                <span className="rounded-full border border-[#795bf4]/20 bg-[#795bf4]/10 px-3 py-1 text-[11px] font-semibold text-[#5a3fe0]">
                  {visibleBookings.length} visible bookings
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {timelineBlocks.map((block, index) => {
                  const bookingMatch = bookings[index];
                  return (
                    <div key={block.time} className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                      <div className="min-w-[64px] rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Time</p>
                        <p className="text-sm font-black text-zinc-900">{block.time}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-zinc-900">{block.label}</p>
                          {bookingMatch && (
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(bookingMatch.status)}`}>
                              {bookingMatch.status}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-zinc-500">{block.detail}</p>
                        {bookingMatch && (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700">{bookingMatch.customer}</span>
                            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700">{bookingMatch.service}</span>
                            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700">{bookingMatch.channel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h2 className="text-base font-bold text-zinc-900">Booking actions</h2>
              <p className="mt-1 text-sm text-zinc-500">Fast responses for incoming requests.</p>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-800">Instagram DMs</span>
                    <span className="rounded-full bg-[#795bf4]/10 px-2 py-1 font-semibold text-[#5a3fe0]">Review slot</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">Amina Diop - Consultation call</p>
                  <p className="mt-1 text-xs text-zinc-500">Needs a confirmation before the slot is reserved.</p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50">
                      Decline
                    </button>
                    <button className="flex-1 rounded-lg bg-[#795bf4] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6847ef]">
                      Approve
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-800">WhatsApp Business</span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 font-semibold text-amber-700">Double-booked</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">Lindiwe Dlamini - Reschedule</p>
                  <p className="mt-1 text-xs text-zinc-500">Recommend an open time before closing the thread.</p>
                  <button className="mt-4 w-full rounded-lg border border-dashed border-[#795bf4]/30 bg-[#795bf4]/5 py-2 text-xs font-semibold text-[#5a3fe0] transition-colors hover:bg-[#795bf4]/10">
                    Propose alternative slot
                  </button>
                </div>
              </div>
            </article>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'orders') && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Order pipeline</h2>
                <p className="text-xs text-zinc-500">Open orders moving from payment to delivery.</p>
              </div>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold text-zinc-500">
                {visibleOrders.length} orders shown
              </span>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Order</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Stage</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className="odd:bg-white even:bg-zinc-50/40">
                      <td className="border-b border-zinc-100 px-4 py-3 font-mono font-semibold text-zinc-900">{order.id}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{order.customer}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 font-semibold text-zinc-900">{order.amount}</td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stageClass(order.stage)}`}>
                          {order.stage}
                        </span>
                        <p className="mt-1 text-[11px] text-zinc-400">ETA: {order.eta}</p>
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentClass(order.payment)}`}>
                          {order.payment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Needs attention</p>
                <p className="mt-2 text-2xl font-black text-zinc-900">2</p>
                <p className="mt-1 text-xs text-zinc-500">Waiting on payment or customer response.</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ready to ship</p>
                <p className="mt-2 text-2xl font-black text-zinc-900">1</p>
                <p className="mt-1 text-xs text-zinc-500">Packed and awaiting dispatch.</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Payment health</p>
                <p className="mt-2 text-2xl font-black text-zinc-900">86%</p>
                <p className="mt-1 text-xs text-zinc-500">Orders that clear payment before fulfillment.</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[#795bf4]/20 bg-[#795bf4]/5 px-5 py-4 text-sm text-[#5a3fe0] shadow-sm">
          <strong>Operational note:</strong> A quick win here is to treat bookings and orders as separate queues with distinct actions. That keeps the operator from mixing confirmation work with fulfillment work.
        </section>
      </div>
    </div>
  );
}
