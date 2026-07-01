import React from 'react';

const bookingSummary = [
  { label: 'Bookings today', value: '18', note: '4 pending confirmation' },
  { label: 'Orders in progress', value: '27', note: '6 awaiting payment' },
  { label: 'On-time completion', value: '93%', note: 'Last 30 days' },
  { label: 'Average ticket', value: 'R1,340', note: 'Across paid orders' },
];

const upcomingBookings = [
  { customer: 'Thabo Nkosi', service: 'Haircut + treatment', slot: '10:30', channel: 'WhatsApp', status: 'Confirmed' },
  { customer: 'Amina Diop', service: 'Consultation call', slot: '11:15', channel: 'Instagram', status: 'Pending' },
  { customer: 'Sipho Mthembu', service: 'Weekly booking', slot: '13:00', channel: 'WhatsApp', status: 'Confirmed' },
  { customer: 'Lindiwe Dlamini', service: 'Product pickup', slot: '15:45', channel: 'Email', status: 'Reschedule' },
];

const activeOrders = [
  { id: 'ORD-2041', customer: 'Marcus Vance', amount: 'R8,750', stage: 'Packed', eta: 'Today 17:00' },
  { id: 'ORD-2042', customer: 'Zanele Khumalo', amount: 'R12,500', stage: 'Awaiting payment', eta: 'Waiting' },
  { id: 'ORD-2043', customer: 'Chloe Jenkins', amount: 'R1,180', stage: 'Out for delivery', eta: 'Today 16:30' },
  { id: 'ORD-2044', customer: 'James Okafor', amount: 'R3,400', stage: 'Processing', eta: 'Tomorrow 10:00' },
];

