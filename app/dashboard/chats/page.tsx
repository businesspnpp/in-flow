export default function DashboardChatsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 min-h-[70vh]">
      <section className="if-card-soft overflow-hidden">
        <div className="border-b border-zinc-200 p-4">
          <input
            placeholder="Search conversations..."
            className="if-input w-full px-3 py-2 text-sm"
          />
        </div>
        <div className="divide-y divide-zinc-100">
          {['Customer One', 'Thabo Nkosi', 'Priya Maharaj'].map((name) => (
            <button key={name} className="w-full text-left p-4 hover:bg-zinc-50 transition-colors">
              <p className="text-sm font-semibold text-zinc-900">{name}</p>
              <p className="text-xs text-zinc-500 mt-1 truncate">Tap to open conversation</p>
            </button>
          ))}
        </div>
      </section>

      <section className="if-card-soft p-5 flex flex-col justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Active conversation/inbox list mounted route</p>
          <p className="text-sm text-zinc-500 mt-2">
            This Chats route is now separated from the dashboard root and ready for the full live inbox module wiring.
          </p>
        </div>
        <div className="if-card-soft p-3 mt-4">
          <p className="text-xs text-zinc-500">Type a reply...</p>
        </div>
      </section>
    </div>
  );
}
