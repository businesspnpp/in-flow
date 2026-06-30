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
import { isMissingTableError } from '@/lib/inflow-client';
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

type MockConversationMessage = {
  sender: 'business' | 'customer';
  time: string;
  text: string;
};

type MockConversation = {
  id: string;
  customerName: string;
  channel: 'WhatsApp' | 'Instagram' | 'Email' | 'SMS' | 'Facebook Business';
  avatarColor: string;
  lastMessageTime: string;
  unreadCount: number;
  statusTag: string;
  statusColor: string;
  messages: MockConversationMessage[];
  context: {
    totalSpent: string;
    orderVolume: number;
    loyalty: string;
    intent: string;
  };
};

// ─── Tool registry ────────────────────────────────────────────────────────────

const ALL_TOOLS: {
  id: ToolId;
  label: string;
  Icon: LucideIcon;
  color: string;
  desc: string;
}[] = [
  { id: 'invoice',  label: 'Invoice',  Icon: FileText,        color: 'bg-zinc-800', desc: 'Generate and send an invoice' },
  { id: 'booked',   label: 'Booked',   Icon: CalendarCheck,   color: 'bg-zinc-800', desc: 'Schedule an appointment' },
  { id: 'quote',    label: 'Quote',    Icon: Calculator,      color: 'bg-zinc-800', desc: 'Send a price estimate' },
  { id: 'menu',     label: 'Menu',     Icon: ShoppingBag,     color: 'bg-zinc-800', desc: 'Share your product menu' },
  { id: 'pin',      label: 'Pin',      Icon: MapPin,          color: 'bg-zinc-800', desc: 'Send a location pin' },
  { id: 'paynow',   label: 'PayNow',   Icon: CreditCard,      color: 'bg-zinc-800', desc: 'Send a secure payment link' },
  { id: 'review',   label: 'Review',   Icon: Star,            color: 'bg-zinc-800', desc: 'Request a Google review' },
  { id: 'promo',    label: 'Promo',    Icon: Megaphone,       color: 'bg-zinc-800', desc: 'Send a promo or voucher' },
  { id: 'settings', label: 'Settings', Icon: Settings,        color: 'bg-zinc-800', desc: 'Channel and account settings' },
];

