import React from 'react';

// Unified mock data mapping to the new visual layout
const metrics = [
  { label: 'Bookings Today', value: '18', sub: '4 pending confirmation' },
  { label: 'Pending Orders', value: '27', sub: '6 awaiting payment' },
  { label: 'Weekly Revenue (Yoco)', value: 'R1,340', sub: 'Average ticket' },
  { label: 'Orders Fulfillment Rate', value: '93%', sub: 'Last 30 days' },
];

const upcomingBookings = [
  { name: 'Thabo Nkosi', service: 'Haircut + treatment', date: 'Today | 10:30 am', channel: 'WhatsApp', status: 'Confirmed' },
  { name: 'Amina Diop', service: 'Consultation call', date: 'Today | 11:15 am', channel: 'Instagram', status: 'New Request', problem: true },
  { name: 'Sipho Mthembu', service: 'Weekly booking', date: 'Today | 1:00 pm', channel: 'WhatsApp', status: 'Confirmed' },
];

const bookingRequests = [
  { name: 'Zanele Khumalo', channel: 'Instagram DMs', message: 'Hello Stylist Session?', time: 'Awaiting payment' },
  { name: 'Marcus Vance', channel: 'TikTok Soner', message: 'What is on your needs?', time: 'Packed' },
];

const fulfillmentOrders = [
  { item: 'ORD-2041', amount: 'R8,750', stage: 'Packed', date: 'Jun 29, 2026', statusColor: 'bg-amber-100 text-amber-700' },
  { item: 'ORD-2043', amount: 'R1,180', stage: 'Out for Delivery', date: 'Jun 09, 2026', statusColor: 'bg-[#66dba3]/15 text-[#2ea66f]' },
  { item: 'ORD-2044', amount: 'R3,400', stage: 'Processing', date: 'Jan 09, 2026', statusColor: 'bg-zinc-100 text-zinc-600' },
];

