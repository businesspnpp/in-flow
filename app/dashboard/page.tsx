'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/supabase';
import BusinessSettings from '@/components/BusinessSettings';
import FastInvoice from '@/components/plugins/FastInvoice';
import BookedIt from '@/components/plugins/BookedIt';
import QuoteCraft from '@/components/plugins/QuoteCraft';
import MenuDrop from '@/components/plugins/MenuDrop';
import PinTracker from '@/components/plugins/PinTracker';
import PayNow from '@/components/plugins/PayNow';
import ReviewLink from '@/components/plugins/ReviewLink';
import PromoBlast from '@/components/plugins/PromoBlast';
import {
  ArrowLeft,
  ArrowRight,
  LogOut,
  MessageSquare,
  Settings,
  Zap,
  Search,
  Phone,
  Star,
  MoreHorizontal,
  Hash,
  Users,
  Inbox,
  Paperclip,
  Smile,
  CheckCheck,
  FileText,
  CalendarCheck,
  Wrench,
  UtensilsCrossed,
  Calculator,
  ShoppingBag,
  MapPin,
  CreditCard,
  Megaphone,
  LayoutList,
  LayoutGrid,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  sender: 'business' | 'customer';
  body: string;
  created_at: string;
};

type GlobalTab = 'chats' | 'tools' | 'settings';

type ToolId =
  | 'invoice'
  | 'booked'
  | 'quote'
  | 'menu'
  | 'pin'
  | 'paynow'
  | 'review'
  | 'promo'
  | 'settings';

// Shape of what the AI extraction route returns
interface AiExtraction {
  tool: ToolId | null;
  prefill: Record<string, unknown>;
  confidence: number;
  extraction?: {
    detectedIntent?: 'invoice' | 'booking' | 'quote' | 'promo' | 'none' | string;
  };
}

type InflowTransaction = {
  id: string;
  created_at: string;
  status: 'paid' | 'pending' | 'failed' | 'draft' | 'sent' | 'overdue' | 'cancelled' | string;
  total: number;
  currency: string;
  type: 'invoice' | 'quote' | string;
  reference: string;
};

// ─── Tool registry ────────────────────────────────────────────────────────────

const ALL_TOOLS: {
  id: ToolId;
  label: string;
  Icon: LucideIcon;
  color: string;
  desc: string;
}[] = [
  { id: 'invoice',  label: 'Invoice',  Icon: FileText,        color: 'bg-violet-500',  desc: 'Generate & send invoice' },
  { id: 'booked',   label: 'Booked',   Icon: CalendarCheck,   color: 'bg-emerald-500', desc: 'Schedule appointment' },
  { id: 'quote',    label: 'Quote',    Icon: Calculator,      color: 'bg-amber-500',   desc: 'Send price estimate' },
  { id: 'menu',     label: 'Menu',     Icon: ShoppingBag,     color: 'bg-rose-500',    desc: 'Share product menu' },
  { id: 'pin',      label: 'Pin',      Icon: MapPin,          color: 'bg-sky-500',     desc: 'Send location pin' },
  { id: 'paynow',   label: 'PayNow',   Icon: CreditCard,      color: 'bg-blue-500',    desc: 'Send secure payment link' },
  { id: 'review',   label: 'Review',   Icon: Star,            color: 'bg-yellow-500',  desc: 'Request Google review' },
  { id: 'promo',    label: 'Promo',    Icon: Megaphone,       color: 'bg-pink-500',    desc: 'Send promo & voucher' },
  { id: 'settings', label: 'Settings', Icon: Settings,        color: 'bg-slate-500',   desc: 'Channel & account settings' },
];

