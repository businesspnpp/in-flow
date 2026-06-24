'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/supabase';
import BusinessSettings from '@/components/BusinessSettings';
import {
  ArrowLeft,
  ArrowRight,
  LogOut,
  MessageSquare,
  Settings,
  Zap,
  Search,
  Phone,
  Mail,
  Star,
  MoreHorizontal,
  Hash,
  Users,
  Inbox,
  ChevronDown,
  Paperclip,
  Smile,
  CheckCheck,
  Circle,
} from 'lucide-react';

type Message = {
  id: string;
  sender: 'business' | 'customer';
  body: string;
  created_at: string;
};

type GlobalTab = 'chats' | 'tools' | 'settings';

const TOOL_ACTIONS = [
  {
    label: 'Invoice',
    emoji: '📄',
    color: 'bg-violet-500',
    text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.',
    desc: 'Generate & send invoice',
  },
  {
    label: 'BookedIt',
    emoji: '📅',
    color: 'bg-emerald-500',
    text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!',
    desc: 'Schedule appointment',
  },
  {
    label: 'Quote',
    emoji: '🛠️',
    color: 'bg-amber-500',
    text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00',
    desc: 'Send price estimate',
  },
  {
    label: 'Menu',
    emoji: '🍔',
    color: 'bg-rose-500',
    text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.',
    desc: 'Share product menu',
  },
];

const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp: 'bg-emerald-500',
  Instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400',
  Email: 'bg-blue-500',
  SMS: 'bg-slate-500',
};

const CHANNEL_DOT: Record<string, string> = {
  WhatsApp: 'bg-emerald-400',
  Instagram: 'bg-pink-500',
  Email: 'bg-blue-400',
  SMS: 'bg-slate-400',
};

const MOCK_CONTACTS = [
  {
    id: 'c1',
    name: 'Customer One',
    channel: 'WhatsApp',
    preview: "I'd like to book an appointment this week…",
    time: 'Now',
    unread: 1,
    status: 'online',
    tag: 'New lead',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'c2',
    name: 'Thabo Nkosi',
    channel: 'Instagram',
    preview: 'Interested in the property you advertised…',
    time: '2m',
    unread: 3,
    status: 'away',
    tag: 'Urgent',
    tagColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'c3',
    name: 'Priya Maharaj',
    channel: 'Email',
    preview: 'My fixed term mortgage is up for renewal…',
    time: '14m',
    unread: 0,
    status: 'offline',
    tag: 'Sales',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'c4',
    name: 'James Okafor',
    channel: 'SMS',
    preview: 'Thanks for the quick response!',
    time: '1h',
    unread: 0,
    status: 'offline',
    tag: '',
    tagColor: '',
  },
];