const TOOL_ACTIONS = [
  { label: 'Invoice',  Icon: FileText,        color: 'bg-zinc-900', text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.' },
  { label: 'BookedIt', Icon: CalendarCheck,   color: 'bg-zinc-900', text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!' },
  { label: 'Quote',    Icon: Wrench,          color: 'bg-zinc-900', text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00' },
  { label: 'Menu',     Icon: UtensilsCrossed, color: 'bg-zinc-900', text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.' },
];

function getToolContext(activeModule: string | null): { title: string; description: string } {
  switch (activeModule) {
    case 'Invoice':
      return {
        title: 'Fast-Invoice',
        description: 'Pull items and amounts from your catalog into an invoice. Confirming a draft drops a payment link straight into the chat.',
      };
    case 'Booked':
      return {
        title: 'BookedIt',
        description: 'Check availability, review existing appointments, and send a calendar invite into the chat without double-booking.',
      };
    case 'Quote':
      return {
        title: 'QuoteCraft',
        description: 'Put together a custom estimate with line items before turning it into a formal invoice.',
      };
    case 'Menu':
      return {
        title: 'MenuDrop',
        description: 'Manage your catalog, prices, and variants. Send a compact menu card straight into the chat.',
      };
    case 'PayNow':
      return {
        title: 'PayNow',
        description: 'Generate a one-off amount or a reusable payment link for deposits and full settlements.',
      };
    default:
      return {
        title: 'SYSTEM_PANEL',
        description: 'Initialize a functional component above to securely deploy parameters directly into the communication node.',
      };
  }
}

// ─── Channel styling helpers ───────────────────────────────────────────────────

const CHANNEL_BADGES: Record<string, string> = {
  WhatsApp:  'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  Instagram: 'text-zinc-400 bg-zinc-900 border-zinc-800',
  Email:     'text-sky-400 bg-sky-950/40 border-sky-800/30',
  SMS:       'text-orange-400 bg-orange-950/40 border-orange-800/30',
};

const CHANNEL_DOT: Record<string, string> = {
  WhatsApp:  'bg-emerald-400',
  Instagram: 'bg-zinc-400',
  Email:     'bg-sky-400',
  SMS:       'bg-orange-400',
};

// ─── Mock contacts ────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'chat_1',
    customerName: 'Customer One',
    channel: 'WhatsApp',
    avatarColor: 'CO',
    lastMessageTime: 'Now',
    unreadCount: 1,
    statusTag: 'New Lead',
    statusColor: 'border-emerald-900/40 text-emerald-400 bg-emerald-950/30',
    messages: [
      { sender: 'customer', time: '06:23 PM', text: "Hi! I'd like to book an appointment for a hair wash, treatment, and styling this week if you have any openings?" }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'BookedIt Action Controller' },
  },
  {
    id: 'chat_2',
    customerName: 'Thabo Nkosi',
    channel: 'Instagram',
    avatarColor: 'TN',
    lastMessageTime: '2m',
    unreadCount: 3,
    statusTag: 'Urgent',
    statusColor: 'border-rose-900/40 text-rose-400 bg-rose-950/30',
    messages: [
      { sender: 'customer', time: '06:21 PM', text: 'Interested in the property you advertised on your stories, can we arrange a walkthrough schedule for Thursday afternoon?' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'BookedIt Action Controller' },
  },
  {
    id: 'chat_3',
    customerName: 'Priya Maharaj',
    channel: 'Email',
    avatarColor: 'PM',
    lastMessageTime: '14m',
    unreadCount: 0,
    statusTag: 'Sales',
    statusColor: 'border-indigo-900/40 text-indigo-400 bg-indigo-950/30',
    messages: [
      { sender: 'customer', time: '06:09 PM', text: 'My fixed term mortgage is up for renewal soon. Can you send over a formal quotation matching the rates we discussed?' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'QuoteCraft Action Controller' },
  },
  {
    id: 'chat_4',
    customerName: 'James Okafor',
    channel: 'SMS',
    avatarColor: 'JO',
    lastMessageTime: '1h',
    unreadCount: 0,
    statusTag: 'General',
    statusColor: 'border-zinc-800 text-zinc-400 bg-zinc-900/50',
    messages: [
      { sender: 'customer', time: '05:15 PM', text: 'Thanks for the quick response! Let me know when the payment link is generated so I can wrap this up.' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'FastInvoice Action Controller' },
  },
  {
    id: 'chat_5',
    customerName: 'Lindiwe Dlamini',
    channel: 'WhatsApp',
    avatarColor: 'LD',
    lastMessageTime: '15m',
    unreadCount: 2,
    statusTag: 'Retail Sale',
    statusColor: 'border-orange-900/40 text-orange-400 bg-orange-950/30',
    messages: [
      { sender: 'customer', time: '06:28 PM', text: 'Hi, do you have 5 boxes of the high-top leather sneakers left in size 8? If yes, please send me an invoice directly so I can secure them right now.' }
    ],
    context: { totalSpent: 'R 4,200.00', orderVolume: 2, loyalty: 'Silver Tier', intent: 'FastInvoice Action Controller' },
  },
];

const INITIAL_MESSAGES_BY_CONTACT: Record<string, Message[]> = MOCK_CONVERSATIONS.reduce((acc, conversation) => {
  const mappedMessages = conversation.messages.map((message, index) => ({
    id: `${conversation.id}_m_${index + 1}`,
    sender: message.sender,
    body: message.text,
    created_at: new Date(Date.now() - (conversation.messages.length - index) * 60_000).toISOString(),
  }));
  acc[conversation.id] = mappedMessages;
  return acc;
}, {} as Record<string, Message[]>);

// ─── Dashboard Component ──────────────────────────────────────────────────────

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

  const [aiLoading, setAiLoading]             = useState(false);
  const [aiExtraction, setAiExtraction]       = useState<AiExtraction | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<InflowTransaction[]>([]);
  const [txLoading, setTxLoading]             = useState(false);
  const [invoiceTableMissing, setInvoiceTableMissing] = useState(false);
  const [showMobileIntel, setShowMobileIntel] = useState(false);

  const activeModuleLabel = useMemo(() => {
    return ALL_TOOLS.find((tool) => tool.id === activeToolId)?.label ?? null;
  }, [activeToolId]);

  const activeToolContext = useMemo(() => {
    return getToolContext(activeModuleLabel);
  }, [activeModuleLabel]);

  const bottomRef  = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  const selectedContact = MOCK_CONVERSATIONS.find((c) => c.id === activeContact);
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
      return { tier: 'Starter', nextTier: 'Growth', currentTarget: 500, progress: Math.round((customerLtv / 500) * 100) };
    }
    if (customerLtv < 2500) {
      return { tier: 'Growth', nextTier: 'Elite', currentTarget: 2500, progress: Math.round((customerLtv / 2500) * 100) };
    }
    return { tier: 'Elite', nextTier: 'Elite+', currentTarget: customerLtv, progress: 100 };
  }, [customerLtv]);

  useEffect(() => {
    async function loadCustomerTransactions() {
      if (!activeContact || !selectedContact || invoiceTableMissing) {
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
        query = query.eq('customer_name', selectedContact.customerName);
        const { data, error } = await query;
        if (error) {
          if (isMissingTableError(error, 'inflow_invoices')) setInvoiceTableMissing(true);
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
  }, [activeContact, invoiceTableMissing, selectedContact]);

  useEffect(() => {
    if (!activeContact || globalTab !== 'chats') setShowMobileIntel(false);
  }, [activeContact, globalTab]);

  useEffect(() => {
    if (!activeContact) return;
    setMessagesByContact((prev) => {
      if (prev[activeContact]) return prev;
      return { ...prev, [activeContact]: [] };
    });
  }, [activeContact]);

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

  function scrollToBottom() {
    window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function appendMessage(text: string, sender: 'business' | 'customer' = 'business', contactId: string | null = activeContact) {
    if (!contactId) return;
    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] ?? []),
        { id: `m-${Date.now()}`, sender, body: text, created_at: new Date().toISOString() },
      ],
    }));
    if (contactId === activeContact) scrollToBottom();
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

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
      setIsSigningOut(false);
    }
  }

  const mockActiveChat = activeContact ? { id: activeContact } as any : null;

  function getPrefillForTool(id: ToolId) {
    if (!aiExtraction || aiExtraction.tool !== id) return undefined;
    return aiExtraction.prefill as any;
  }

  function renderPlugin(id: ToolId) {
    switch (id) {
      case 'invoice': return <FastInvoice activeChat={mockActiveChat} aiPrefill={getPrefillForTool('invoice')} />;
      case 'booked':  return <BookedIt activeChat={mockActiveChat} aiPrefill={getPrefillForTool('booked')} />;
      case 'quote':   return <QuoteCraft activeChat={mockActiveChat} aiPrefill={getPrefillForTool('quote')} />;
      case 'menu':    return <MenuDrop activeChat={mockActiveChat} />;
      case 'pin':     return <PinTracker activeChat={mockActiveChat} />;
      case 'paynow':  return <PayNow activeChat={mockActiveChat} />;
      case 'review':  return <ReviewLink activeChat={mockActiveChat} />;
      case 'promo':   return <PromoBlast activeChat={mockActiveChat} aiPrefill={getPrefillForTool('promo')} />;
      case 'settings':
        return business ? (
          <BusinessSettings business={business} onUpdated={(b) => setBusiness(b)} />
        ) : (
          <p className="text-xs font-mono text-zinc-500">ERR_NO_PROFILE_RECORDED</p>
        );
      default: return null;
    }
  }

  if (loadingSession) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 border border-zinc-500 border-t-white animate-spin" />
          <p className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">SYS_INITIALIZING_DOCK</p>
        </div>
      </div>
    );
  }

  const filteredContacts = MOCK_CONVERSATIONS.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-[#09090b] text-zinc-100 font-sans tracking-tight antialiased selection:bg-zinc-800 selection:text-white scrollbar-hide">
      <style>{`
        .scrollbar-hide, .scrollbar-hide * { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar, .scrollbar-hide *::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>

      {/* ─── Sidebar Node ─── */}
      <aside className="hidden md:flex flex-col w-16 bg-[#09090b] border-r border-zinc-800/80 items-center py-6 justify-between z-20">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* New Dock Logo Metaphor */}
          <div className="flex h-8 w-8 items-center justify-center bg-zinc-100 text-[#09090b] font-black text-sm tracking-tighter shadow-sm transition hover:scale-105">
            D
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full px-2">
            {[
              { tab: 'chats'    as GlobalTab, icon: <Inbox    size={18} strokeWidth={1.5} />, label: 'INBOX' },
              { tab: 'tools'    as GlobalTab, icon: <Zap      size={18} strokeWidth={1.5} />, label: 'TOOLS' },
              { tab: 'settings' as GlobalTab, icon: <Settings size={18} strokeWidth={1.5} />, label: 'PARAMS' },
            ].map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => setGlobalTab(tab)}
                title={label}
                className={`group relative flex flex-col h-12 w-full items-center justify-center transition-all ${
                  globalTab === tab
                    ? 'bg-zinc-900 text-white border border-zinc-800'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {icon}
                <span className="text-[8px] font-mono mt-1 tracking-wider opacity-60 group-hover:opacity-100">{label}</span>
                {globalTab === tab && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-200" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          title="Disconnect Session"
          className="flex h-10 w-10 items-center justify-center text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-30"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </aside>

      {/* ─── Core Container ─── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#09090b]">

        {/* ══ CHATS DOMAIN ══════════════════════════════════════════════════════ */}
        {globalTab === 'chats' && (
          <>
            {/* ── Stream Sub-directory ── */}
            <div
              className={`flex-shrink-0 flex flex-col bg-[#09090b] border-r border-zinc-800/80 overflow-hidden
                ${activeContact ? 'hidden md:flex' : 'flex'}
                w-full md:w-80 lg:w-86`}
            >
              {/* Directory Subhead */}
              <div className="px-5 pt-6 pb-4 border-b border-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-mono tracking-widest text-zinc-400 uppercase">SYS.INBOX</h2>
                    <p className="text-[10px] font-mono text-zinc-600 mt-1">
                      ACTIVE_NODES // {MOCK_CONVERSATIONS.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="h-7 w-7 flex items-center justify-center border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 transition">
                      <Hash size={13} />
                    </button>
                    <button className="h-7 w-7 flex items-center justify-center border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 transition">
                      <Users size={13} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Query directories..."
                    className="w-full h-9 font-mono border border-zinc-900 bg-zinc-950 pl-9 pr-3 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-zinc-800 transition"
                  />
                </div>

                <div className="flex gap-1 mt-3">
                  {['All', 'Unread', 'Flags'].map((f) => (
                    <button
                      key={f}
                      className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition ${
                        f === 'All'
                          ? 'bg-zinc-100 text-[#09090b] font-bold'
                          : 'bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Node Interface */}
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/40">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContact(contact.id)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-all border-l-2 ${
                      activeContact === contact.id 
                        ? 'bg-zinc-900/40 border-zinc-200' 
                        : 'border-transparent bg-transparent hover:bg-zinc-900/10'
                    }`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="h-8 w-8 flex items-center justify-center text-[11px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {contact.avatarColor}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#09090b] ${CHANNEL_DOT[contact.channel] || 'bg-zinc-500'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-zinc-200 truncate">{contact.customerName}</span>
                        <span className="text-[10px] font-mono text-zinc-600 flex-shrink-0">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate leading-normal font-normal">{contact.messages[0]?.text || ''}</p>
                      
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className={`inline-block border px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase ${CHANNEL_BADGES[contact.channel] || 'text-zinc-400 border-zinc-800'}`}>
                          {contact.channel}
                        </span>
                        {contact.statusTag && (
                          <span className={`inline-block border px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-tight ${contact.statusColor} border-zinc-800/60`}>
                            {contact.statusTag}
                          </span>
                        )}
                      </div>
                    </div>

                    {contact.unreadCount > 0 && (
                      <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center bg-zinc-100 px-1 text-[9px] font-mono font-bold text-[#09090b]">
                        {contact.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Thread Node Terminal ── */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-[#09090b] ${!activeContact ? 'hidden md:flex' : 'flex'}`} >
              {!activeContact ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 border border-zinc-900 flex items-center justify-center text-zinc-600 bg-zinc-950">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">AWAITING_NODE_SELECTION</p>
                    <p className="text-[11px] font-mono text-zinc-600 mt-1">Specify an incoming routing channel to handle operations.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Terminal Header */}
                  <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-950/40">
                    <button onClick={() => setActiveContact(null)} className="md:hidden flex h-7 w-7 items-center justify-center border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white" >
                      <ArrowLeft size={14} />
                    </button>
                    <div className="h-8 w-8 flex items-center justify-center text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 flex-shrink-0">
                      {selectedContact?.avatarColor}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{selectedContact?.customerName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`h-1 w-1 rounded-full ${CHANNEL_DOT[selectedContact?.channel || 'SMS']}`} />
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{selectedContact?.channel} // SESSION_ESTABLISHED</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setShowMobileIntel(true)} className="xl:hidden flex items-center gap-1 h-7 px-2 text-[10px] font-mono uppercase border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors" >
                        <Users size={11} /> INTEL
                      </button>

                      <button onClick={handleAiAssist} disabled={aiLoading} className={`flex items-center gap-1.5 h-7 px-2.5 text-[10px] font-mono uppercase transition-all border ${
                        aiLoading 
                          ? 'bg-zinc-900 text-zinc-500 border-zinc-800 animate-pulse' 
                          : 'bg-zinc-100 text-[#09090b] font-bold border-zinc-200 hover:bg-zinc-200'
                      }`} >
                        <Sparkles size={11} /> {aiLoading ? 'ANALYZING' : 'AI ASSIST'}
                      </button>
                      
                      <button className="h-7 w-7 flex items-center justify-center border border-zinc-900 text-zinc-500 hover:text-zinc-300 transition"><Phone size={13} /></button>
                      <button className="h-7 w-7 flex items-center justify-center border border-zinc-900 text-zinc-500 hover:text-zinc-300 transition"><Star size={13} /></button>
                      <button className="h-7 w-7 flex items-center justify-center border border-zinc-900 text-zinc-500 hover:text-zinc-300 transition"><MoreHorizontal size={13} /></button>
                    </div>
                  </div>

                  {/* AI Prediction System Message */}
                  {aiExtraction?.tool && (
                    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-2 bg-zinc-900 border-b border-zinc-800/80">
                      <Sparkles size={11} className="text-zinc-400 flex-shrink-0" />
                      <p className="text-[11px] font-mono text-zinc-400 flex-1">
                        INTENT_EXTRACTION: <span className="text-white font-bold underline decoration-dotted uppercase">{aiExtraction.tool}</span> detected ({aiConfidencePercent}% confidence). Ready for staging execution.
                      </p>
                      <button onClick={() => { setActiveToolId(aiExtraction.tool!); setGlobalTab('tools'); }} className="flex-shrink-0 text-[10px] font-mono tracking-wider uppercase bg-zinc-800 text-zinc-200 border border-zinc-700 px-2 py-0.5 hover:text-white transition" >
                        RUN_MODULE
                      </button>
                    </div>
                  )}

                  {/* Direct Command Pipeline */}
                  <div className="flex-shrink-0 border-b border-zinc-900 bg-zinc-950/20 overflow-x-auto scrollbar-none px-5 py-2">
                    <div className="flex gap-1.5 whitespace-nowrap">
                      {TOOL_ACTIONS.map((tool) => {
                        const ToolIcon = tool.Icon;
                        return (
                          <button key={tool.label} onClick={() => handleToolAction(tool.text)} className="flex-shrink-0 flex items-center gap-1.5 border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors" >
                            <ToolIcon size={11} /> {tool.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational Transcript Frame */}
                  <div key={activeContact ?? 'no-contact'} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-zinc-900" />
                      <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase">DATALOG_STREAM_TODAY</span>
                      <div className="flex-1 h-px bg-zinc-900" />
                    </div>

                    {currentMessages.map((message) => (
                      <div key={message.id} className={`flex gap-2.5 ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`} >
                        {message.sender === 'customer' && (
                          <div className="h-6 w-6 flex items-center justify-center text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 flex-shrink-0 mt-0.5">
                            {selectedContact?.avatarColor}
                          </div>
                        )}
                        <div className={`max-w-[85%] md:max-w-[70%] px-3.5 py-2.5 text-xs border leading-relaxed ${
                          message.sender === 'business'
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                            : 'bg-zinc-950 border-zinc-900 text-zinc-300'
                        }`} >
                          <p className="whitespace-pre-wrap">{message.body}</p>
                          <div className="flex items-center justify-end gap-1 mt-1.5 opacity-40">
                            <span className="text-[8px] font-mono uppercase tracking-tighter">
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.sender === 'business' && <CheckCheck size={10} />}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input Pipeline Frame */}
                  <div className="flex-shrink-0 p-4 border-t border-zinc-800/80 bg-zinc-950/40">
                    <div className="relative border border-zinc-800 bg-[#09090b] focus-within:border-zinc-700 transition">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={`Route response to ${selectedContact?.customerName}...`}
                        rows={1}
                        className="w-full resize-none bg-transparent pl-4 pr-24 py-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none min-h-[42px] max-h-[120px]"
                      />
                      <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                        <button title="Attach payload" className="h-7 w-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition">
                          <Paperclip size={13} />
                        </button>
                        <button title="Emojis" className="h-7 w-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition">
                          <Smile size={13} />
                        </button>
                        <button
                          onClick={handleSend}
                          className="h-7 px-3 bg-zinc-100 text-[#09090b] font-mono text-[10px] font-bold uppercase transition hover:bg-zinc-200"
                        >
                          ROUTE
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Customer Intelligence Frame (Desktop Sideboard) ── */}
            <div className={`xl:w-72 lg:w-64 flex-shrink-0 border-l border-zinc-800/80 bg-zinc-950/20 flex-col overflow-hidden xl:flex
              ${showMobileIntel ? 'fixed inset-0 z-30 flex bg-[#09090b]/95 p-4' : 'hidden'}`} >
              
              {showMobileIntel && (
                <div className="flex justify-end mb-2 xl:hidden">
                  <button onClick={() => setShowMobileIntel(false)} className="h-8 w-8 flex items-center justify-center border border-zinc-800 text-zinc-400 bg-zinc-900" >
                    <X size={15} />
                  </button>
                </div>
              )}

              {!activeContact ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center opacity-40">
                  <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">INTEL_STANDBY</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-y-auto p-5 gap-5">
                  <div>
                    <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">METRIC_PROFILE</h3>
                    <div className="border border-zinc-900 bg-zinc-950/60 p-3">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{selectedContact?.customerName}</p>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-[9px] font-mono border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-zinc-400 uppercase tracking-tight">
                          {customerStatusLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">FINANCIAL_LEDGER</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-zinc-900 bg-zinc-950/60 p-2.5 text-left">
                        <span className="text-[9px] font-mono text-zinc-600 block uppercase">TOTAL_VAL</span>
                        <span className="text-xs font-mono font-bold text-zinc-300 mt-1 block">R {customerLtv.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border border-zinc-900 bg-zinc-950/60 p-2.5 text-left">
                        <span className="text-[9px] font-mono text-zinc-600 block uppercase">TX_VOLUME</span>
                        <span className="text-xs font-mono font-bold text-zinc-300 mt-1 block">{customerOrderVolume} unit(s)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">TIER_PROGRESSION</h3>
                    <div className="border border-zinc-900 bg-zinc-950/60 p-3 font-mono">
                      <div className="flex justify-between text-[10px] text-zinc-400 uppercase">
                        <span>{loyalty.tier}</span>
                        <span className="text-zinc-600">→ {loyalty.nextTier}</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800 mt-1.5 overflow-hidden">
                        <div className="bg-zinc-300 h-full transition-all duration-500" style={{ width: `${loyalty.progress}%` }} />
                      </div>
                      <p className="text-[9px] text-zinc-500 mt-2 text-right">R {customerLtv} / R {loyalty.currentTarget}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-[180px]">
                    <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">RECENT_TX_REGISTRY</h3>
                    <div className="flex-1 border border-zinc-900 bg-zinc-950/60 overflow-y-auto divide-y divide-zinc-900/60">
                      {txLoading ? (
                        <p className="text-[10px] font-mono p-3 text-zinc-600 animate-pulse uppercase">QUERYING_DB...</p>
                      ) : invoiceTableMissing ? (
                        <p className="text-[9px] font-mono p-3 text-zinc-600 leading-normal uppercase">ERR_INFLOW_TABLES_MISSING</p>
                      ) : customerTransactions.length === 0 ? (
                        <p className="text-[10px] font-mono p-3 text-zinc-600 uppercase">NO_RECORDS_FOUND</p>
                      ) : (
                        customerTransactions.map((tx) => (
                          <div key={tx.id} className="p-2.5 font-mono text-[10px] hover:bg-zinc-900/20 transition-colors" >
                            <div className="flex justify-between font-medium">
                              <span className="text-zinc-400 truncate pr-2 uppercase">{tx.reference || 'UNTITLED'}</span>
                              <span className="text-zinc-300 flex-shrink-0">R{Number(tx.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-zinc-600 mt-1 uppercase">
                              <span>{tx.type}</span>
                              <span className={tx.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}>{tx.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ PLUGINS / TOOLS TAB ══════════════════════════════════════════════ */}
        {globalTab === 'tools' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#09090b]">
            {/* Component Interface Director */}
            <div className="w-full md:w-72 lg:w-80 flex-shrink-0 border-r border-zinc-800/80 bg-[#09090b] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-zinc-900">
                <h2 className="text-sm font-mono tracking-widest text-zinc-400 uppercase">SYS.MODULES</h2>
                <p className="text-[10px] font-mono text-zinc-600 mt-1">SELECT_FUNCTIONAL_EXTENSION</p>
                
                <div className="mt-4 flex bg-zinc-950 border border-zinc-900 p-0.5">
                  <button onClick={() => setToolViewMode('list')} className={`flex-1 text-center font-mono py-1 text-[10px] uppercase tracking-wide transition ${toolViewMode === 'list' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:text-zinc-400'}`} >
                    Matrix
                  </button>
                  <button onClick={() => setToolViewMode('tabs')} className={`flex-1 text-center font-mono py-1 text-[10px] uppercase tracking-wide transition ${toolViewMode === 'tabs' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:text-zinc-400'}`} >
                    Focus
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
                {ALL_TOOLS.map((tool) => {
                  const IconComp = tool.Icon;
                  const isSelected = activeToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className={`w-full text-left p-3 border transition-all ${
                        isSelected 
                          ? 'bg-zinc-900 border-zinc-700 text-white' 
                          : 'bg-transparent border-zinc-900/60 text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-6 w-6 flex items-center justify-center border ${isSelected ? 'border-zinc-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>
                          <IconComp size={12} />
                        </div>
                        <span className="text-xs font-semibold tracking-tight">{tool.label}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1.5 font-normal leading-normal">{tool.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plugin Workspace Frame */}
            <div className="flex-1 flex flex-col bg-[#09090b] overflow-hidden">
              {!activeToolId ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-10 w-10 border border-zinc-900 bg-zinc-950 flex items-center justify-center text-zinc-600 mb-3">
                    <Zap size={16} />
                  </div>
                  <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">STAGING_WORKSPACE_EMPTY</p>
                  <p className="text-[11px] font-mono text-zinc-600 mt-1">Select a core component file from the directory matrix to initialize data fields.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/40">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">{activeToolContext.title}</h2>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed max-w-2xl">{activeToolContext.description}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
                    <div className="max-w-3xl border border-zinc-900 bg-zinc-950/40 p-5 shadow-sm">
                      {renderPlugin(activeToolId)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PARAMS / SETTINGS TAB ════════════════════════════════════════════ */}
        {globalTab === 'settings' && (
          <div className="flex-1 flex flex-col bg-[#09090b] overflow-hidden">
            <div className="flex-shrink-0 px-6 py-5 border-b border-zinc-900">
              <h2 className="text-sm font-mono tracking-widest text-zinc-400 uppercase">SYS.CONFIGURATION</h2>
              <p className="text-[10px] font-mono text-zinc-600 mt-1">GLOBAL_ENVIRONMENT_VARIABLES</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl border border-zinc-900 bg-zinc-950/40 p-6">
                {business ? (
                  <BusinessSettings business={business} onUpdated={(b) => setBusiness(b)} />
                ) : (
                  <p className="text-xs font-mono text-zinc-600 uppercase">ERR_LOAD_ENVIRONMENT_FAIL</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── Mobile Control Stack ─── */}
      <nav className="md:hidden flex-shrink-0 border-t border-zinc-800 bg-zinc-950 z-50">
        <div className="flex items-center justify-around px-2 py-1.5">
          {[
            { tab: 'chats'    as GlobalTab, icon: <Inbox    size={18} />, label: 'Inbox' },
            { tab: 'tools'    as GlobalTab, icon: <Zap      size={18} />, label: 'Tools' },
            { tab: 'settings' as GlobalTab, icon: <Settings size={18} />, label: 'Params' },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => { setGlobalTab(tab); if (tab !== 'chats') setActiveContact(null); }}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 text-[9px] font-mono uppercase tracking-tight transition-colors ${
                globalTab === tab
                  ? 'text-white font-bold bg-zinc-900 border border-zinc-800'
                  : 'text-zinc-500'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-[9px] font-mono uppercase tracking-tight text-zinc-600 hover:text-red-400 disabled:opacity-30"
          >
            <LogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