// Legacy quick-action pills (no AI pre-fill needed — these are one-tap sends)
const TOOL_ACTIONS = [
  { label: 'Invoice',  Icon: FileText,        color: 'bg-violet-500',  text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.' },
  { label: 'BookedIt', Icon: CalendarCheck,   color: 'bg-emerald-500', text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!' },
  { label: 'Quote',    Icon: Wrench,          color: 'bg-amber-500',   text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00' },
  { label: 'Menu',     Icon: UtensilsCrossed, color: 'bg-rose-500',    text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.' },
];

// ─── Channel helpers ──────────────────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp:  'bg-emerald-500',
  Instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400',
  Email:     'bg-blue-500',
  SMS:       'bg-slate-500',
};

const CHANNEL_DOT: Record<string, string> = {
  WhatsApp:  'bg-emerald-400',
  Instagram: 'bg-pink-500',
  Email:     'bg-blue-400',
  SMS:       'bg-slate-400',
};

// ─── Mock contacts ────────────────────────────────────────────────────────────

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
    tagColor: 'bg-emerald-500/15 text-emerald-400',
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
    tagColor: 'bg-rose-500/15 text-rose-400',
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
    tagColor: 'bg-violet-500/15 text-violet-400',
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

const INITIAL_MESSAGES_BY_CONTACT: Record<string, Message[]> = {
  c1: initialMessages,
  c2: [
    {
      id: 'm-2-1',
      sender: 'customer',
      body: 'Can you send me a quote for a premium package this week?',
      created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    },
  ],
  c3: [
    {
      id: 'm-3-1',
      sender: 'customer',
      body: 'Please email invoice options for my renewal plan.',
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
  ],
  c4: [
    {
      id: 'm-4-1',
      sender: 'customer',
      body: 'Thanks, can we lock in that appointment tomorrow?',
      created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
  ],
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [loadingSession, setLoadingSession]   = useState(true);
  const [globalTab, setGlobalTab]             = useState<GlobalTab>('chats');
  const [activeContact, setActiveContact]     = useState<string | null>(null);
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>(INITIAL_MESSAGES_BY_CONTACT);
  const [input, setInput]                     = useState('');
  const [isSigningOut, setIsSigningOut]       = useState(false);
  const [business, setBusiness]               = useState<Business | null>(null);
  const [search, setSearch]                   = useState('');
  const [toolViewMode, setToolViewMode]       = useState<'list' | 'tabs'>('list');
  const [activeToolId, setActiveToolId]       = useState<ToolId | null>(null);

  // AI pre-fill state
  const [aiLoading, setAiLoading]             = useState(false);
  const [aiExtraction, setAiExtraction]       = useState<AiExtraction | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<InflowTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showMobileIntel, setShowMobileIntel] = useState(false);

  const bottomRef  = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  const selectedContact = MOCK_CONTACTS.find((c) => c.id === activeContact);
  const currentMessages = useMemo(() => {
    if (!activeContact) return [];
    return messagesByContact[activeContact] ?? [];
  }, [activeContact, messagesByContact]);

  const aiDetectedIntent = useMemo<'booking' | 'invoice' | 'quote' | 'promo' | 'none'>(() => {
    const extractionIntent = aiExtraction?.extraction?.detectedIntent;
    if (extractionIntent === 'booking' || extractionIntent === 'invoice' || extractionIntent === 'quote' || extractionIntent === 'promo') {
      return extractionIntent;
    }

    if (aiExtraction?.tool === 'booked') return 'booking';
    if (aiExtraction?.tool === 'invoice') return 'invoice';
    if (aiExtraction?.tool === 'quote') return 'quote';
    if (aiExtraction?.tool === 'promo') return 'promo';

    return 'none';
  }, [aiExtraction]);

  const aiConfidencePercent = useMemo(() => {
    return Math.max(0, Math.min(99, Math.round((aiExtraction?.confidence ?? 0) * 100)));
  }, [aiExtraction]);

  const customerLtv = useMemo(() => {
    return customerTransactions.reduce((sum, transaction) => sum + Number(transaction.total || 0), 0);
  }, [customerTransactions]);

  const customerOrderVolume = useMemo(() => customerTransactions.length, [customerTransactions]);

  const customerStatusLabel = useMemo(() => {
    if (customerOrderVolume === 0) return 'New Lead';
    if (customerOrderVolume === 1) return 'First-Time Buyer';
    return 'Repeat Client';
  }, [customerOrderVolume]);

  const loyalty = useMemo(() => {
    if (customerLtv < 500) {
      return {
        tier: 'Starter',
        nextTier: 'Growth',
        currentTarget: 500,
        progress: Math.round((customerLtv / 500) * 100),
      };
    }

    if (customerLtv < 2500) {
      return {
        tier: 'Growth',
        nextTier: 'Elite',
        currentTarget: 2500,
        progress: Math.round((customerLtv / 2500) * 100),
      };
    }

    return {
      tier: 'Elite',
      nextTier: 'Elite+',
      currentTarget: customerLtv,
      progress: 100,
    };
  }, [customerLtv]);

  useEffect(() => {
    async function loadCustomerTransactions() {
      if (!activeContact || !selectedContact) {
        setCustomerTransactions([]);
        return;
      }

      setTxLoading(true);

      try {
        let query = supabase
          .from('inflow_invoices')
          .select('id, created_at, status, total, currency, type, reference')
          .order('created_at', { ascending: false })
          .limit(5);

        // This dashboard currently uses contact IDs from mock data; customer_name
        // matching is reliable across uuid/non-uuid schemas.
        query = query.eq('customer_name', selectedContact.name);

        const { data, error } = await query;
        if (error) {
          setCustomerTransactions([]);
          setTxLoading(false);
          return;
        }

        setCustomerTransactions((data ?? []) as InflowTransaction[]);
      } catch {
        setCustomerTransactions([]);
      } finally {
        setTxLoading(false);
      }
    }

    loadCustomerTransactions();
  }, [activeContact, selectedContact]);

  useEffect(() => {
    if (!activeContact || globalTab !== 'chats') {
      setShowMobileIntel(false);
    }
  }, [activeContact, globalTab]);

  useEffect(() => {
    if (!activeContact) return;
    setMessagesByContact((prev) => {
      if (prev[activeContact]) return prev;
      return { ...prev, [activeContact]: [] };
    });
  }, [activeContact]);

  // ── Auth ──
  useEffect(() => {
    async function verifyAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data: businessData } = await supabase.from('businesses').select('*').single();
      if (businessData) setBusiness(businessData);
      setLoadingSession(false);
    }
    verifyAuth();
  }, [router]);

  // ── Scroll ──
  function scrollToBottom() {
    window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  // ── Messaging ──
  function appendMessage(
    text: string,
    sender: 'business' | 'customer' = 'business',
    contactId: string | null = activeContact
  ) {
    if (!contactId) return;

    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] ?? []),
        { id: `m-${Date.now()}`, sender, body: text, created_at: new Date().toISOString() },
      ],
    }));

    if (contactId === activeContact) {
      scrollToBottom();
    }
  }

  function getAutoReply(outgoing: string) {
    const n = outgoing.toLowerCase();
    if (/(hello|hi|details)/.test(n))          return 'Awesome, thank you! Do you have a free slot available this Tuesday afternoon?';
    if (/(booking|scheduled|confirmed)/.test(n)) return 'Perfect! 16:00 on Tuesday works beautifully for me. See you then!';
    if (/(invoice|payment|r250)/.test(n))       return "Got the summary, thank you! I'll see you on Tuesday and settle up right after.";
    return 'Sounds good, thanks for confirming! Let me know what the next steps are.';
  }

  function scheduleAutoReply(outgoing: string, contactId: string) {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    const reply = getAutoReply(outgoing);
    replyTimer.current = window.setTimeout(() => {
      appendMessage(reply, 'customer', contactId);
      replyTimer.current = null;
    }, 4000);
  }

  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  function handleSend() {
    if (!activeContact) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'business', activeContact);
    setInput('');
    scheduleAutoReply(trimmed, activeContact);
  }

  function handleToolAction(text: string) {
    if (activeContact) {
      appendMessage(text, 'business', activeContact);
      scheduleAutoReply(text, activeContact);
    }
  }

  // ── AI Pre-fill ──────────────────────────────────────────────────────────────
  // Reads the current conversation thread and asks the AI which tool to open
  // and what values to pre-populate.
  async function handleAiAssist() {
    if (!activeContact || currentMessages.length === 0) return;
    setAiLoading(true);
    setAiExtraction(null);

    try {
      const transcript = currentMessages
        .map((m) => `${m.sender === 'business' ? 'Business' : 'Customer'}: ${m.body}`)
        .join('\n');

      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) throw new Error('AI extraction failed');
      const data: AiExtraction = await res.json();

      setAiExtraction(data);

      // Auto-open the suggested tool and switch to Tools tab
      if (data.tool) {
        setActiveToolId(data.tool);
        setGlobalTab('tools');
      }
    } catch (err) {
      console.error('AI assist error:', err);
    } finally {
      setAiLoading(false);
    }
  }

  // ── Sign out ──
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

  // ── Plugin renderer ──────────────────────────────────────────────────────────
  // Passes aiPrefill only to the 4 tools that support it.
  const mockActiveChat = activeContact ? { id: activeContact } as any : null;

  function getPrefillForTool(id: ToolId) {
    if (!aiExtraction || aiExtraction.tool !== id) return undefined;
    return aiExtraction.prefill as any;
  }

  function renderPlugin(id: ToolId) {
    switch (id) {
      case 'invoice':
        return <FastInvoice activeChat={mockActiveChat} aiPrefill={getPrefillForTool('invoice')} />;
      case 'booked':
        return <BookedIt activeChat={mockActiveChat} aiPrefill={getPrefillForTool('booked')} />;
      case 'quote':
        return <QuoteCraft activeChat={mockActiveChat} aiPrefill={getPrefillForTool('quote')} />;
      case 'menu':
        return <MenuDrop activeChat={mockActiveChat} />;
      case 'pin':
        return <PinTracker activeChat={mockActiveChat} />;
      case 'paynow':
        return <PayNow activeChat={mockActiveChat} />;
      case 'review':
        return <ReviewLink activeChat={mockActiveChat} />;
      case 'promo':
        return <PromoBlast activeChat={mockActiveChat} aiPrefill={getPrefillForTool('promo')} />;
      case 'settings':
        return business ? (
          <BusinessSettings business={business} onUpdated={(b) => setBusiness(b)} />
        ) : (
          <p className="text-sm text-slate-500">No business profile found.</p>
        );
      default:
        return null;
    }
  }

  // ─── Loading screen ───────────────────────────────────────────────────────────

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

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-[#0f1117] text-white scrollbar-hide">
      <style>{`
        .scrollbar-hide, .scrollbar-hide * {
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar,
        .scrollbar-hide *::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>

      {/* ─── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-16 bg-[#0f1117] border-r border-white/5 items-center py-4 gap-2 z-20">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30">
          <span className="text-xs font-black text-[#0f1117] tracking-tight">iF</span>
        </div>

        {[
          { tab: 'chats'    as GlobalTab, icon: <Inbox    size={18} />, label: 'Inbox'    },
          { tab: 'tools'    as GlobalTab, icon: <Zap      size={18} />, label: 'Tools'    },
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

      {/* ─── Main panel ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ══ CHATS TAB ══════════════════════════════════════════════════════════ */}
        {globalTab === 'chats' && (
          <>
            {/* ── Conversation list ── */}
            <div
              className={`flex-shrink-0 flex flex-col bg-[#13161e] border-r border-white/5 overflow-hidden
                ${activeContact ? 'hidden md:flex' : 'flex'}
                w-full md:w-72 lg:w-80`}
            >
              {/* Header */}
              <div className="px-4 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-white tracking-tight">Inbox</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {MOCK_CONTACTS.length} conversations
                    </p>
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

                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full rounded-xl bg-white/[0.04] pl-8 pr-3 py-2 text-xs text-slate-300 placeholder:text-slate-500 outline-none focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>

                <div className="flex gap-1.5 mt-3">
                  {['All', 'Unread', 'Mine'].map((f) => (
                    <button
                      key={f}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition ${
                        f === 'All'
                          ? 'bg-amber-500 text-[#0f1117]'
                          : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
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
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.03] ${
                      activeContact === contact.id ? 'bg-white/[0.06]' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`h-10 w-10 rounded-2xl flex items-center justify-center text-[13px] font-semibold text-white ${
                          contact.channel === 'Instagram'
                            ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400'
                            : CHANNEL_COLORS[contact.channel]
                        }`}
                      >
                        {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#13161e] ${
                          contact.status === 'online'
                            ? 'bg-emerald-400'
                            : contact.status === 'away'
                            ? 'bg-amber-400'
                            : 'bg-slate-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-slate-100 truncate">{contact.name}</span>
                        <span className="text-[10px] text-slate-500 flex-shrink-0 font-medium">{contact.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate leading-snug">{contact.preview}</p>
                      {contact.tag && (
                        <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${contact.tagColor}`}>
                          {contact.tag}
                        </span>
                      )}
                    </div>

                    {contact.unread > 0 && (
                      <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-[#0f1117]">
                        {contact.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Thread view ── */}
            <div
              className={`flex-1 flex flex-col overflow-hidden bg-[#0f1117] ${
                !activeContact ? 'hidden md:flex' : 'flex'
              }`}
            >
              {!activeContact ? (
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

                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        selectedContact?.channel === 'Instagram'
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400'
                          : CHANNEL_COLORS[selectedContact?.channel || 'SMS']
                      }`}
                    >
                      {selectedContact?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{selectedContact?.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOT[selectedContact?.channel || 'SMS']}`} />
                        <p className="text-xs text-slate-500">{selectedContact?.channel}</p>
                      </div>
                    </div>

                    {/* Action icons + AI assist button */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowMobileIntel(true)}
                        title="Open Customer Intelligence"
                        className="xl:hidden flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Users size={13} />
                        Intel
                      </button>

                      {/* AI Assist — reads thread and opens correct tool with pre-fill */}
                      <button
                        onClick={handleAiAssist}
                        disabled={aiLoading}
                        title="AI Assist — auto-suggest tool from chat"
                        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                          aiLoading
                            ? 'bg-amber-500/10 text-amber-400 animate-pulse cursor-wait'
                            : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                        }`}
                      >
                        <Sparkles size={13} />
                        {aiLoading ? 'Reading…' : 'AI Assist'}
                      </button>

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

                  {/* AI suggestion banner */}
                  {aiExtraction?.tool && (
                    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
                      <Sparkles size={13} className="text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-300 flex-1">
                        AI detected a <span className="font-semibold capitalize">{aiExtraction.tool}</span> request
                        {aiExtraction.confidence >= 0.8
                          ? ' — form pre-filled, review and send.'
                          : ' — check the pre-fill before sending.'}
                      </p>
                      <button
                        onClick={() => { setActiveToolId(aiExtraction.tool!); setGlobalTab('tools'); }}
                        className="flex-shrink-0 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full hover:bg-amber-500/30 transition"
                      >
                        Open tool ↗
                      </button>
                    </div>
                  )}

                  {/* Quick tool pills */}
                  <div className="flex-shrink-0 border-b border-white/5 bg-[#13161e] overflow-x-auto scrollbar-none px-4 py-2">
                    <div className="flex gap-2 whitespace-nowrap">
                      {TOOL_ACTIONS.map((tool) => {
                        const ToolIcon = tool.Icon;
                        return (
                          <button
                            key={tool.label}
                            onClick={() => handleToolAction(tool.text)}
                            className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 transition-all"
                          >
                            <ToolIcon size={13} />
                            {tool.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Messages */}
                  <div key={activeContact ?? 'no-contact'} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">Today</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'customer' && (
                          <div
                            className={`h-7 w-7 flex-shrink-0 self-end rounded-xl flex items-center justify-center text-[10px] font-bold text-white ${
                              selectedContact?.channel === 'Instagram'
                                ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400'
                                : CHANNEL_COLORS[selectedContact?.channel || 'SMS']
                            }`}
                          >
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
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
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

            {/* ── Right Context Column (Desktop XL) ── */}
            <aside className="w-96 border-l border-zinc-800 bg-[#16161a] hidden xl:flex flex-col overflow-y-auto">
              <div className="px-5 py-4 border-b border-zinc-800">
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">Context Column</p>
                <h3 className="text-sm text-zinc-100 font-semibold mt-1">Customer Intelligence</h3>
              </div>

              {selectedContact ? (
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                  {/* CRM Meta Profile */}
                  <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-zinc-400 font-medium">{selectedContact.name}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{selectedContact.channel} Profile</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                          customerOrderVolume === 0
                            ? 'border-zinc-700 text-zinc-400 bg-zinc-900/40'
                            : customerOrderVolume === 1
                            ? 'border-amber-700 text-amber-300 bg-amber-950/30'
                            : 'border-emerald-700 text-emerald-300 bg-emerald-950/30'
                        }`}
                      >
                        {customerStatusLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-zinc-800 bg-[#16161a] p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Total Spent (LTV)</p>
                        <p className="text-lg font-semibold text-zinc-100 mt-1">
                          {new Intl.NumberFormat('en-ZA', {
                            style: 'currency',
                            currency: 'ZAR',
                            maximumFractionDigits: 2,
                          }).format(customerLtv)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-[#16161a] p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Total Order Volume</p>
                        <p className="text-lg font-semibold text-zinc-100 mt-1">{customerOrderVolume}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] text-zinc-400">Loyalty Standing</p>
                        <p className="text-[11px] text-zinc-200 font-medium">{loyalty.tier}</p>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-zinc-300 transition-all duration-500"
                          style={{ width: `${Math.max(3, loyalty.progress)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">
                        Next milestone: {loyalty.nextTier}
                        {customerLtv < 2500 ? ` at R${Math.max(0, loyalty.currentTarget - customerLtv).toFixed(2)} remaining` : ''}
                      </p>
                    </div>
                  </section>

                  {/* Transaction Snapshot */}
                  <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold text-zinc-200">5-Transaction Snapshot</h4>
                      {txLoading && <span className="text-[10px] text-zinc-500">Loading...</span>}
                    </div>

                    <div className="space-y-2.5">
                      {!txLoading && customerTransactions.length === 0 && (
                        <p className="text-[11px] text-zinc-500">No linked invoices or quotes found for this customer profile.</p>
                      )}

                      {customerTransactions.map((txn) => {
                        const status = String(txn.status || '').toLowerCase();
                        const statusClass =
                          status === 'paid'
                            ? 'border-emerald-700 text-emerald-300 bg-emerald-950/30'
                            : status === 'pending' || status === 'sent' || status === 'draft'
                            ? 'border-amber-700 text-amber-300 bg-amber-950/30'
                            : 'border-rose-700 text-rose-300 bg-rose-950/30';

                        const shortDate = new Date(txn.created_at).toLocaleDateString('en-ZA', {
                          day: '2-digit',
                          month: 'short',
                        });

                        return (
                          <div
                            key={txn.id}
                            className="grid grid-cols-[58px_1fr_auto] items-center gap-2 rounded-lg border border-zinc-800 bg-[#16161a] px-2.5 py-2"
                          >
                            <span className="text-[11px] text-zinc-400 font-medium">{shortDate}</span>
                            <div className="min-w-0 flex items-center gap-2">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusClass}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                              <span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span>
                            </div>
                            <span className="text-[12px] text-zinc-100 font-semibold">
                              {new Intl.NumberFormat('en-ZA', {
                                style: 'currency',
                                currency: txn.currency || 'ZAR',
                                maximumFractionDigits: 2,
                              }).format(Number(txn.total || 0))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* AI Diagnostics */}
                  <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                    <h4 className="text-xs font-semibold text-zinc-200 mb-2.5">AI Diagnostics</h4>

                    <div className="rounded-lg border border-zinc-800 bg-[#16161a] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Intent Indicator</p>
                      <p className="text-sm text-zinc-100 mt-1">
                        Detected Intent:{' '}
                        <span className="font-semibold">
                          {aiDetectedIntent === 'none'
                            ? 'No dominant intent'
                            : aiDetectedIntent === 'invoice'
                            ? 'Invoice Creation'
                            : aiDetectedIntent === 'booking'
                            ? 'Booking Coordination'
                            : aiDetectedIntent === 'quote'
                            ? 'Quote Generation'
                            : 'Promo Trigger'}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">Confidence: {aiConfidencePercent}%</p>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Predictive Action Pipeline</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setActiveToolId('booked');
                            setGlobalTab('tools');
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left border transition-all ${
                            aiDetectedIntent === 'booking'
                              ? 'border-emerald-500/80 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
                              : 'border-zinc-800 bg-[#16161a] hover:border-zinc-700'
                          }`}
                        >
                          <p className="text-[12px] text-zinc-100 font-medium">BookedIt Action Controller</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Elevated when booking intent probability is dominant.</p>
                        </button>

                        <button
                          onClick={() => {
                            setActiveToolId('invoice');
                            setGlobalTab('tools');
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left border transition-all ${
                            aiDetectedIntent === 'invoice'
                              ? 'border-violet-500/80 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.35)]'
                              : 'border-zinc-800 bg-[#16161a] hover:border-zinc-700'
                          }`}
                        >
                          <p className="text-[12px] text-zinc-100 font-medium">FastInvoice Action Controller</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Elevated when invoice intent probability is dominant.</p>
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center px-6 text-center">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Select an active conversation to load CRM profile analytics, transaction matrix, and AI diagnostics.
                  </p>
                </div>
              )}
            </aside>

            {/* ── Mobile/Tablet Customer Intelligence Drawer ── */}
            {showMobileIntel && selectedContact && (
              <div className="xl:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-[1px]">
                <div className="absolute inset-x-0 bottom-0 max-h-[86vh] rounded-t-2xl border-t border-zinc-800 bg-[#16161a] flex flex-col">
                  <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">Context Column</p>
                      <h3 className="text-sm text-zinc-100 font-semibold mt-1">Customer Intelligence</h3>
                    </div>
                    <button
                      onClick={() => setShowMobileIntel(false)}
                      className="h-8 w-8 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                    >
                      <X size={14} className="mx-auto" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                    {/* CRM Meta Profile */}
                    <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-zinc-400 font-medium">{selectedContact.name}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{selectedContact.channel} Profile</p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                            customerOrderVolume === 0
                              ? 'border-zinc-700 text-zinc-400 bg-zinc-900/40'
                              : customerOrderVolume === 1
                              ? 'border-amber-700 text-amber-300 bg-amber-950/30'
                              : 'border-emerald-700 text-emerald-300 bg-emerald-950/30'
                          }`}
                        >
                          {customerStatusLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-zinc-800 bg-[#16161a] p-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Total Spent (LTV)</p>
                          <p className="text-lg font-semibold text-zinc-100 mt-1">
                            {new Intl.NumberFormat('en-ZA', {
                              style: 'currency',
                              currency: 'ZAR',
                              maximumFractionDigits: 2,
                            }).format(customerLtv)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-[#16161a] p-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Total Order Volume</p>
                          <p className="text-lg font-semibold text-zinc-100 mt-1">{customerOrderVolume}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[11px] text-zinc-400">Loyalty Standing</p>
                          <p className="text-[11px] text-zinc-200 font-medium">{loyalty.tier}</p>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-zinc-300 transition-all duration-500"
                            style={{ width: `${Math.max(3, loyalty.progress)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2">
                          Next milestone: {loyalty.nextTier}
                          {customerLtv < 2500 ? ` at R${Math.max(0, loyalty.currentTarget - customerLtv).toFixed(2)} remaining` : ''}
                        </p>
                      </div>
                    </section>

                    {/* Transaction Snapshot */}
                    <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-zinc-200">5-Transaction Snapshot</h4>
                        {txLoading && <span className="text-[10px] text-zinc-500">Loading...</span>}
                      </div>

                      <div className="space-y-2.5">
                        {!txLoading && customerTransactions.length === 0 && (
                          <p className="text-[11px] text-zinc-500">No linked invoices or quotes found for this customer profile.</p>
                        )}

                        {customerTransactions.map((txn) => {
                          const status = String(txn.status || '').toLowerCase();
                          const statusClass =
                            status === 'paid'
                              ? 'border-emerald-700 text-emerald-300 bg-emerald-950/30'
                              : status === 'pending' || status === 'sent' || status === 'draft'
                              ? 'border-amber-700 text-amber-300 bg-amber-950/30'
                              : 'border-rose-700 text-rose-300 bg-rose-950/30';

                          const shortDate = new Date(txn.created_at).toLocaleDateString('en-ZA', {
                            day: '2-digit',
                            month: 'short',
                          });

                          return (
                            <div
                              key={txn.id}
                              className="grid grid-cols-[58px_1fr_auto] items-center gap-2 rounded-lg border border-zinc-800 bg-[#16161a] px-2.5 py-2"
                            >
                              <span className="text-[11px] text-zinc-400 font-medium">{shortDate}</span>
                              <div className="min-w-0 flex items-center gap-2">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusClass}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                                <span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span>
                              </div>
                              <span className="text-[12px] text-zinc-100 font-semibold">
                                {new Intl.NumberFormat('en-ZA', {
                                  style: 'currency',
                                  currency: txn.currency || 'ZAR',
                                  maximumFractionDigits: 2,
                                }).format(Number(txn.total || 0))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* AI Diagnostics */}
                    <section className="rounded-xl border border-zinc-800 bg-[#121214] p-4">
                      <h4 className="text-xs font-semibold text-zinc-200 mb-2.5">AI Diagnostics</h4>

                      <div className="rounded-lg border border-zinc-800 bg-[#16161a] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Intent Indicator</p>
                        <p className="text-sm text-zinc-100 mt-1">
                          Detected Intent:{' '}
                          <span className="font-semibold">
                            {aiDetectedIntent === 'none'
                              ? 'No dominant intent'
                              : aiDetectedIntent === 'invoice'
                              ? 'Invoice Creation'
                              : aiDetectedIntent === 'booking'
                              ? 'Booking Coordination'
                              : aiDetectedIntent === 'quote'
                              ? 'Quote Generation'
                              : 'Promo Trigger'}
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-1">Confidence: {aiConfidencePercent}%</p>
                      </div>

                      <div className="mt-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Predictive Action Pipeline</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setShowMobileIntel(false);
                              setActiveToolId('booked');
                              setGlobalTab('tools');
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left border transition-all ${
                              aiDetectedIntent === 'booking'
                                ? 'border-emerald-500/80 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
                                : 'border-zinc-800 bg-[#16161a] hover:border-zinc-700'
                            }`}
                          >
                            <p className="text-[12px] text-zinc-100 font-medium">BookedIt Action Controller</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Elevated when booking intent probability is dominant.</p>
                          </button>

                          <button
                            onClick={() => {
                              setShowMobileIntel(false);
                              setActiveToolId('invoice');
                              setGlobalTab('tools');
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left border transition-all ${
                              aiDetectedIntent === 'invoice'
                                ? 'border-violet-500/80 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.35)]'
                                : 'border-zinc-800 bg-[#16161a] hover:border-zinc-700'
                            }`}
                          >
                            <p className="text-[12px] text-zinc-100 font-medium">FastInvoice Action Controller</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Elevated when invoice intent probability is dominant.</p>
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <button
                  className="absolute inset-0 -z-10"
                  aria-label="Close intelligence panel"
                  onClick={() => setShowMobileIntel(false)}
                />
              </div>
            )}
          </>
        )}

        {/* ══ TOOLS TAB ══════════════════════════════════════════════════════════ */}
        {globalTab === 'tools' && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f1117]">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

            {/* ── TAB MODE ── */}
            {toolViewMode === 'tabs' && (
              <>
                <div className="relative border border-white/[0.06] rounded-2xl bg-[#13161e] overflow-hidden mb-4">
                  <div className="flex items-center">
                    <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex flex-row items-center gap-1 px-2 py-2">
                      {ALL_TOOLS.map(({ id, Icon, label }) => (
                        <button
                          key={id}
                          onClick={() => setActiveToolId(id)}
                          className={`flex-shrink-0 inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 min-h-[44px] rounded-xl transition-colors ${
                            activeToolId === id
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                          {/* AI indicator dot */}
                          {aiExtraction?.tool === id && (
                            <span className="block h-1 w-1 rounded-full bg-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setToolViewMode('list'); setActiveToolId(null); }}
                      className="flex-shrink-0 p-2.5 mr-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                      title="Switch to list view"
                    >
                      <LayoutList size={16} />
                    </button>
                  </div>
                  <div
                    className="pointer-events-none absolute top-0 right-10 h-full w-8"
                    style={{ background: 'linear-gradient(to left, #13161e, transparent)' }}
                  />
                </div>

                <div className="pb-24">
                  {activeToolId === null ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center py-20 rounded-2xl border border-white/[0.06] bg-[#13161e]">
                      <LayoutGrid size={28} className="text-slate-700" />
                      <p className="text-sm text-slate-600">Select a tab above to open a tool</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                      <div className="rounded-2xl border border-zinc-800 bg-[#16161a] p-4 md:col-span-2 lg:col-span-2">
                        {renderPlugin(activeToolId)}
                      </div>
                      <div className="rounded-2xl border border-zinc-800 bg-[#16161a] p-4">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-500">Tool Context</p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Active module: <span className="font-semibold text-zinc-100">{ALL_TOOLS.find((tool) => tool.id === activeToolId)?.label}</span>
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                          Desktop mode allocates dedicated workspace depth to avoid compressed mobile-style rendering on wide screens.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── LIST MODE ── */}
            {toolViewMode === 'list' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 border border-white/[0.06] rounded-2xl bg-[#13161e] mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Tools</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Tap to open</p>
                  </div>
                  <button
                    onClick={() => setToolViewMode('tabs')}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                    title="Switch to tab view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>

                <div className="pb-24">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {ALL_TOOLS.map(({ id, Icon, label, color, desc }) => {
                      const isOpen = activeToolId === id;
                      const hasAi  = aiExtraction?.tool === id;
                      return (
                        <div key={id} className={`rounded-2xl border ${isOpen ? 'border-amber-500/30' : 'border-zinc-800'} bg-[#16161a] overflow-hidden`}>
                          <button
                            onClick={() => setActiveToolId(isOpen ? null : id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                              isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <div className={`relative flex-shrink-0 h-9 w-9 rounded-xl ${color} flex items-center justify-center`}>
                              <Icon size={16} className="text-white" strokeWidth={2.25} />
                              {/* AI pre-fill indicator */}
                              {hasAi && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-[#0f1117] flex items-center justify-center">
                                  <Sparkles size={6} className="text-[#0f1117]" />
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-amber-400' : 'text-slate-200'}`}>
                                  {label}
                                </p>
                                {hasAi && (
                                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                                    AI ready
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5">{desc}</p>
                            </div>
                            <svg
                              className={`flex-shrink-0 transition-transform duration-200 text-slate-600 ${isOpen ? 'rotate-90' : ''}`}
                              width="16" height="16" viewBox="0 0 16 16" fill="none"
                            >
                              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {isOpen && (
                            <div className="px-4 py-4 bg-[#121214] border-t border-zinc-800">
                              {renderPlugin(id)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!activeContact && (
                    <div className="mt-3 flex items-start gap-2.5 px-4">
                      <span className="text-amber-500 text-xs mt-0.5">↑</span>
                      <p className="text-xs text-slate-600">
                        Open a conversation in Inbox first — actions will send directly into that chat.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          </div>
        )}

        {/* ══ SETTINGS TAB ═══════════════════════════════════════════════════════ */}
        {globalTab === 'settings' && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f1117]">
            <div className="px-4 py-6 md:py-8 md:px-6 max-w-6xl mx-auto w-full">
              <div className="md:flex md:gap-8 w-full">
                <aside className="md:w-64 flex flex-col gap-2 text-zinc-400 mb-5 md:mb-0">
                  {['Business Info', 'Connected Channels', 'Billing', 'Team Security'].map((item, index) => (
                    <button
                      key={item}
                      className={`w-full text-left rounded-xl px-3 py-2.5 text-sm border transition ${
                        index === 1
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : 'border-zinc-800 bg-[#16161a] hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </aside>

                <section className="flex-1 bg-[#16161a] border border-zinc-800 p-4 md:p-8 rounded-xl min-w-0">
                  {business ? (
                    <BusinessSettings business={business} onUpdated={(updated) => setBusiness(updated)} />
                  ) : (
                    <p className="text-sm text-slate-500">Loading business profile…</p>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom nav (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#13161e]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { tab: 'chats'    as GlobalTab, icon: <Inbox    size={20} />, label: 'Inbox'    },
            { tab: 'tools'    as GlobalTab, icon: <Zap      size={20} />, label: 'Tools'    },
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
