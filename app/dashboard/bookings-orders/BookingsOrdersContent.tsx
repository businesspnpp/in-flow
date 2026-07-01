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
    id: '1',
    customer: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    channel: 'WhatsApp',
    channelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    service: 'Lash Extension Kit',
    subText: 'Order # 2041',
    dateTime: 'May 15, 2023 @ 4:00 PM',
    status: 'Shipped',
    amount: 'R8,750',
    paymentStatus: 'Paid',
    actions: ['Track', 'Message'],
  },
  {
    id: '2',
    customer: 'Zanele Khumalo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    channel: 'Instagram',
    channelColor: 'bg-pink-50 text-pink-700 border-pink-200',
    service: 'Bridal Package Order',
    subText: 'Order # 2042',
    dateTime: 'May 16, 2023 @ 9:15 AM',
    status: 'Awaiting Payment',
    amount: 'R12,500',
    paymentStatus: 'Unpaid',
    actions: ['Remind', 'Message'],
  },
  {
    id: '3',
    customer: 'Chloe Jenkins',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    channel: 'Email',
    channelColor: 'bg-blue-50 text-blue-700 border-blue-200',
    service: 'Professional Makeup Set',
    subText: 'Order # 2043',
    dateTime: 'May 16, 2023 @ 2:00 PM',
    status: 'Out for Delivery',
    amount: 'R1,180',
    paymentStatus: 'Paid',
    actions: ['Track', 'Message'],
  },
  {
    id: '4',
    customer: 'James Okafor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    channel: 'TikTok',
    channelColor: 'bg-zinc-900 text-white border-zinc-950',
    service: 'Premium Barber Kit',
    subText: 'Order # 2044',
    dateTime: 'May 16, 2023 @ 3:30 PM',
    status: 'Processing',
    amount: 'R3,400',
    paymentStatus: 'Paid',
    actions: ['Pack', 'Message'],
  },
  {
    id: '5',
    customer: 'Amina Diop',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    channel: 'Email',
    channelColor: 'bg-blue-50 text-blue-700 border-blue-200',
    service: 'Weekly Refill Bundle',
    subText: 'Order # 2045',
    dateTime: 'May 16, 2023 @ 5:10 PM',
    status: 'Awaiting Payment',
    amount: 'R980',
    paymentStatus: 'Unpaid',
    actions: ['Remind', 'Message'],
  },
];

const calendarDays = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28'];
const calendarSlots = [
  { time: '10:00 am', label: 'Prep window' },
  { time: '12:00 pm', label: 'Midday' },
  { time: '14:00 pm', label: 'Afternoon' },
  { time: '16:00 pm', label: 'Late slot' },
];

function statusClass(status: string) {
  if (status === 'Confirmed') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (status === 'Pending') return 'bg-[#795bf4]/10 text-[#5a3fe0] border-[#795bf4]/25';
  if (status === 'Reschedule') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function stageClass(stage: string) {
  if (stage === 'Shipped' || stage === 'Out for Delivery') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (stage === 'Awaiting Payment') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (stage === 'Processing') return 'bg-zinc-100 text-zinc-700 border-zinc-300';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function paymentClass(payment: string) {
  return payment === 'Unpaid' ? 'text-red-600' : 'text-emerald-700';
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

        <section className="rounded-xl border border-zinc-200 bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center gap-1.5 p-1">
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
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                    active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
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
                  <h2 className="text-base font-bold text-zinc-900">Lindiwe&apos;s Salon Schedule</h2>
                  <p className="text-xs text-zinc-500">Weekly allocation blocks & active bookings</p>
                </div>
                <button className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                  &lt; Calendar
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[760px] overflow-hidden rounded-xl border border-zinc-200">
                  <div className="grid grid-cols-6 text-center text-xs">
                    <div className="border-b border-r border-zinc-200 bg-zinc-50 py-2.5 font-semibold text-zinc-500">Time</div>
                    {calendarDays.map((day) => (
                      <div key={day} className="border-b border-r border-zinc-200 bg-zinc-50 py-2.5 font-semibold text-zinc-900 last:border-r-0">
                        {day}
                      </div>
                    ))}

                    {calendarSlots.map((slot, idx) => (
                      <>
                        <div key={slot.time} className="flex items-center justify-center border-b border-r border-zinc-200 bg-zinc-50/50 p-3 text-center font-medium text-zinc-500">
                          {slot.time}
                        </div>
                        <div className="relative min-h-[64px] border-b border-r border-zinc-200 bg-white p-2">
                          {idx === 1 && <div className="absolute inset-1 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 p-1 text-[10px] font-semibold text-blue-700">10:30 Booked</div>}
                        </div>
                        <div className="relative min-h-[64px] border-b border-r border-zinc-200 bg-white p-2">
                          {idx === 0 && <div className="absolute inset-1 flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 p-1 text-[10px] font-semibold text-emerald-700">Active Block</div>}
                        </div>
                        <div className="relative min-h-[64px] border-b border-r border-zinc-200 bg-white p-2">
                          {idx === 1 && <div className="absolute inset-1 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 p-1 text-[10px] font-semibold text-blue-700">11:15 Pending</div>}
                        </div>
                        <div className="relative min-h-[64px] border-b border-r border-zinc-200 bg-white p-2">
                          {idx === 2 && <div className="absolute inset-1 flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 p-1 text-[10px] font-semibold text-zinc-700">15:45 Hold</div>}
                        </div>
                        <div className="relative min-h-[64px] border-b border-zinc-200 bg-white p-2">
                          {idx === 3 && <div className="absolute inset-1 flex items-center justify-center rounded-md border border-[#795bf4]/20 bg-[#795bf4]/10 p-1 text-[10px] font-semibold text-[#5a3fe0]">16:30 Confirmed</div>}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
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

            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <table className="w-full min-w-[980px] border-collapse text-left text-xs text-zinc-600">
                <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Service/Item</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-zinc-50/50">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-zinc-900">
                        <div className="flex items-center gap-3">
                          <img src={order.avatar} alt={order.customer} className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-200" />
                          <span>{order.customer}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${order.channelColor}`}>
                          {order.channel}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-zinc-900">{order.service}</div>
                        <div className="mt-0.5 text-[11px] text-zinc-400">{order.subText}</div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-zinc-500">
                        {order.dateTime.split(' @ ').map((part, index) => (
                          <span key={`${order.id}-${part}-${index}`} className="block first:font-medium first:text-zinc-800 last:mt-0.5 last:text-[11px] last:text-zinc-400">
                            {part}
                          </span>
                        ))}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${stageClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="font-bold text-zinc-900">{order.amount}</div>
                        <div className={`mt-0.5 text-[10px] font-medium ${paymentClass(order.paymentStatus)}`}>({order.paymentStatus})</div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex w-24 flex-col gap-1">
                          {order.actions.map((action, actionIdx) => (
                            <button
                              key={`${order.id}-${action}-${actionIdx}`}
                              type="button"
                              className="rounded border border-zinc-200 bg-white px-2 py-1 text-center text-[11px] font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
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
