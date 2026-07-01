const kpis = [
  { label: 'Messages handled', value: '3,842', delta: '+12.4%' },
  { label: 'Bookings confirmed', value: '216', delta: '+8.1%' },
  { label: 'Orders completed', value: '174', delta: '+10.7%' },
  { label: 'Revenue tracked', value: 'R284,300', delta: '+14.2%' },
];

const channelPerformance = [
  { channel: 'WhatsApp', messages: 1960, conversion: '32%', avgReply: '2m 12s' },
  { channel: 'Instagram', messages: 980, conversion: '24%', avgReply: '3m 05s' },
  { channel: 'Facebook', messages: 512, conversion: '21%', avgReply: '4m 11s' },
  { channel: 'Email', messages: 390, conversion: '18%', avgReply: '9m 34s' },
];

const weeklyTrend = [54, 62, 58, 69, 74, 71, 80];

export default function ReportsContent() {
  const maxTrend = Math.max(...weeklyTrend);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-zinc-900">{kpi.value}</p>
              <p className="mt-1 text-xs font-semibold text-[#2ea66f]">{kpi.delta} vs last 30 days</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:col-span-2">
            <h2 className="text-base font-semibold text-zinc-900">Weekly conversation trend</h2>
            <p className="mt-1 text-sm text-zinc-500">Message volume over the last seven days.</p>
            <div className="mt-5 flex items-end gap-2">
              {weeklyTrend.map((value, idx) => (
                <div key={idx} className="flex-1">
                  <div
                    className="w-full rounded-t-md bg-[#795bf4]/85"
                    style={{ height: `${Math.round((value / maxTrend) * 140)}px` }}
                  />
                  <p className="mt-2 text-center text-[11px] font-semibold text-zinc-500">D{idx + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-base font-semibold text-zinc-900">Plain-English summary</h2>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600">
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                Conversion performance improved this week, led by quicker responses in WhatsApp and stronger follow-up completion in Instagram.
              </p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                Booking confirmations grew steadily, but missed orders increased on weekends between 18:00 and 20:00.
              </p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                Recommended next action: increase automated reminders for evening traffic and route payment follow-ups within 10 minutes.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="text-base font-semibold text-zinc-900">Channel performance</h2>
          <p className="mt-1 text-sm text-zinc-500">Comparative response and conversion metrics by communication channel.</p>

          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Channel</th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Messages</th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Conversion</th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold">Avg reply time</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((row) => (
                  <tr key={row.channel} className="odd:bg-white even:bg-zinc-50/40">
                    <td className="border-b border-zinc-100 px-4 py-3 font-semibold text-zinc-900">{row.channel}</td>
                    <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{row.messages}</td>
                    <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{row.conversion}</td>
                    <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">{row.avgReply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
