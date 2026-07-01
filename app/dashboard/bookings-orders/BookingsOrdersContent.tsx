import React from 'react';

// Mock Data matching your structure + new layout elements from reference
const bookingSummary = [
  { label: 'Bookings today', value: '18', note: '4 pending confirmation' },
  { label: 'Orders in progress', value: '27', note: '6 awaiting payment' },
  { label: 'On-time completion', value: '93%', note: 'Last 30 days' },
  { label: 'Average ticket', value: 'R1,340', note: 'Across paid orders' },
];

const upcomingBookings = [
  { customer: 'Thabo Nkosi', service: 'Haircut + treatment', date: 'Sen 16, 2023 | 3:00 am', channel: 'WhatsApp', status: 'Confirmed' },
  { customer: 'Amina Diop', service: 'Consultation call', date: 'Sen 13, 2023 | 3:00 am', channel: 'WhatsApp', status: 'Pending', problem: 'Problem - double-booked' },
  { customer: 'Sipho Mthembu', service: 'Weekly booking', date: 'Sen 13, 2023 | 3:00 am', channel: 'WhatsApp', status: 'Confirmed' },
];

const activeOrders = [
  { date: 'Jun 29, 2022', amount: 'R8,750', stage: 'Preparing' },
  { date: 'Jan 28, 2022', amount: 'R12,500', stage: 'Ready for Delivery' },
  { date: 'Jun 09, 2022', amount: 'R1,180', stage: 'Courier IT - En Route' },
  { date: 'Jan 09, 2022', amount: 'R3,400', stage: 'Delivered' },
];

const bookingRequests = [
  { customer: 'Instagram DMs', context: 'Hello Stylist Session?', type: 'instagram' },
  { customer: 'Instagram Smith', context: 'What is on your needs?', type: 'tiktok' },
];

