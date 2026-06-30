import {
  Calendar,
  Mail,
  RotateCcw,
  Tag,
  CalendarDays,
  FileText,
  Flag
} from 'lucide-react';

/* ---------------- ICONS ---------------- */

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/>
      <path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white"/>
    </svg>
  );
}

function InstagramIcon({ size = 16, rounded = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: rounded ? '8px' : '0px' }}>
      <defs>
        <radialGradient id="dash-ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx={rounded ? "6" : "0"} fill="url(#dash-ig-grad)"/>
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function TikTokIcon({ size = 16, rounded = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: rounded ? '8px' : '0px' }}>
      <rect width="24" height="24" rx={rounded ? "6" : "0"} fill="#000000"/>
      <path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1v5.3a4.7 4.7 0 11-4-4.6v2.4a2.3 2.3 0 102 2.3V4.5h2.2z" fill="white"/>
    </svg>
  );
}

function MailIconBox({ size = 16 }) {
  return (
    <div className="rounded-lg bg-blue-500 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <Mail size={size * 0.55} className="text-white" />
    </div>
  );
}

/* ---------------- MOCK DATA ---------------- */

const channelSync = [
  { id: 'whatsapp', label: 'WhatsApp Business', status: 'Syncing', Icon: WhatsAppIcon, dot: 'bg-emerald-500' },
  { id: 'instagram', label: 'Instagram DMs', status: 'Connected', Icon: InstagramIcon, dot: 'bg-emerald-500' },
  { id: 'tiktok', label: 'TikTok', status: 'Connected', Icon: TikTokIcon, dot: 'bg-emerald-500' },
  { id: 'email', label: 'Email', status: 'Connected', Icon: MailIconBox, dot: 'bg-emerald-500' },
];

const conversations = [
  {
    id: 'c1',
    name: 'Braina Name',
    channel: 'whatsapp',
    avatarType: 'image',
    preview: 'Hello, first you rewnered your messages?',
  },
  {
    id: 'c2',
    name: 'Instagram Simith',
    channel: 'instagram',
    avatarType: 'icon',
    Icon: () => <InstagramIcon size={36} rounded={true} />,
    preview: 'Message is helov on your needs.',
  },
  {
    id: 'c3',
    name: 'Tiktok Soner',
    channel: 'tiktok',
    avatarType: 'icon',
    Icon: () => <TikTokIcon size={36} rounded={true} />,
    preview: 'What you can rarly to your message.',
  },
  {
    id: 'c4',
    name: 'Email Amiltin',
    channel: 'email',
    avatarType: 'icon',
    Icon: () => <MailIconBox size={36} />,
    preview: "Chek a'anting to ileave about!",
  },
];

const scheduleHours = ['13 am', '10 am', '11 am', '12 am', '1 pm', '2 pm', '3 am'];

const customerActions = [
  { id: 'a1', label: 'Confirm 2 New Bookings', tone: 'blue' },
  { id: 'a2', label: "Confirmd to a 'Price Inquiry'", tone: 'orange' },
  { id: 'a3', label: "Respond to a 'Price Inquiry'", tone: 'rose' },
  { id: 'a4', label: "Respond to a 'Price Inquiry'", tone: 'rose' },
];

const toneClasses = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
  orange: 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm',
  rose: 'bg-orange-50 text-orange-950 border border-orange-100 hover:bg-orange-100',
};

