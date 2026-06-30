import { Calendar, Mail, RotateCcw } from 'lucide-react';

type IconProps = { size?: number };
type Channel = 'whatsapp' | 'instagram' | 'tiktok' | 'email';
type Tone = 'blue' | 'orange' | 'rose';

function WhatsAppIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366" />
      <path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dash-ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#dash-ig-grad)" />
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      <rect x="3" y="3" width="18" height="18" rx="6" stroke="white" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1v5.3a4.7 4.7 0 11-4-4.6v2.4a2.3 2.3 0 102 2.3V4.5h2.2z" fill="white" />
    </svg>
  );
}

function MailIconBox({ size = 16 }: IconProps) {
  return (
    <div className="flex items-center justify-center rounded-md bg-blue-500" style={{ width: size, height: size }}>
      <Mail size={size * 0.62} className="text-white" />
    </div>
  );
}

const channelSync: Array<{ id: string; label: string; status: string; Icon: (props: IconProps) => JSX.Element; dot: string }> = [
  { id: 'whatsapp', label: 'WhatsApp Business', status: 'Syncing', Icon: WhatsAppIcon, dot: 'bg-amber-500' },
  { id: 'instagram', label: 'Instagram DMs', status: 'Connected', Icon: InstagramIcon, dot: 'bg-emerald-500' },
  { id: 'tiktok', label: 'TikTok', status: 'Connected', Icon: TikTokIcon, dot: 'bg-emerald-500' },
  { id: 'email', label: 'Email', status: 'Connected', Icon: MailIconBox, dot: 'bg-emerald-500' },
];

const activeAutomations = ['WhatsApp Auto-Reply', 'Booking Reminder'];

const conversations: Array<{
  id: string;
  name: string;
  channel: Channel;
  avatarColor: string;
  initials: string;
  preview: string;
}> = [
  { id: 'c1', name: 'Braina Name', channel: 'whatsapp', avatarColor: 'bg-amber-200', initials: 'BN', preview: 'Hello, first you renewed your messages?' },
  { id: 'c2', name: 'Instagram Smith', channel: 'instagram', avatarColor: 'bg-zinc-100', initials: 'IS', preview: 'Message is helov on your needs.' },
  { id: 'c3', name: 'Tiktok Soner', channel: 'tiktok', avatarColor: 'bg-zinc-100', initials: 'TS', preview: 'What you can rarely to your message.' },
  { id: 'c4', name: 'Email Amiltin', channel: 'email', avatarColor: 'bg-zinc-100', initials: 'EA', preview: "Chek a'anting to ileave about!" },
];

const channelIconFor = (channel: Channel) => {
  switch (channel) {
    case 'whatsapp':
      return <WhatsAppIcon size={18} />;
    case 'instagram':
      return <InstagramIcon size={18} />;
    case 'tiktok':
      return <TikTokIcon size={18} />;
    case 'email':
      return <MailIconBox size={18} />;
    default:
      return null;
  }
};

const scheduleHours = ['1 am', '10 am', '11 am', '12 am', '1 pm', '2 pm', '3 am'];

const customerActions: Array<{ id: string; label: string; tone: Tone }> = [
  { id: 'a1', label: 'Confirm 2 New Bookings', tone: 'blue' },
  { id: 'a2', label: "Confirmd to a 'Price Inquiry'", tone: 'orange' },
  { id: 'a3', label: "Respond to a 'Price Inquiry'", tone: 'rose' },
  { id: 'a4', label: "Respond to a 'Price Inquiry'", tone: 'rose' },
];

const toneClasses: Record<Tone, string> = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700',
  orange: 'bg-orange-500 text-white hover:bg-orange-600',
  rose: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100',
};