const initialMessages: Message[] = [
  {
    id: 'm-1',
    sender: 'customer',
    body: "Hi! I'd like to book an appointment for a hair wash, treatment, and styling this week if you have any openings?",
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [loadingSession, setLoadingSession] = useState(true);
  const [globalTab, setGlobalTab] = useState<GlobalTab>('chats');
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  const selectedContact = MOCK_CONTACTS.find((c) => c.id === activeContact);

  useEffect(() => {
    async function verifyAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .single();
      if (businessData) setBusiness(businessData);
      setLoadingSession(false);
    }
    verifyAuth();
  }, [router]);

  function scrollToBottom() {
    window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function appendMessage(text: string, sender: 'business' | 'customer' = 'business') {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender,
        body: text,
        created_at: new Date().toISOString(),
      },
    ]);
    scrollToBottom();
  }

  function getAutoReply(outgoing: string) {
    const n = outgoing.toLowerCase();
    if (/(hello|hi|details)/.test(n)) return 'Awesome, thank you! Do you have a free slot available this Tuesday afternoon?';
    if (/(booking|scheduled|confirmed)/.test(n)) return 'Perfect! 16:00 on Tuesday works beautifully for me. See you then!';
    if (/(invoice|payment|r250)/.test(n)) return "Got the summary, thank you! I'll see you on Tuesday and settle up right after.";
    return 'Sounds good, thanks for confirming! Let me know what the next steps are.';
  }

  function scheduleAutoReply(outgoing: string) {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    const reply = getAutoReply(outgoing);
    replyTimer.current = window.setTimeout(() => {
      appendMessage(reply, 'customer');
      replyTimer.current = null;
    }, 4000);
  }

  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'business');
    setInput('');
    scheduleAutoReply(trimmed);
  }

  function handleToolAction(text: string) {
    if (activeContact) {
      appendMessage(text, 'business');
      scheduleAutoReply(text);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
      setIsSigningOut(false);
      alert('Failed to sign out. Please try again.');
    }
  }

  if (loadingSession) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0f1117]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 tracking-wide">Loading inFlow…</p>
        </div>
      </div>
    );
  }

  const filteredContacts = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-[#0f1117] text-white">

      {/* ─── Sidebar (desktop) ─── */}
      <aside className="hidden md:flex flex-col w-16 bg-[#0f1117] border-r border-white/5 items-center py-4 gap-2 z-20">
        {/* Logo mark */}
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30">
          <span className="text-xs font-black text-[#0f1117] tracking-tight">iF</span>
        </div>

        {/* Nav icons */}
        {[
          { tab: 'chats' as GlobalTab, icon: <Inbox size={18} />, label: 'Inbox' },
          { tab: 'tools' as GlobalTab, icon: <Zap size={18} />, label: 'Tools' },
          { tab: 'settings' as GlobalTab, icon: <Settings size={18} />, label: 'Settings' },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setGlobalTab(tab)}
            title={label}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              globalTab === tab
                ? 'bg-amber-500/15 text-amber-400'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            {icon}
            {globalTab === tab && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-amber-400" />
            )}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-rose-500/10 hover:text-rose-400 transition-all disabled:opacity-40"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* ─── Main Panel ─── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Chats Tab */}
        {globalTab === 'chats' && (
          <>
            {/* ── Conversation List ── */}
            <div
              className={`flex-shrink-0 flex flex-col bg-[#13161e] border-r border-white/5 overflow-hidden
                ${activeContact ? 'hidden md:flex' : 'flex'}
                w-full md:w-72 lg:w-80`}
            >
              {/* List header */}
              <div className="px-4 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Inbox</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{MOCK_CONTACTS.length} conversations</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                      <Hash size={14} />
                    </button>
                    <button className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                      <Users size={14} />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full rounded-xl bg-white/5 pl-8 pr-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5 mt-3">
                  {['All', 'Unread', 'Mine'].map((f) => (
                    <button
                      key={f}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                        f === 'All'
                          ? 'bg-amber-500 text-[#0f1117]'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact list */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContact(contact.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-white/5 ${
                      activeContact === contact.id ? 'bg-white/[0.07]' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white ${contact.channel === 'Instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400' : CHANNEL_COLORS[contact.channel]}`}>
                        {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#13161e] ${
                        contact.status === 'online' ? 'bg-emerald-400' : contact.status === 'away' ? 'bg-amber-400' : 'bg-slate-600'
                      }`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white truncate">{contact.name}</span>
                        <span className="text-[10px] text-slate-500 flex-shrink-0">{contact.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${CHANNEL_DOT[contact.channel]}`} />
                        <p className="text-xs text-slate-500 truncate">{contact.preview}</p>
                      </div>
                      {contact.tag && (
                        <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${contact.tagColor}`}>
                          {contact.tag}
                        </span>
                      )}
                    </div>

                    {/* Unread badge */}
                    {contact.unread > 0 && (
                      <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-[#0f1117]">
                        {contact.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Thread View ── */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-[#0f1117] ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
              {!activeContact ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center">
                    <MessageSquare size={28} className="text-slate-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">Select a conversation</p>
                    <p className="text-xs text-slate-600 mt-1">Choose from the list to start replying</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#13161e]">
                    <button
                      onClick={() => setActiveContact(null)}
                      className="md:hidden flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    {/* Avatar */}
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${selectedContact?.channel === 'Instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400' : CHANNEL_COLORS[selectedContact?.channel || 'SMS']}`}>
                      {selectedContact?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{selectedContact?.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOT[selectedContact?.channel || 'SMS']}`} />
                        <p className="text-xs text-slate-500">{selectedContact?.channel}</p>
                      </div>
                    </div>

                    {/* Action icons */}
                    <div className="flex items-center gap-1">
                      <button className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                        <Phone size={15} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                        <Star size={15} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Quick tool pills */}
                  <div className="flex-shrink-0 border-b border-white/5 bg-[#13161e] overflow-x-auto scrollbar-none px-4 py-2">
                    <div className="flex gap-2 whitespace-nowrap">
                      {TOOL_ACTIONS.map((tool) => (
                        <button
                          key={tool.label}
                          onClick={() => handleToolAction(tool.text)}
                          className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 transition-all"
                        >
                          <span>{tool.emoji}</span>
                          {tool.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                    {/* Date divider */}
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">Today</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'customer' && (
                          <div className={`h-7 w-7 flex-shrink-0 self-end rounded-xl flex items-center justify-center text-[10px] font-bold text-white ${selectedContact?.channel === 'Instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400' : CHANNEL_COLORS[selectedContact?.channel || 'SMS']}`}>
                            {selectedContact?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className={`max-w-[75%] flex flex-col gap-1 ${message.sender === 'business' ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              message.sender === 'business'
                                ? 'rounded-br-sm bg-amber-500 text-[#0f1117] font-medium'
                                : 'rounded-bl-sm bg-white/8 text-slate-200 border border-white/5'
                            }`}
                          >
                            {message.body}
                          </div>
                          <div className={`flex items-center gap-1 ${message.sender === 'business' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-slate-600">
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.sender === 'business' && (
                              <CheckCheck size={12} className="text-amber-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input bar */}
                  <div className="flex-shrink-0 border-t border-white/5 bg-[#13161e] px-4 py-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-2xl px-3 py-2 focus-within:border-amber-500/40 focus-within:bg-white/7 transition-all">
                      <button className="text-slate-600 hover:text-slate-400 transition flex-shrink-0">
                        <Paperclip size={16} />
                      </button>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                      />
                      <button className="text-slate-600 hover:text-slate-400 transition flex-shrink-0">
                        <Smile size={16} />
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-[#0f1117] transition hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── Tools Tab ─── */}
        {globalTab === 'tools' && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-8 max-w-2xl">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                <p className="mt-1 text-sm text-slate-500">Send rich messages into any active conversation.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {TOOL_ACTIONS.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => handleToolAction(tool.text)}
                    className="group rounded-2xl border border-white/8 bg-white/[0.04] p-5 text-left hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tool.color} shadow-lg text-xl`}>
                      {tool.emoji}
                    </div>
                    <p className="font-semibold text-white group-hover:text-amber-300 transition-colors">{tool.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{tool.desc}</p>
                  </button>
                ))}
              </div>

              {!activeContact && (
                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                  <p className="text-xs text-amber-400">
                    💡 Open a conversation first, then actions will send directly into that chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Settings Tab ─── */}
        {globalTab === 'settings' && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 max-w-2xl">
              {business ? (
                <BusinessSettings
                  business={business}
                  onUpdated={(updated) => setBusiness(updated)}
                />
              ) : (
                <p className="text-sm text-slate-500">Loading business profile…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom nav (mobile) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#13161e]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { tab: 'chats' as GlobalTab, icon: <Inbox size={20} />, label: 'Inbox' },
            { tab: 'tools' as GlobalTab, icon: <Zap size={20} />, label: 'Tools' },
            { tab: 'settings' as GlobalTab, icon: <Settings size={20} />, label: 'Settings' },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => { setGlobalTab(tab); if (tab !== 'chats') setActiveContact(null); }}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${
                globalTab === tab
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl text-slate-600 hover:text-rose-400 transition-all disabled:opacity-40"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Out</span>
          </button>
        </div>
      </nav>

      {/* Bottom nav spacer on mobile */}
      <div className="md:hidden h-16 flex-shrink-0" />
    </div>
  );
}