function statusClass(status: string) {
  if (status === 'Confirmed') return 'bg-[#66dba3]/15 text-[#2ea66f] border-[#66dba3]/30';
  if (status === 'Pending') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

function stageClass(stage: string) {
  if (stage === 'Preparing') return 'bg-amber-100 text-amber-700 border-amber-200';
  if (stage === 'Ready for Delivery') return 'bg-amber-50 text-amber-600 border-amber-200';
  if (stage === 'Courier IT - En Route') return 'bg-blue-50 text-blue-600 border-blue-100';
  if (stage === 'Delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

export default function BookingsOrdersContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6 font-sans">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        
        {/* Top Header Banner Row */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Bookings & Orders</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage and View All Business Bookings & Orders. Track appointments and fulfillment, Lindiwe.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors">
              Create New Booking
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Create New Order
            </button>
          </div>
        </header>

        {/* Tab Header View Visual Indicator */}
        <div className="flex border-b border-zinc-200 text-sm font-medium">
          <button className="border-b-2 border-indigo-600 px-6 py-2.5 text-indigo-600 font-semibold">Bookings</button>
          <button className="px-6 py-2.5 text-zinc-500 hover:text-zinc-700 flex items-center gap-1.5">
            Orders <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">1</span>
          </button>
        </div>

        {/* Core Layout Grid: Calendar and Row Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Block: Mini Calendar Component (Spans 5 Cols) */}
          <section className="lg:col-span-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900 text-sm">Lindiwe's Salon</h3>
              <button className="text-xs border border-zinc-200 rounded px-2 py-1 text-zinc-600 bg-zinc-50 font-medium flex items-center gap-1">
                &lt; Calendar
              </button>
            </div>
            
            {/* Days Matrix Headers */}
            <div className="grid grid-cols-5 text-center text-[11px] font-medium text-zinc-400 mt-3 border-b border-zinc-100 pb-2">
              <div>Mon<span className="block font-bold text-zinc-800 text-xs">24</span></div>
              <div>Tue<span className="block font-bold text-zinc-800 text-xs">25</span></div>
              <div>Wed<span className="block font-bold text-zinc-800 text-xs">26</span></div>
              <div>Thu<span className="block font-bold text-zinc-800 text-xs">27</span></div>
              <div>Fri<span className="block font-bold text-zinc-800 text-xs">28</span></div>
            </div>

            {/* Time Slot Rows Grid */}
            <div className="relative text-[11px] text-zinc-400 divide-y divide-zinc-100 mt-2 h-[280px] overflow-y-auto pr-1">
              {['10 am', '11 am', '12 am', '1 pm', '2 pm', '3 pm', '4 pm'].map((time, idx) => (
                <div key={idx} className="grid grid-cols-5 py-3 h-12 relative group">
                  <span className="absolute left-0 -top-2.5 bg-white px-1 text-[10px] text-zinc-400 z-10">{time}</span>
                  
                  {/* Absolute blocks injected manually to perfectly emulate the layout image scheduling blocks */}
                  {idx === 0 && (
                    <>
                      <div className="col-start-2 row-start-1 bg-emerald-50 border border-emerald-200 rounded p-1 text-[10px] font-medium text-emerald-800 absolute inset-x-1 top-2 bottom-[-10px] z-20">Booked Session</div>
                      <div className="col-start-3 row-start-1 bg-emerald-50 border border-emerald-200 rounded p-1 text-[10px] font-medium text-emerald-800 absolute inset-x-1 top-2 bottom-[-10px] z-20">Booked Session</div>
                    </>
                  )}
                  {idx === 2 && (
                    <div className="col-start-1 row-start-1 bg-blue-50 border border-blue-200 rounded p-1 text-[10px] font-medium text-blue-800 absolute inset-x-1 top-0 bottom-[-5px] z-20">Booked Session</div>
                  )}
                  {idx === 3 && (
                    <div className="col-start-2 row-start-1 bg-blue-50 border border-blue-200 rounded p-1 text-[10px] font-medium text-blue-800 absolute inset-x-1 top-0 bottom-0 z-20">Booked Session</div>
                  )}
                  {idx === 2 && (
                    <div className="col-start-4 row-start-1 bg-indigo-50 border border-indigo-200 rounded p-1 text-[10px] font-medium text-indigo-800 absolute inset-x-1 top-4 bottom-[-10px] z-20">Booked Session</div>
                  )}
                  {idx === 5 && (
                    <>
                      <div className="col-start-3 row-start-1 bg-emerald-50 border border-emerald-200 rounded p-1 text-[10px] font-medium text-emerald-800 absolute inset-x-1 top-0 bottom-[-5px] z-20">Booked Session</div>
                      <div className="col-start-4 row-start-1 bg-zinc-100 border border-zinc-200 rounded p-1 text-[10px] font-medium text-zinc-700 absolute inset-x-1 top-0 bottom-[-5px] z-20">Booked Session</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Center Block: Upcoming Bookings Widget Cards (Spans 4 Cols) */}
          <section className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-zinc-900 mb-3">Upcoming Bookings</h3>
              <div className="space-y-3">
                {upcomingBookings.map((booking, index) => (
                  <div key={index} className="p-3 border border-zinc-100 rounded-lg bg-zinc-50/50 text-xs relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-zinc-900">{booking.customer}</p>
                        <p className="text-zinc-500 mt-0.5">{booking.service}</p>
                        <p className="text-[11px] text-zinc-400 mt-1">{booking.date}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 font-semibold text-[10px] ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    {/* Social Channel Label and Custom Alert Sub-Row */}
                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-zinc-100">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                        ✓ {booking.channel}
                      </span>
                      {booking.problem && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">{booking.problem}</span>
                          <button className="text-[10px] text-indigo-600 font-bold underline">Reschedule</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Block: Requests & Integrations (Spans 3 Cols) */}
          <section className="lg:col-span-3 space-y-4">
            {/* Booking Requests */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-zinc-900 mb-1">Booking Requests</h3>
              <div className="flex justify-between text-[11px] font-medium text-zinc-400 mb-3">
                <span>Channel Context</span>
                <span>Quick Actions</span>
              </div>
              <div className="space-y-3">
                {bookingRequests.map((req, i) => (
                  <div key={i} className="text-xs border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span> {req.customer}
                    </div>
                    <p className="text-zinc-500 pl-3.5 text-[11px] mt-0.5 italic">"{req.context}"</p>
                    <div className="flex items-center gap-1.5 pl-3.5 mt-2">
                      <button className="text-[10px] font-semibold text-zinc-700 border border-zinc-200 bg-white rounded px-2 py-0.5 shadow-sm hover:bg-zinc-50">Approve</button>
                      <button className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700">Decline</button>
                      <button className="text-[10px] font-semibold text-indigo-600 hover:underline ml-auto">Suggest New Slot</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Status Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-zinc-900">Calendar Sync Status</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Google & Apple</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded bg-zinc-900 text-white font-semibold text-[10px] px-2 py-1 shadow-sm hover:bg-zinc-800">Resync</button>
                <button className="rounded border border-zinc-200 text-zinc-600 font-semibold text-[10px] px-2 py-1 bg-zinc-50">Manage Synched</button>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Section Layout Matrix: Performance Metrics alongside Order Pipeline Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Key Metrics Blocks (Spans 5 Cols) */}
          <section className="lg:col-span-5 grid grid-cols-2 gap-4">
            {bookingSummary.map((item) => (
              <article key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{item.label}</p>
                <p className="mt-1.5 text-2xl font-black tracking-tight text-zinc-900">{item.value}</p>
                <p className="mt-1 text-xs text-zinc-500 font-medium">{item.note}</p>
              </article>
            ))}
          </section>

          {/* Orders Fulfillment Status Pipeline Block (Spans 4 Cols) */}
          <section className="lg:col-span-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">Orders Fulfillment Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-zinc-400 font-medium border-b border-zinc-100">
                    <th className="pb-2">Item/Date</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {activeOrders.map((order, i) => (
                    <tr key={i} className="text-zinc-700">
                      <td className="py-2.5 font-semibold text-zinc-900">{order.date}</td>
                      <td className="py-2.5 text-right font-medium">{order.amount}</td>
                      <td className="py-2.5 text-right">
                        <span className={`inline-block rounded px-2 py-0.5 font-semibold text-[10px] border ${stageClass(order.stage)}`}>
                          {order.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tools & Integrations Sidebar Row (Spans 3 Cols) */}
          <section className="lg:col-span-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Booking Tools & Integrations</h3>
            
            <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2">
              <div>
                <p className="font-bold text-zinc-800">Google Calendar Sync</p>
                <p className="text-[10px] text-zinc-400">Google Calendar</p>
              </div>
              <button className="text-[11px] font-bold text-zinc-500 hover:text-zinc-700 underline">Manage</button>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2">
              <div>
                <p className="font-bold text-zinc-800">Yoco Payments</p>
                <p className="text-[10px] text-zinc-400">Import Reminders</p>
              </div>
              <button className="text-[11px] font-bold text-zinc-500 hover:text-zinc-700 underline">Manage</button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-zinc-800">SMS Booking Reminders</p>
              </div>
              <button className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2 py-1 rounded font-semibold">Add New</button>
            </div>
          </section>
        </div>

        {/* Footer Synced Context Bottom Status Bar */}
        <footer className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-5 py-3 text-xs text-indigo-700 font-medium flex flex-wrap gap-x-6 gap-y-2 items-center justify-center sm:justify-start">
          <span>Conversations Synced: <strong className="font-bold text-indigo-900">1,248</strong></span>
          <span className="hidden sm:inline text-indigo-200">|</span>
          <span>Active Workflows: <strong className="font-bold text-indigo-900">3</strong></span>
          <span className="hidden sm:inline text-indigo-200">|</span>
          <span>Bookings Managed: <strong className="font-bold text-indigo-900">154</strong></span>
        </footer>

        {/* Operational Context Banner Note */}
        <section className="rounded-xl border border-indigo-200/40 bg-indigo-50/30 px-5 py-4 text-xs text-indigo-600 leading-relaxed">
          <strong>Operational note:</strong> Current conversion drop-offs are concentrated between booking confirmation and payment request. Prioritize auto-payment follow-up for pending bookings.
        </section>

      </div>
    </div>
  );
}