function statusClass(status: string) {
  if (status === 'Confirmed') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (status === 'Pending') return 'bg-[#795bf4]/10 text-[#5a3fe0] border-[#795bf4]/25';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function stageClass(stage: string) {
  if (stage === 'Out for delivery') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (stage === 'Awaiting payment') return 'bg-[#795bf4]/10 text-[#5a3fe0] border-[#795bf4]/25';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

export default function BookingsOrdersContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Row with Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">Bookings & Orders</h1>
            <p className="text-sm text-zinc-500">Manage, view, track appointments and fulfillment channels.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-[#e35d25] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#cbf443]/90 transition">
              Create New Booking
            </button>
            <button className="rounded-lg bg-[#3b5998] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition">
              Create New Order
            </button>
          </div>
        </div>

        {/* Dynamic Metric Grid Block */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bookingSummary.map((item) => (
            <article key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-zinc-900">{item.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{item.note}</p>
            </article>
          ))}
        </section>

        {/* Master Content Section: Calendar & Right Feeds */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          
          {/* Left Block: Full-Height Interactive Schedule Calendar (Takes 2 Columns) */}
          <article className="xl:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Lindiwe's Salon Schedule</h2>
                <p className="text-xs text-zinc-500">Weekly allocation blocks & active bookings</p>
              </div>
              <button className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                &lt; Calendar
              </button>
            </div>

            {/* Timetable Matrix Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px] grid grid-cols-6 text-center text-xs border border-zinc-200 rounded-lg overflow-hidden">
                {/* Header row */}
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-500 border-b border-r border-zinc-200">Time</div>
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-900 border-b border-r border-zinc-200">Mon 24</div>
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-900 border-b border-r border-zinc-200">Tue 25</div>
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-900 border-b border-r border-zinc-200">Wed 26</div>
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-900 border-b border-r border-zinc-200">Thu 27</div>
                <div className="bg-zinc-50 py-2.5 font-semibold text-zinc-900 border-b border-zinc-200">Fri 28</div>

                {/* Time Slots Rows */}
                {['10:00 am', '12:00 pm', '14:00 pm', '16:00 pm'].map((time, idx) => (
                  <React.Fragment key={time}>
                    <div className="p-3 bg-zinc-50/50 font-medium text-zinc-500 border-b border-r border-zinc-200 flex items-center justify-center">{time}</div>
                    <div className="p-2 border-b border-r border-zinc-200 bg-white relative min-h-[60px]">
                      {idx === 1 && <div className="absolute inset-1 bg-blue-50 text-blue-700 p-1 rounded text-[10px] font-semibold border border-blue-200 flex items-center justify-center">10:30 Booked</div>}
                    </div>
                    <div className="p-2 border-b border-r border-zinc-200 bg-white relative">
                      {idx === 0 && <div className="absolute inset-1 bg-emerald-50 text-emerald-700 p-1 rounded text-[10px] font-semibold border border-emerald-200 flex items-center justify-center">Active Block</div>}
                    </div>
                    <div className="p-2 border-b border-r border-zinc-200 bg-white relative">
                      {idx === 0 && <div className="absolute inset-1 bg-emerald-50 text-emerald-700 p-1 rounded text-[10px] font-semibold border border-emerald-200 flex items-center justify-center">Active Block</div>}
                    </div>
                    <div className="p-2 border-b border-r border-zinc-200 bg-white relative">
                      {idx === 1 && <div className="absolute inset-1 bg-blue-50 text-blue-700 p-1 rounded text-[10px] font-semibold border border-blue-200 flex items-center justify-center">11:15 Pending</div>}
                    </div>
                    <div className="p-2 border-b border-zinc-200 bg-white relative">
                      {idx === 2 && <div className="absolute inset-1 bg-zinc-100 text-zinc-700 p-1 rounded text-[10px] font-semibold border border-zinc-200 flex items-center justify-center">15:45 Hold</div>}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </article>

          {/* Right Block: Live Requests Feed & Sync Actions */}
          <div className="space-y-6">
            {/* Booking Requests Module */}
            <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-bold text-zinc-900">Incoming Requests</h2>
              <p className="text-xs text-zinc-500 mb-4">Awaiting channel action context</p>

              <div className="space-y-3">
                <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-zinc-800">Instagram DMs</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">Review Slot</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-900">Amina Diop — Consultation call</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="flex-1 rounded bg-white border border-zinc-200 py-1 text-[11px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">Decline</button>
                    <button className="flex-1 rounded bg-[#795bf4] py-1 text-[11px] font-medium text-white shadow-sm hover:opacity-90">Approve</button>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-zinc-800">WhatsApp Business</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium text-[10px]">Double-Booked</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-900">Lindiwe Dlamini — Reschedule</p>
                  <button className="mt-2 w-full rounded border border-dashed border-amber-300 bg-amber-50/30 py-1 text-[11px] font-medium text-amber-700">
                    Propose Alternative Slot
                  </button>
                </div>
              </div>
            </article>

            {/* Sync Integrations State Card */}
            <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-bold text-zinc-900 mb-1">Calendar Sync Status</h3>
              <p className="text-xs text-zinc-400 mb-3">Google & Apple Ecosystems</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Synced Live
                </span>
                <button className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800">
                  Force Resync
                </button>
              </div>
            </article>
          </div>
        </div>

        {/* Lower Double Grid: Data Tables Pipeline */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          
          {/* Upcoming Appointment Manifest */}
          <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-semibold text-zinc-900">Upcoming bookings</h2>
            <p className="mt-1 text-sm text-zinc-500">Scheduled appointments and reservation statuses for today.</p>

            <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Service</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Slot</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map((booking) => (
                    <tr key={`${booking.customer}-${booking.slot}`} className="odd:bg-white even:bg-zinc-50/40">
                      <td className="border-b border-zinc-100 px-4 py-3 font-semibold text-zinc-900">{booking.customer}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{booking.service}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">
                        <span className="font-mono">{booking.slot}</span>
                        <span className="ml-2 text-xs text-zinc-400">({booking.channel})</span>
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* Core Fulfillment Pipeline Map */}
          <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-semibold text-zinc-900">Active orders</h2>
            <p className="mt-1 text-sm text-zinc-500">Open orders currently moving through your fulfillment pipeline.</p>

            <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Order</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((order) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {/* Operational Intelligence Guardrail Banner */}
        <section className="rounded-xl border border-[#795bf4]/20 bg-[#795bf4]/5 px-5 py-4 text-sm text-[#5a3fe0] shadow-sm">
          <strong>Operational note:</strong> Current conversion drop-offs are concentrated between booking confirmation and payment request. Prioritize auto-payment follow-up loops for pending items.
        </section>
      </div>
    </div>
  );
}
