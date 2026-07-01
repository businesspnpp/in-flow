'use client';

import { useMemo, useState } from 'react';

const workspaceRecords = [
  {
    id: '1',
    customer: "Lindiwe's Salon",
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    channel: 'WhatsApp',
    channelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    service: 'Bridal Hair Trial',
    subText: '',
    dateTime: 'May 15, 2023 @ 10:00 AM',
    status: 'Confirmed',
    type: 'booking',
    payment: 'R1,500',
    paymentStatus: 'Paid',
    actions: ['Reschedule', 'Cancel', 'Message'],
  },
  {
    id: '2',
    customer: 'Thabo',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    channel: 'Instagram',
    channelColor: 'bg-pink-50 text-pink-700 border-pink-200',
    service: 'Barber Cut',
    subText: '',
    dateTime: 'May 15, 2023 @ 1:30 PM',
    status: 'Pending Confirmation',
    type: 'booking',
    payment: 'R300',
    paymentStatus: 'Unpaid',
    actions: ['Approve', 'Reschedule', 'Message'],
  },
  {
    id: '3',
    customer: 'Sipho',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    channel: 'TikTok',
    channelColor: 'bg-zinc-900 text-white border-zinc-950',
    service: 'Lash Extension Kit',
    subText: 'Order # 1034',
    dateTime: 'May 15, 2023 @ 4:00 PM',
    status: 'Shipped',
    type: 'order',
    payment: 'R850',
    paymentStatus: 'Paid',
    actions: ['Track', 'Message'],
  },
  {
    id: '4',
    customer: 'Lintline',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    channel: 'Email',
    channelColor: 'bg-blue-50 text-blue-700 border-blue-200',
    service: 'Makeup Workshop',
    subText: 'Seat',
    dateTime: 'May 16, 2023 @ 9:00 AM',
    status: 'Confirmed',
    type: 'booking',
    payment: 'R2,200',
    paymentStatus: 'Paid, Deposit',
    actions: [],
  },
  {
    id: '5',
    customer: 'Lintline',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    channel: 'Email',
    channelColor: 'bg-blue-50 text-blue-700 border-blue-200',
    service: 'Makeup Workshop',
    subText: 'Seat',
    dateTime: 'May 16, 2023 @ 9:00 AM',
    status: 'Confirmed',
    type: 'booking',
    payment: 'R2,200',
    paymentStatus: 'Paid, Deposit',
    actions: ['Reschedule', 'Cancel', 'Message'],
  },
] as const;

const bottomWidgets = [
  { label: 'Upcoming This Week:', value: '15 Bookings' },
  { label: 'Awaiting Payment:', value: '5 Orders' },
  { label: 'Recent Cancellations:', value: '2' },
] as const;

type TabKey = 'overview' | 'bookings' | 'orders';

function statusBadgeClass(status: string) {
  if (status === 'Confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'Pending Confirmation') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'Shipped') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function paymentTextClass(status: string) {
  if (status === 'Unpaid') return 'text-red-600';
  return 'text-emerald-700';
}

export default function BookingsOrdersContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const filteredRecords = useMemo(() => {
    if (activeTab === 'bookings') return workspaceRecords.filter((r) => r.type === 'booking');
    if (activeTab === 'orders') return workspaceRecords.filter((r) => r.type === 'order');
    return workspaceRecords;
  }, [activeTab]);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 font-sans md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Bookings & Orders</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-500">
              New Booking
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500">
              Export Data
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center gap-2 p-1">
            {[
              { key: 'overview', label: 'All Operations' },
              { key: 'bookings', label: 'Bookings Only' },
              { key: 'orders', label: 'Orders Only' },
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
          </div>
        </section>

        <main className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs text-zinc-600">
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
              {filteredRecords.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-zinc-50/50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-zinc-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={record.avatar}
                        alt={record.customer}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <span>{record.customer}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${record.channelColor}`}>
                      {record.channel}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-medium text-zinc-900">{record.service}</div>
                    {record.subText && <div className="mt-0.5 text-[11px] text-zinc-400">{record.subText}</div>}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-zinc-500">
                    {record.dateTime.split(' @ ').map((part, index) => (
                      <span
                        key={`${record.id}-${part}-${index}`}
                        className="block first:font-medium first:text-zinc-800 last:mt-0.5 last:text-[11px] last:text-zinc-400"
                      >
                        {part}
                      </span>
                    ))}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(record.status)}`}>
                      {record.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-bold text-zinc-900">{record.payment}</div>
                    <div className={`mt-0.5 text-[10px] font-medium ${paymentTextClass(record.paymentStatus)}`}>
                      ({record.paymentStatus})
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    {record.actions.length > 0 ? (
                      <div className="inline-flex w-28 flex-col gap-1">
                        {record.actions.map((action, actionIdx) => (
                          <button
                            key={actionIdx}
                            type="button"
                            className="rounded border border-zinc-200 bg-white px-2 py-1 text-center text-[11px] font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="pr-4 text-xs italic text-zinc-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {bottomWidgets.map((widget, i) => (
            <article key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-medium text-zinc-500">{widget.label}</p>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-zinc-900">{widget.value}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-zinc-200 bg-zinc-100/50 px-5 py-3 text-xs font-medium text-zinc-500 sm:justify-start">
          <span>
            Conversations Synced: <strong className="font-bold text-zinc-800">1,248</strong>
          </span>
          <span className="hidden text-zinc-300 sm:inline">|</span>
          <span>
            Active Workflows: <strong className="font-bold text-zinc-800">8</strong>
          </span>
          <span className="hidden text-zinc-300 sm:inline">|</span>
          <span>
            Bookings Managed: <strong className="font-bold text-zinc-800">154</strong>
          </span>
        </footer>
      </div>
    </div>
  );
}
