export default function DashboardHomePage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="if-card-soft p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Today</p>
          <p className="mt-2 text-2xl font-black text-zinc-900">18</p>
          <p className="text-sm text-zinc-500 mt-1">New messages across channels</p>
        </div>
        <div className="if-card-soft p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Bookings</p>
          <p className="mt-2 text-2xl font-black text-zinc-900">7</p>
          <p className="text-sm text-zinc-500 mt-1">Appointments scheduled this week</p>
        </div>
        <div className="if-card-soft p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Revenue</p>
          <p className="mt-2 text-2xl font-black text-zinc-900">R12,400</p>
          <p className="text-sm text-zinc-500 mt-1">Pending + paid invoices this month</p>
        </div>
      </div>

      <div className="if-card-soft p-5">
        <p className="text-base font-semibold text-zinc-900">Friendly business overview dashboard</p>
        <p className="text-sm text-zinc-500 mt-2">
          This is your home snapshot. Use Chats to answer customers quickly, Shortcuts for automation tools,
          and Reports for plain-English performance insights.
        </p>
      </div>
    </div>
  );
}
