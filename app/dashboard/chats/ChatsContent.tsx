'use client';

import { useMemo, useState } from 'react';
import {
  Search, Filter, ChevronDown, ChevronRight, Tag, Download,
  UserPlus, MoreHorizontal, ArrowUpRight,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* Channel glyphs (no brand icons in lucide-react, so inline SVGs)   */
/* ---------------------------------------------------------------- */

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        fill="#fff"
        d="M16 7.5c-4.7 0-8.5 3.8-8.5 8.5 0 1.5.4 2.9 1.1 4.2L7.5 24.5l4.5-1.1c1.2.7 2.6 1.1 4 1.1 4.7 0 8.5-3.8 8.5-8.5S20.7 7.5 16 7.5Zm4.9 12.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.7-.1 1.3Z"
      />
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <defs>
        <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="20%" stopColor="#fdf497" />
          <stop offset="40%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="16" fill="url(#igGrad)" />
      <rect x="9" y="9" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.6" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="20.3" cy="11.7" r="0.9" fill="#fff" />
    </svg>
  );
}

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#000" />
      <path
        fill="#fff"
        d="M19.3 8.5c.5 1.6 1.6 2.7 3.3 2.9v2.4c-1.2 0-2.3-.4-3.3-1.1v5.6c0 2.8-2.2 5-5 5-1 0-2-.3-2.8-.9a5 5 0 0 1 5.5-7.8v2.6a2.4 2.4 0 1 0 1.7 2.3v-11h.6Z"
      />
    </svg>
  );
}

const CHANNEL_ICON: Record<Channel, (s?: { size?: number }) => JSX.Element> = {
  whatsapp: (p) => <WhatsAppIcon {...p} />,
  instagram: (p) => <InstagramIcon {...p} />,
  tiktok: (p) => <TikTokIcon {...p} />,
};

/* ---------------------------------------------------------------- */
/* Mock data                                                         */
/* ---------------------------------------------------------------- */

type Channel = 'whatsapp' | 'instagram' | 'tiktok';

type Customer = {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  contact: string;
  channels: Channel[];
  online: boolean;
  lastInteractionDays: number;
};

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Lindiwe', avatarColor: 'bg-amber-700', initials: 'LD', contact: '+27 82 386 0192 / lindiwe@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 13 },
  { id: 'c2', name: 'Thabo', avatarColor: 'bg-zinc-800', initials: 'TN', contact: '+27 71 940 2218 / thabo.nkosi@gmail.com', channels: ['whatsapp', 'instagram', 'tiktok'], online: true, lastInteractionDays: 13 },
  { id: 'c3', name: 'Sipho', avatarColor: 'bg-orange-700', initials: 'SM', contact: '+27 84 552 7710 / sipho.m@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 29 },
  { id: 'c4', name: 'Zanele', avatarColor: 'bg-rose-700', initials: 'ZK', contact: '+27 76 213 4490 / zanele.k@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 31 },
];

const RECENT_INQUIRIES = [
  { name: 'Lindiwe', avatarColor: 'bg-amber-700', initials: 'LD', channel: 'whatsapp' as Channel, message: "You're worn out — sent the rebooking link, let me know." },
  { name: 'Thabo', avatarColor: 'bg-zinc-800', initials: 'TN', channel: 'instagram' as Channel, message: 'We restocked the listing you asked about, want the walkthrough slot?' },
  { name: 'Sipho', avatarColor: 'bg-orange-700', initials: 'SM', channel: 'tiktok' as Channel, message: 'Hn... yeah Saturday afternoon works for the fade.' },
];

const SEGMENTS = ['VIP Customers', 'New This Month', 'Needs Follow-Up'];

const TOP_BOOKING_CLIENTS = [
  { name: 'Lindiwe', count: 16 },
  { name: 'Sipho', count: 14 },
  { name: 'Thabo', count: 5 },
];

const TABS = ['All Customers', 'Channels & DMs', 'Team Members', 'Workflows & Plugins', 'Calendars & Sync', 'Billing & Plan'];

/* ---------------------------------------------------------------- */
/* Component                                                          */
/* ---------------------------------------------------------------- */

export default function ChatsContent() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tagInput, setTagInput] = useState('');

  const filtered = useMemo(
    () => CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map(c => c.id)) : new Set());
  }
  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-sky-50 to-blue-50 px-6 py-5 flex items-center gap-5">
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition">
              <Download size={13} /> Export
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition">
              <UserPlus size={13} /> Add Customer
            </button>
          </div>
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-sky-100 flex items-center justify-center">
              <ArrowUpRight size={20} className="text-sky-600" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Manage and Segment Your &lsquo;dock&rsquo; Customer Base.</h1>
            <p className="text-sm text-zinc-600 mt-0.5">View profiles and interaction history, Lindiwe.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200">
          <nav className="flex gap-6 overflow-x-auto scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-shrink-0 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab ? 'text-blue-700' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {tab}
                {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full h-9 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-blue-400 transition"
            />
          </div>
          <button className="h-9 rounded-lg bg-zinc-100 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition">
            Recent DM Inquiries
          </button>
          <button className="h-9 rounded-lg bg-zinc-100 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition">
            Frequent Bookers
          </button>
          <div className="flex-1" />
          <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition">
            <Filter size={14} />
          </button>
          <button className="h-9 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition">
            Segment <ChevronDown size={13} />
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="w-10 py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={e => toggleAll(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="py-3 pl-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Profile Pic</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Customer Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Contact Info</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Channel DMs</th>
                <th className="py-3 px-4 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Last Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleOne(c.id)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                  </td>
                  <td className="py-3 pl-2 pr-4">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white ${c.avatarColor}`}>
                      {c.initials}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-900">{c.name}</td>
                  <td className="py-3 px-4 text-zinc-500 text-xs">{c.contact}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {c.channels.map(ch => <span key={ch}>{CHANNEL_ICON[ch]({ size: 20 })}</span>)}
                      {c.online && <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 pr-6 text-zinc-500 text-xs">{c.lastInteractionDays}. days ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent DM Inquiries */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Recent DM Inquiries</h3>
            <p className="text-[11px] text-zinc-400 mb-3">Last Message</p>
            <div className="space-y-3">
              {RECENT_INQUIRIES.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white ${item.avatarColor}`}>
                      {item.initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1">{CHANNEL_ICON[item.channel]({ size: 15 })}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900">{item.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">Last message: {item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Segment & Tag */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Segment & Tag</h3>
            <p className="text-[11px] text-zinc-400 mb-3">Tag to</p>
            <div className="relative mb-4">
              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Tag customer..."
                className="w-full h-9 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-blue-400 transition"
              />
            </div>
            <p className="text-[11px] text-zinc-400 mb-2">Predefined Segments</p>
            <div className="space-y-2">
              {SEGMENTS.map(seg => (
                <button key={seg} className="w-full flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition">
                  {seg} <ChevronRight size={14} className="text-zinc-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Customer Insights</h3>
            <p className="text-[11px] text-zinc-400">New Customers (Last 30 Days)</p>
            <p className="text-3xl font-bold text-zinc-900 mt-1 mb-4">13</p>
            <p className="text-[11px] text-zinc-400 mb-2">Top Booking Clients</p>
            <div className="space-y-2">
              {TOP_BOOKING_CLIENTS.map(client => (
                <div key={client.name} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-700 font-medium">{client.name}</span>
                  <span className="text-zinc-900 font-semibold">{client.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