export default function BookingsOrdersContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* --- Top Action Header Bar --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Bookings & Orders</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage and view all business bookings & orders. Track appointments and fulfillment.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition">
              Create New Booking
            </button>
            <button className="rounded-lg bg-[#5a3fe0] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4a32c2] transition">
              Create New Order
            </button>
          </div>
        </div>

        {/* --- Primary Calendar and Split View Row --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Main Booking Panel (Left Side) */}
          <div className="lg:col-span-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div className="flex gap-6 font-semibold text-sm">
                <span className="text-[#5a3fe0] border-b-2 border-[#5a3fe0] pb-4 -mb-[18px]">Bookings</span>
                <span className="text-zinc-400 cursor-pointer hover:text-zinc-600">Orders <span className="ml-1 inline-flex items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">1</span></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* High Fidelity Interactive Calendar View Component */}
              <div className="md:col-span-5 border border-zinc-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-zinc-700">Lindiwe's Salon</span>
                  <button className="text-[11px] font-medium border border-zinc-200 rounded px-2 py-0.5 shadow-sm bg-zinc-50 text-zinc-600">
                    &lt; Calendar
                  </button>
                </div>
                {/* Micro Grid Schedule Grid */}
                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-semibold text-zinc-400 mb-1">
                  <div>Mon 24</div><div>Tue 25</div><div>Wed 26</div><div>Thu 27</div><div>Fri 28</div>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-zinc-50 border border-zinc-100 rounded p-1 min-h-[180px] text-[9px]">
                  <div className="space-y-1">
                    <div className="mt-8 bg-[#795bf4]/10 border border-[#795bf4]/20 text-[#5a3fe0] p-1 rounded font-medium">12am Booked</div>
                  </div>
                  <div className="space-y-1">
                    <div className="mt-4 bg-[#66dba3]/10 border border-[#66dba3]/20 text-[#2ea66f] p-1 rounded font-medium">10am Booked</div>
                    <div className="mt-1 bg-[#795bf4]/10 border border-[#795bf4]/20 text-[#5a3fe0] p-1 rounded font-medium">2pm Booked</div>
                  </div>
                  <div className="space-y-1">
                    <div className="mt-4 bg-[#66dba3]/10 border border-[#66dba3]/20 text-[#2ea66f] p-1 rounded font-medium">10am Booked</div>
                    <div className="mt-6 bg-[#66dba3]/10 border border-[#66dba3]/20 text-[#2ea66f] p-1 rounded font-medium">4pm Booked</div>
                  </div>
                  <div className="space-y-1">
                    <div className="mt-8 bg-[#795bf4]/10 border border-[#795bf4]/20 text-[#5a3fe0] p-1 rounded font-medium">12am Booked</div>
                    <div className="mt-6 bg-[#66dba3]/10 border border-[#66dba3]/20 text-[#2ea66f] p-1 rounded font-medium">4pm Booked</div>
                  </div>
                  <div className="space-y-1">
                    {/* Empty Day Spacer Slot */}
                  </div>
                </div>
              </div>

              {/* Dynamic Upcoming Appointments Layout Queue */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Upcoming Bookings</h3>
                {upcomingBookings.map((booking, idx) => (
                  <div key={idx} className="border border-zinc-200 rounded-lg p-3 bg-white hover:border-zinc-300 transition relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-zinc-900">{booking.name}</p>
                        <p className="text-[11px] text-zinc-500">{booking.service}</p>
                        <p className="text-[11px] font-medium text-zinc-400 mt-1">{booking.date}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-[#66dba3]/15 text-[#2ea66f]' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-medium">
                          {booking.channel}
                        </span>
                      </div>
                    </div>
                    {booking.problem && (
                      <div className="mt-2 flex items-center justify-between border-t border-red-100 pt-2 text-[10px]">
                        <span className="font-semibold text-red-600">⚠️ Problem - double-booked</span>
                        <button className="text-[#5a3fe0] font-bold underline hover:text-[#4a32c2]">Reschedule</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Channels Context Panel (Right Side) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Booking Requests</h3>
              <div className="space-y-3">
                {bookingRequests.map((req, idx) => (
                  <div key={idx} className="border border-zinc-100 rounded-lg p-3 bg-zinc-50/60">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="font-bold text-zinc-700">{req.channel}</span>
                      <span className="text-zinc-400 text-[10px]">{req.time}</span>
                    </div>
                    <p className="text-xs text-zinc-600 italic">"{req.message}"</p>
                    <div className="mt-3 flex items-center gap-1">
                      <button className="flex-1 text-[10px] font-bold bg-white border border-zinc-200 text-zinc-700 py-1 rounded shadow-sm hover:bg-zinc-50">Approve</button>
                      <button className="flex-1 text-[10px] font-bold bg-white border border-zinc-200 text-zinc-700 py-1 rounded shadow-sm hover:bg-zinc-50">Decline</button>
                      <button className="text-[10px] font-bold text-[#5a3fe0] px-1 hover:underline">New Slot</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Engine Widget Status */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-800">Calendar Sync Status</p>
                <p className="text-[11px] text-zinc-400">Google & Apple Calendar active</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-bold bg-zinc-900 text-white rounded px-2.5 py-1 hover:bg-zinc-800">Resync</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Lower Performance KPI Cards & Pipelines --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Key Metrics Widget Panel */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m, i) => (
                <div key={i} className="border border-zinc-100 bg-zinc-50/50 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{m.label}</p>
                  <p className="text-xl font-black text-zinc-900 mt-1">{m.value}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Orders Pipeline Board Grid */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Orders Fulfillment Status</h3>
            <div className="divide-y divide-zinc-100 text-xs">
              {fulfillmentOrders.map((ord, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <p className="font-bold text-zinc-900">{ord.item}</p>
                    <p className="text-[10px] text-zinc-400">{ord.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-800">{ord.amount}</p>
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${ord.statusColor}`}>
                      {ord.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations Tools Side Stack */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Booking Tools & Integrations</h3>
            
            <div className="flex items-center justify-between border border-zinc-100 rounded-lg p-2.5 text-xs">
              <div>
                <p className="font-bold text-zinc-800">Google Calendar Sync</p>
                <p className="text-[10px] text-zinc-400">Connected</p>
              </div>
              <button className="text-[11px] font-bold text-[#5a3fe0] hover:underline">Manage</button>
            </div>

            <div className="flex items-center justify-between border border-zinc-100 rounded-lg p-2.5 text-xs">
              <div>
                <p className="font-bold text-zinc-800">Yoco Payments Checkout</p>
                <p className="text-[10px] text-zinc-400">Import Failures: 0</p>
              </div>
              <button className="text-[11px] font-bold text-[#5a3fe0] hover:underline">Manage</button>
            </div>

            <div className="flex items-center justify-between border border-zinc-100 rounded-lg p-2.5 text-xs">
              <div>
                <p className="font-bold text-zinc-800">SMS Reminders Engine</p>
                <p className="text-[10px] text-zinc-400">Active</p>
              </div>
              <button className="text-[11px] font-bold text-zinc-500 hover:underline">Configure</button>
            </div>
          </div>
        </div>

        {/* --- System Operational Alert Flag Banner --- */}
        <div className="rounded-xl border border-[#795bf4]/20 bg-[#795bf4]/5 px-5 py-4 text-xs font-medium text-[#5a3fe0] shadow-sm flex items-start gap-2">
          <span>💡</span>
          <p>
            <strong>Operational note:</strong> Current conversion drop-offs are concentrated between booking confirmation and payment request. Prioritize auto-payment follow-up for pending bookings to maximize capture.
          </p>
        </div>
      </div>
    </div>
  );
}