export default function DashboardHomeContent() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-white font-sans antialiased">
      <div className="space-y-5 max-w-[1400px] mx-auto">

        {/* WELCOME BANNER */}
        <div className="bg-blue-50/60 border border-blue-100/70 rounded-xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0 relative">
            <svg viewBox="0 0 64 64" className="w-full h-full object-cover">
              <circle cx="32" cy="32" r="32" fill="#DBEAFE" />
              <path d="M8 64c0-11 7-19 24-19s24 8 24 19H8z" fill="#E05A2B" />
              <path d="M20 64c0-7 4-13 12-13s12 6 12 13H20z" fill="#334155" />
              <circle cx="32" cy="23" r="11" fill="#A76F4C" />
              <path d="M21 23c0-6 5-11 11-11s11 5 11 11c0 2-1 4-2 5h-18c-1-1-2-3-2-5z" fill="#1E293B" />
              <rect x="36" y="38" width="16" height="12" rx="2" fill="#0F172A" />
              <rect x="38" y="40" width="12" height="8" rx="1" fill="#38BDF8" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome Back, &lsquo;Lindiwe&rsquo;.</h2>
            <p className="text-base text-slate-600 font-medium">Your business is looking good today.</p>
          </div>
        </div>

        {/* TOP 3 SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Communications Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Communications Summary</h3>
              <p className="text-sm font-bold text-slate-900 mt-1 mb-4">Channel Sync Status</p>
              <div className="space-y-3">
                {channelSync.map(({ id, label, status, Icon, dot }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      <span className="text-sm font-semibold text-slate-700">{label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className="text-sm font-semibold text-slate-700">{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 mt-6 pt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Total incoming messages:</span>
              <span className="font-bold text-slate-900 text-base">84</span>
            </div>
          </div>

          {/* Bookings & Schedules */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bookings &amp; Schedules</h3>
              <p className="text-sm font-bold text-slate-900 mt-1 mb-4">Bookings Today</p>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-950">12</span>
                  <span className="text-sm font-semibold text-slate-700">Confirmed</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-950">2</span>
                  <span className="text-sm font-semibold text-slate-700">New</span>
                </div>
                <div className="flex items-start gap-1.5 pt-1">
                  <span className="text-xl font-bold text-orange-600 leading-none">1</span>
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    Issue (Conflict detected with Google Calendar)
                  </span>
                </div>
              </div>
              <button type="button" className="text-sm font-bold text-blue-600 hover:underline mt-4 block">
                View Full Calendar
              </button>
            </div>
            <div className="border-t border-slate-100 mt-6 pt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Total bookings this week:</span>
              <span className="font-bold text-slate-900 text-base">58</span>
            </div>
          </div>

          {/* Active Workflows */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Workflows</h3>
              <p className="text-sm font-bold text-slate-900 mt-1 mb-3">Operational Automations</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-xl font-bold text-slate-950">3</span>
                <span className="text-sm font-semibold text-slate-700">Live</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>WhatsApp Auto-Reply</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Booking Reminder</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full bg-[#0B132B] text-white text-sm font-bold rounded-lg py-2.5 hover:bg-slate-800 transition-colors"
              >
                Create Workflow
              </button>
              <button type="button" className="w-full text-center text-sm font-bold text-slate-500 hover:underline">
                View Workflow Performance
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Unified Inbox + Integrated Schedule/Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* OMNICHANNEL CONVERSATIONS */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Omnichannel Conversations (Unified Inbox)</h3>
            <div className="divide-y divide-slate-100">
              {conversations.map((c) => (
                <div key={c.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    {/* Dynamic Avatar Setup matching image */}
                    <div className="relative shrink-0">
                      {c.avatarType === 'image' ? (
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden relative">
                          <svg viewBox="0 0 32 32" className="w-full h-full object-cover">
                            <circle cx="16" cy="16" r="16" fill="#cbd5e1" />
                            <circle cx="16" cy="12" r="6" fill="#475569" />
                            <path d="M4 28c0-6 5-10 12-10s12 4 12 10H4z" fill="#475569" />
                          </svg>
                        </div>
                      ) : (
                        <c.Icon />
                      )}
                      
                      {c.avatarType === 'image' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <WhatsAppIcon size={12} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold text-slate-900">{c.name}</p>
                        {/* Status Row Legend duplicated precisely */}
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <span className="flex items-center gap-0.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> New
                          </span>
                          <span className="flex items-center gap-0.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                          </span>
                          <span className="flex items-center gap-0.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Resolved
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{c.preview}</p>
                      
                      {/* Interactive Buttons with Internal Alignment Icons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-slate-200">
                          <Tag size={12} className="text-slate-500" /> Smart-Tagging
                        </button>
                        <button type="button" className="text-xs font-bold bg-slate-100 border border-slate-300 text-slate-700 rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-slate-200 shadow-xs">
                          <CalendarDays size={12} className="text-slate-500" /> Suggest Booking Slot
                        </button>
                        <button type="button" className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-slate-200">
                          <FileText size={12} className="text-slate-500" /> Create Order
                        </button>
                        <button type="button" className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-slate-200">
                          <Flag size={12} className="text-slate-500" /> Flag &amp; Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTEGRATED SCHEDULE & CUSTOMER ACTIONS PANEL */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Today&apos;s Schedule &amp; Customer Actions</h3>
              
              <div className="border border-slate-200 rounded-xl p-4 bg-white relative">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Today&apos;s Schedule</h4>
                
                <div className="grid grid-cols-12 gap-2 relative">
                  {/* Timeline hours */}
                  <div className="col-span-3 space-y-6">
                    {scheduleHours.map((hour, idx) => (
                      <div key={idx} className="text-xs font-bold text-slate-400 h-5 flex items-center">
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Shaded blocks and nested Action panel to mirror the layout perfectly */}
                  <div className="col-span-9 relative border-l border-slate-100 pl-2">
                    {/* Blue Highlighted Block at top */}
                    <div className="absolute top-0 left-2 right-0 h-10 bg-blue-50 border-b-2 border-dashed border-blue-200 rounded-xs opacity-70" />
                    
                    {/* Embedded Action list overlaying the timetable grid space */}
                    <div className="mt-8 space-y-3 relative z-10">
                      <p className="text-xs font-bold text-slate-900">Customer Actions Needed</p>
                      <div className="space-y-2">
                        {customerActions.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            className={`w-full text-center text-xs font-bold rounded-lg py-2 transition-colors ${toneClasses[a.tone]}`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Control Footer Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Google &amp; Apple Calendar Sync Status</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 bg-[#0B132B] text-white text-xs font-bold rounded-md px-4 py-2 hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw size={12} /> Resync
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-md px-3 py-2 hover:bg-slate-200 transition-colors flex-1"
                >
                  Manage Synced Calendars
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
