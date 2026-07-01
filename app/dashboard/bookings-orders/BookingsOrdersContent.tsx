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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bookingSummary.map((item) => (
            <article key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{item.label}</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-zinc-900">{item.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
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
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{booking.slot}</td>
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

          <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
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
                      <td className="border-b border-zinc-100 px-4 py-3 font-semibold text-zinc-900">{order.id}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{order.customer}</td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{order.amount}</td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stageClass(order.stage)}`}>
                          {order.stage}
                        </span>
                        <p className="mt-1 text-[11px] text-zinc-500">ETA: {order.eta}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-[#795bf4]/20 bg-[#795bf4]/8 px-5 py-4 text-sm text-[#5a3fe0]">
          Operational note: current conversion drop-offs are concentrated between booking confirmation and payment request. Prioritize auto-payment follow-up for pending bookings.
        </section>
      </div>
    </div>
  );
}