export default function DashboardHomeContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6">
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">
            <svg viewBox="0 0 64 64" width="68" height="68">
              <circle cx="32" cy="32" r="32" fill="#DBEAFE" />
              <path d="M6 64c0-14 11-23 26-23s26 9 26 23H6z" fill="#C2410C" />
              <path d="M21 64c0-10 5-16 11-16s11 6 11 16H21z" fill="#FAFAF9" />
              <rect x="27" y="33" width="10" height="10" rx="3" fill="#6B4226" />
              <circle cx="32" cy="24" r="11" fill="#8B5A3C" />
              <path d="M21 24a11 11 0 0122 0v2H21v-2z" fill="#1C1410" />
              <path d="M41 15c2 4 1 8-1 11c-3-3-7-4-11-3c3-4 7-7 12-8z" fill="#1C1410" />
              <circle cx="40" cy="16" r="5" fill="#1C1410" />
              <path d="M29 52c5-4 10-6 15-7l2 5c-6 1.5-10 4-14 7z" fill="#7C4A2D" />
              <g transform="rotate(-8 44.5 46)">
                <rect x="37" y="40" width="15" height="12" rx="2" fill="#0F172A" />
                <rect x="38.5" y="41.5" width="12" height="9" rx="1" fill="#60A5FA" />
              </g>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Welcome Back, &lsquo;Lindiwe&rsquo;.</h2>
            <p className="mt-0.5 text-sm text-zinc-600">Your business is looking good today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900">Communications Summary</h3>
            <p className="mb-2 mt-3 text-xs font-semibold text-zinc-400">Channel Sync Status</p>
            <div className="space-y-2.5">
              {channelSync.map(({ id, label, status, Icon, dot }) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="text-sm text-zinc-700">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    <span className="text-sm text-zinc-500">{status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm text-zinc-500">Total incoming messages:</span>
              <span className="text-base font-bold text-zinc-900">84</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900">Bookings &amp; Schedules</h3>
            <p className="mb-2 mt-3 text-xs font-semibold text-zinc-400">Bookings Today</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-2xl font-bold text-zinc-900">12</span>
                <span className="text-sm text-zinc-600">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-2xl font-bold text-zinc-900">2</span>
                <span className="text-sm text-zinc-600">New</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="leading-none text-2xl font-bold text-orange-600">1</span>
                <span className="text-sm leading-snug text-orange-600">Issue (Conflict detected with Google Calendar)</span>
              </div>
            </div>
            <button type="button" className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              View Full Calendar
            </button>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm text-zinc-500">Total bookings this week:</span>
              <span className="text-base font-bold text-zinc-900">58</span>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900">Active Workflows</h3>
            <p className="mb-2 mt-3 text-xs font-semibold text-zinc-400">Operational Automations</p>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-2xl font-bold text-zinc-900">3</span>
              <span className="text-sm text-zinc-600">Live</span>
            </div>
            <div className="mb-4 space-y-1.5">
              {activeAutomations.map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-sm text-zinc-700">{name}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-auto rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Create Workflow
            </button>
            <button type="button" className="mt-3 text-left text-sm font-semibold text-blue-600 hover:underline">
              View Workflow Performance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-base font-bold text-zinc-900">Omnichannel Conversations (Unified Inbox)</h3>
            <div className="space-y-3">
              {conversations.map((c) => (
                <div key={c.id} className="rounded-xl border border-zinc-100 p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-zinc-700 ${c.avatarColor}`}>
                        {c.initials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-1 ring-zinc-100">
                        {channelIconFor(c.channel)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-zinc-900">{c.name}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> New
                          </span>
                          <span className="flex items-center gap-1 font-medium text-amber-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pending
                          </span>
                          <span className="flex items-center gap-1 font-medium text-zinc-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" /> Resolved
                          </span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-500">{c.preview}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200">
                          Smart-Tagging
                        </button>
                        <button type="button" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200">
                          Suggest Booking Slot
                        </button>
                        <button type="button" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200">
                          Create Order
                        </button>
                        <button type="button" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200">
                          Flag &amp; Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-zinc-900">Today&apos;s Schedule</h3>

              {/* CSS grid timeline: 7 rows × [44px label | 1fr content] */}
              <div
                className="mb-1"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr',
                  gridTemplateRows: 'repeat(7, 36px)',
                }}
              >
                {/* Horizontal divider lines (rows 1-6) */}
                {[1,2,3,4,5,6].map(r => (
                  <div key={r} style={{ gridColumn: '1/-1', gridRow: r, borderBottom: '1px solid #f4f4f5' }} />
                ))}

                {/* Hour labels */}
                {['13 am','10 am','11 am','12 am','1 pm','2 pm','3 am'].map((h, i) => (
                  <div key={h} className="flex items-center text-xs text-zinc-400" style={{ gridColumn: 1, gridRow: i + 1 }}>{h}</div>
                ))}

                {/* Blue busy bar spanning rows 1–2 */}
                <div
                  className="self-center h-[22px] rounded-lg bg-blue-100"
                  style={{ gridColumn: 2, gridRow: '1 / 3' }}
                />

                {/* "Customer Actions Needed" heading in row 3 */}
                <div
                  className="flex items-center text-sm font-bold text-zinc-900"
                  style={{ gridColumn: 2, gridRow: 3 }}
                >
                  Customer Actions Needed
                </div>

                {/* Action buttons in rows 4–7 */}
                {customerActions.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`self-center w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors ${toneClasses[a.tone]}`}
                    style={{ gridColumn: 2, gridRow: i + 4 }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-zinc-900">Google &amp; Apple Calendar Sync Status</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  <RotateCcw size={14} /> Resync
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
                >
                  <Calendar size={14} /> Manage Synced Calendars
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
