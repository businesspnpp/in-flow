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
  { id: 'invoice',  label: 'Invoice',  Icon: FileText,        color: 'bg-violet-600',  desc: 'Generate and send an invoice' },
  { id: 'booked',   label: 'Booked',   Icon: CalendarCheck,   color: 'bg-emerald-600', desc: 'Schedule an appointment' },
  { id: 'quote',    label: 'Quote',    Icon: Calculator,      color: 'bg-amber-600',   desc: 'Send a price estimate' },
  { id: 'menu',     label: 'Menu',     Icon: ShoppingBag,     color: 'bg-rose-600',    desc: 'Share your product menu' },
  { id: 'pin',      label: 'Pin',      Icon: MapPin,          color: 'bg-sky-600',     desc: 'Send a location pin' },
  { id: 'paynow',   label: 'PayNow',   Icon: CreditCard,      color: 'bg-blue-600',    desc: 'Send a secure payment link' },
  { id: 'review',   label: 'Review',   Icon: Star,            color: 'bg-yellow-600',  desc: 'Request a Google review' },
  { id: 'promo',    label: 'Promo',    Icon: Megaphone,       color: 'bg-pink-600',    desc: 'Send a promo or voucher' },
  { id: 'settings', label: 'Settings', Icon: Settings,        color: 'bg-zinc-600',    desc: 'Channel and account settings' },
];

// Legacy quick-action pills (no AI pre-fill needed — these are one-tap sends)
const TOOL_ACTIONS = [
  { label: 'Invoice',  Icon: FileText,        color: 'bg-violet-600',  text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.' },
  { label: 'BookedIt', Icon: CalendarCheck,   color: 'bg-emerald-600', text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!' },
  { label: 'Quote',    Icon: Wrench,          color: 'bg-amber-600',   text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00' },
  { label: 'Menu',     Icon: UtensilsCrossed, color: 'bg-rose-600',    text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.' },
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
        title: 'Tool panel',
        description: 'Pick a tool above to send invoices, bookings, quotes, and more directly into the conversation.',
      };
  }
}

// ─── Channel helpers ──────────────────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp:  'bg-emerald-600',
  Instagram: 'bg-zinc-700',
  Email:     'bg-blue-600',
  SMS:       'bg-slate-600',
};

const CHANNEL_DOT: Record<string, string> = {
  WhatsApp:  'bg-emerald-500',
  Instagram: 'bg-zinc-500',
  Email:     'bg-blue-500',
  SMS:       'bg-slate-500',
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
    statusColor: 'border-emerald-200 text-emerald-700 bg-emerald-50',
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
    statusColor: 'border-rose-200 text-rose-700 bg-rose-50',
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
    statusColor: 'border-purple-200 text-purple-700 bg-purple-50',
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
    statusColor: 'border-zinc-300 text-zinc-500 bg-zinc-100',
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
    statusColor: 'border-amber-200 text-amber-700 bg-amber-50',
    messages: [
      { sender: 'customer', time: '06:28 PM', text: 'Hi, do you have 5 boxes of the high-top leather sneakers left in size 8? If yes, please send me an invoice directly so I can secure them right now.' }
    ],
    context: { totalSpent: 'R 4,200.00', orderVolume: 2, loyalty: 'Silver Tier', intent: 'FastInvoice Action Controller' },
  },
  {
    id: 'chat_6',
    customerName: 'Sipho Mthembu',
    channel: 'WhatsApp',
    avatarColor: 'SM',
    lastMessageTime: '32m',
    unreadCount: 0,
    statusTag: 'Barber / Fade',
    statusColor: 'border-blue-200 text-blue-700 bg-blue-50',
    messages: [
      { sender: 'customer', time: '06:11 PM', text: 'Yo! Need a sharp Taper Fade with dye before my weekend event. What slots does the master barber have open tomorrow afternoon?' }
    ],
    context: { totalSpent: 'R 1,850.00', orderVolume: 8, loyalty: 'Gold VIP', intent: 'BookedIt Action Controller' },
  },
  {
    id: 'chat_7',
    customerName: 'Elena Rostova',
    channel: 'Instagram',
    avatarColor: 'ER',
    lastMessageTime: '45m',
    unreadCount: 1,
    statusTag: 'Quote Request',
    statusColor: 'border-purple-200 text-purple-700 bg-purple-50',
    messages: [
      { sender: 'customer', time: '05:58 PM', text: 'Hello, I am interested in your custom catering menu for a corporate group of 45 people. Can you generate a custom price estimate for me?' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'QuoteCraft Action Controller' },
  },
  {
    id: 'chat_8',
    customerName: 'Brandon Stark',
    channel: 'Facebook Business',
    avatarColor: 'BS',
    lastMessageTime: '2h',
    unreadCount: 0,
    statusTag: 'Inventory Menu',
    statusColor: 'border-teal-200 text-teal-700 bg-teal-50',
    messages: [
      { sender: 'customer', time: '04:43 PM', text: 'Hey, could you send over your latest product catalog or digital price menu? I want to see what shades you have available in stock.' }
    ],
    context: { totalSpent: 'R 850.00', orderVolume: 1, loyalty: 'Starter', intent: 'MenuDrop Action Controller' },
  },
  {
    id: 'chat_9',
    customerName: 'Zanele Khumalo',
    channel: 'WhatsApp',
    avatarColor: 'ZK',
    lastMessageTime: '3h',
    unreadCount: 0,
    statusTag: 'Payment Pending',
    statusColor: 'border-rose-200 text-rose-700 bg-rose-50',
    messages: [
      { sender: 'customer', time: '03:12 PM', text: "I'm ready to checkout for the custom jewelry piece. Can you drop a secure PayNow link here so I can process the transaction via EFT?" }
    ],
    context: { totalSpent: 'R 12,500.00', orderVolume: 3, loyalty: 'Gold VIP', intent: 'FastInvoice Action Controller' },
  },
  {
    id: 'chat_10',
    customerName: 'Marcus Vance',
    channel: 'SMS',
    avatarColor: 'MV',
    lastMessageTime: '4h',
    unreadCount: 0,
    statusTag: 'Wholesale Buyer',
    statusColor: 'border-amber-200 text-amber-700 bg-amber-50',
    messages: [
      { sender: 'customer', time: '02:05 PM', text: 'We need to restock 50 units of the industrial valves for our site. Please issue a comprehensive itemized quote with bulk tier discounts.' }
    ],
    context: { totalSpent: 'R 45,000.00', orderVolume: 5, loyalty: 'Enterprise Platinum', intent: 'QuoteCraft Action Controller' },
  },
  {
    id: 'chat_11',
    customerName: 'Amina Diop',
    channel: 'Instagram',
    avatarColor: 'AD',
    lastMessageTime: '5h',
    unreadCount: 0,
    statusTag: 'New Lead',
    statusColor: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    messages: [
      { sender: 'customer', time: '01:15 PM', text: 'Stumbled onto your design profile! Do you have a list of service pack rates or a menu of options for brand consulting?' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'MenuDrop Action Controller' },
  },
  {
    id: 'chat_12',
    customerName: 'Tariq Mahmood',
    channel: 'WhatsApp',
    avatarColor: 'TM',
    lastMessageTime: '1d',
    unreadCount: 0,
    statusTag: 'Service Delivery',
    statusColor: 'border-blue-200 text-blue-700 bg-blue-50',
    messages: [
      { sender: 'customer', time: 'Yesterday', text: 'The delivery arrived safely. Please send the final invoice statement so our accounting department can close out the ledger point.' }
    ],
    context: { totalSpent: 'R 3,100.00', orderVolume: 1, loyalty: 'Silver Tier', intent: 'FastInvoice Action Controller' },
  },
  {
    id: 'chat_13',
    customerName: 'Chloe Jenkins',
    channel: 'Facebook Business',
    avatarColor: 'CJ',
    lastMessageTime: '1d',
    unreadCount: 0,
    statusTag: 'General',
    statusColor: 'border-zinc-300 text-zinc-500 bg-zinc-100',
    messages: [
      { sender: 'customer', time: 'Yesterday', text: 'What are your operational hours over the coming public holiday? Just want to know if I can still come by for collections.' }
    ],
    context: { totalSpent: 'R 450.00', orderVolume: 1, loyalty: 'Starter', intent: 'No dominant intent' },
  },
  {
    id: 'chat_14',
    customerName: 'Dumi Ndlovu',
    channel: 'WhatsApp',
    avatarColor: 'DN',
    lastMessageTime: '2d',
    unreadCount: 0,
    statusTag: 'Barber / Cut',
    statusColor: 'border-blue-200 text-blue-700 bg-blue-50',
    messages: [
      { sender: 'customer', time: '2 days ago', text: 'Hey check, can I change my appointment time from 10:00 AM to 02:30 PM this Saturday? Let me know if that spot is open on your book.' }
    ],
    context: { totalSpent: 'R 900.00', orderVolume: 4, loyalty: 'Silver Tier', intent: 'BookedIt Action Controller' },
  },
  {
    id: 'chat_15',
    customerName: 'Sophia Martinez',
    channel: 'Instagram',
    avatarColor: 'SM',
    lastMessageTime: '3d',
    unreadCount: 0,
    statusTag: 'Bulk Order',
    statusColor: 'border-amber-200 text-amber-700 bg-amber-50',
    messages: [
      { sender: 'customer', time: '3 days ago', text: 'We need an explicit cost estimation matrix for 100 customized hoodies with embroidered emblems. Please create a draft quote record.' }
    ],
    context: { totalSpent: 'R 0,00', orderVolume: 0, loyalty: 'Starter', intent: 'QuoteCraft Action Controller' },
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

        // This dashboard currently uses contact IDs from mock data; customer_name
        // matching is reliable across uuid/non-uuid schemas.
        query = query.eq('customer_name', selectedContact.customerName);

        const { data, error } = await query;
        if (error) {
          if (isMissingTableError(error, 'inflow_invoices')) {
            setInvoiceTableMissing(true);
          }
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
          <p className="text-sm text-zinc-500">No business profile found.</p>
        );
      default:
        return null;
    }
  }

  // ─── Loading screen ───────────────────────────────────────────────────────────

  if (loadingSession) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs text-zinc-500">Loading Dock…</p>
        </div>
      </div>
    );
  }

  const filteredContacts = MOCK_CONVERSATIONS.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase())),
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-zinc-50 text-zinc-900 scrollbar-hide">
      <style>{`
        .scrollbar-hide, .scrollbar-hide * {
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar,
        .scrollbar-hide *::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>

      {/* ─── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-20 bg-white/95 backdrop-blur-sm border-r border-zinc-200 items-center py-4 gap-2 z-20">
        <div className="mb-4 flex h-14 w-14 items-center justify-center">
          <img src="/dock-icon.svg" alt="Dock icon" className="h-14 w-14" />
        </div>

        {[
          { tab: 'chats'    as GlobalTab, icon: <Inbox    size={20} strokeWidth={2.25} />, label: 'Inbox'    },
          { tab: 'tools'    as GlobalTab, icon: <Zap      size={20} strokeWidth={2.25} />, label: 'Tools'    },
          { tab: 'settings' as GlobalTab, icon: <Settings size={20} strokeWidth={2.25} />, label: 'Settings' },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setGlobalTab(tab)}
            title={label}
            className={`relative flex h-10 w-10 items-center justify-center transition-colors ${
              globalTab === tab
                ? 'bg-amber-600/15 text-amber-700'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
            }`}
          >
            {icon}
            {globalTab === tab && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-amber-500" />
            )}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-40"
        >
          <LogOut size={20} strokeWidth={2.25} />
        </button>
      </aside>

      {/* ─── Main panel ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ══ CHATS TAB ══════════════════════════════════════════════════════════ */}
        {globalTab === 'chats' && (
          <>
            {/* ── Conversation list ── */}
            <div
              className={`flex-shrink-0 flex flex-col bg-white border-r border-zinc-200 overflow-hidden
                ${activeContact ? 'hidden md:flex' : 'flex'}
                w-full md:w-72 lg:w-80`}
            >
              {/* Header */}
              <div className="px-4 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-zinc-900">Inbox</h2>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {MOCK_CONVERSATIONS.length} conversations
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition">
                      <Hash size={16} strokeWidth={2.25} />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition">
                      <Users size={16} strokeWidth={2.25} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search size={16} strokeWidth={2.25} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full h-11 border border-zinc-200 bg-zinc-100 pl-9 pr-3 py-2.5 text-xs text-zinc-700 placeholder:text-zinc-500 outline-none focus:border-amber-600/50 transition"
                  />
                </div>

                <div className="flex gap-1.5 mt-3">
                  {['All', 'Unread', 'Mine'].map((f) => (
                    <button
                      key={f}
                      className={`px-3 py-1.5 text-[11px] font-semibold transition ${
                        f === 'All'
                          ? 'bg-amber-600 text-white'
                          : 'bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact list */}
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContact(contact.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-100 ${
                      activeContact === contact.id ? 'bg-zinc-100' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`h-10 w-10 flex items-center justify-center text-[13px] font-semibold text-white ${
                          CHANNEL_COLORS[contact.channel] || 'bg-zinc-600'
                        }`}
                      >
                        {contact.avatarColor}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border-2 border-white ${CHANNEL_DOT[contact.channel] || 'bg-zinc-400'}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-zinc-900 truncate">{contact.customerName}</span>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate leading-snug">{contact.messages[0]?.text || ''}</p>
                      {contact.statusTag && (
                        <span className={`mt-1.5 inline-block border px-1.5 py-0.5 text-[10px] font-medium ${contact.statusColor}`}>
                          {contact.statusTag}
                        </span>
                      )}
                    </div>

                    {contact.unreadCount > 0 && (
                      <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center bg-amber-600 px-1 text-[10px] font-bold text-white">
                        {contact.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Thread view ── */}
            <div
              className={`flex-1 flex flex-col overflow-hidden bg-zinc-50 ${
                !activeContact ? 'hidden md:flex' : 'flex'
              }`}
            >
              {!activeContact ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center">
                    <MessageSquare size={28} className="text-zinc-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-500">Select a conversation</p>
                    <p className="text-xs text-zinc-400 mt-1">Choose from the list to start replying</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-zinc-200 bg-white">
                    <button
                      onClick={() => setActiveContact(null)}
                      className="md:hidden flex h-8 w-8 items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-100 transition"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    <div
                      className={`h-9 w-9 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        CHANNEL_COLORS[selectedContact?.channel || 'SMS']
                      }`}
                    >
                      {selectedContact?.avatarColor}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{selectedContact?.customerName}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 ${CHANNEL_DOT[selectedContact?.channel || 'SMS'] || 'bg-zinc-400'}`} />
                        <p className="text-xs text-zinc-500">{selectedContact?.channel}</p>
                      </div>
                    </div>

                    {/* Action icons + AI assist button */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowMobileIntel(true)}
                        title="Open Customer Intelligence"
                        className="xl:hidden flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                      >
                        <Users size={13} />
                        Intel
                      </button>

                      {/* AI Assist — reads thread and opens correct tool with pre-fill */}
                      <button
                        onClick={handleAiAssist}
                        disabled={aiLoading}
                        title="AI Assist — auto-suggest tool from chat"
                        className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium transition-colors border ${
                          aiLoading
                            ? 'bg-amber-600/10 text-amber-700 border-amber-600/20 animate-pulse cursor-wait'
                            : 'bg-amber-600/10 text-amber-700 hover:bg-amber-600/20 border-amber-600/20'
                        }`}
                      >
                        <Sparkles size={13} />
                        {aiLoading ? 'Reading…' : 'AI Assist'}
                      </button>

                      <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition">
                        <Phone size={15} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition">
                        <Star size={15} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </div>

                  {/* AI suggestion banner */}
                  {aiExtraction?.tool && (
                    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-amber-600/10 border-b border-amber-600/20">
                      <Sparkles size={13} className="text-amber-700 flex-shrink-0" />
                      <p className="text-xs text-amber-800 flex-1">
                        AI detected a <span className="font-semibold capitalize">{aiExtraction.tool}</span> request
                        {aiExtraction.confidence >= 0.8
                          ? ' — form pre-filled, review and send.'
                          : ' — check the pre-fill before sending.'}
                      </p>
                      <button
                        onClick={() => { setActiveToolId(aiExtraction.tool!); setGlobalTab('tools'); }}
                        className="flex-shrink-0 text-[10px] font-semibold text-amber-700 bg-amber-600/20 px-2 py-1 hover:bg-amber-600/30 transition"
                      >
                        Open tool →
                      </button>
                    </div>
                  )}

                  {/* Quick tool pills */}
                  <div className="flex-shrink-0 border-b border-zinc-200 bg-white overflow-x-auto scrollbar-none px-4 py-2">
                    <div className="flex gap-2 whitespace-nowrap">
                      {TOOL_ACTIONS.map((tool) => {
                        const ToolIcon = tool.Icon;
                        return (
                          <button
                            key={tool.label}
                            onClick={() => handleToolAction(tool.text)}
                            className="flex-shrink-0 flex items-center gap-1.5 border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-amber-600/10 hover:border-amber-600/30 hover:text-amber-700 transition-colors"
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
                      <div className="flex-1 h-px bg-zinc-200" />
                      <span className="text-[10px] text-zinc-400 font-medium uppercase">Today</span>
                      <div className="flex-1 h-px bg-zinc-200" />
                    </div>

                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'customer' && (
                          <div
                            className={`h-7 w-7 flex-shrink-0 self-end flex items-center justify-center text-[10px] font-bold text-white ${
                              CHANNEL_COLORS[selectedContact?.channel || 'SMS'] || 'bg-zinc-600'
                            }`}
                          >
                            {selectedContact?.avatarColor}
                          </div>
                        )}
                        <div className={`max-w-[75%] flex flex-col gap-1 ${message.sender === 'business' ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed ${
                              message.sender === 'business'
                                ? 'bg-amber-600 text-white font-medium'
                                : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                            }`}
                          >
                            {message.body}
                          </div>
                          <div className={`flex items-center gap-1 ${message.sender === 'business' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.sender === 'business' && (
                              <CheckCheck size={12} className="text-amber-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input bar */}
                  <div className="flex-shrink-0 border-t border-zinc-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-2 focus-within:border-amber-600/50 transition-colors">
                      <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0">
                        <Paperclip size={16} />
                      </button>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                        }}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                      />
                      <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0">
                        <Smile size={16} />
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="flex h-8 w-8 items-center justify-center bg-amber-600 text-white transition hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Right Context Column (Desktop XL) ── */}
            <aside className="w-96 border-l border-zinc-200 bg-white hidden xl:flex flex-col overflow-y-auto">
              <div className="px-5 py-4 border-b border-zinc-200">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">Context</p>
                <h3 className="text-sm text-zinc-900 font-semibold mt-1">Customer profile</h3>
              </div>

              {selectedContact ? (
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                  {/* CRM Meta Profile */}
                  <section className="border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">{selectedContact.customerName}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{selectedContact.channel}</p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-1 border ${
                          customerOrderVolume === 0
                            ? 'border-zinc-200 text-zinc-500 bg-zinc-100'
                            : customerOrderVolume === 1
                            ? 'border-amber-200 text-amber-700 bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                        }`}
                      >
                        {customerStatusLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-zinc-200 bg-white p-3">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">Total spent</p>
                        <p className="text-lg font-semibold text-zinc-900 mt-1">
                          {new Intl.NumberFormat('en-ZA', {
                            style: 'currency',
                            currency: 'ZAR',
                            maximumFractionDigits: 2,
                          }).format(customerLtv)}
                        </p>
                      </div>
                      <div className="border border-zinc-200 bg-white p-3">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</p>
                        <p className="text-lg font-semibold text-zinc-900 mt-1">{customerOrderVolume}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] text-zinc-500">Loyalty tier</p>
                        <p className="text-[11px] text-zinc-800 font-medium">{loyalty.tier}</p>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${Math.max(3, loyalty.progress)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">
                        Next: {loyalty.nextTier}
                        {customerLtv < 2500 ? ` — R${Math.max(0, loyalty.currentTarget - customerLtv).toFixed(2)} to go` : ''}
                      </p>
                    </div>
                  </section>

                  {/* Transaction Snapshot */}
                  <section className="border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold text-zinc-800">Recent transactions</h4>
                      {txLoading && <span className="text-[10px] text-zinc-500">Loading…</span>}
                    </div>

                    <div className="space-y-2">
                      {!txLoading && customerTransactions.length === 0 && (
                        <p className="text-[11px] text-zinc-500">No invoices or quotes for this customer yet.</p>
                      )}

                      {customerTransactions.map((txn) => {
                        const status = String(txn.status || '').toLowerCase();
                        const statusClass =
                          status === 'paid'
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                            : status === 'pending' || status === 'sent' || status === 'draft'
                            ? 'border-amber-200 text-amber-700 bg-amber-50'
                            : 'border-rose-200 text-rose-700 bg-rose-50';

                        const shortDate = new Date(txn.created_at).toLocaleDateString('en-ZA', {
                          day: '2-digit',
                          month: 'short',
                        });

                        return (
                          <div
                            key={txn.id}
                            className="grid grid-cols-[58px_1fr_auto] items-center gap-2 border border-zinc-200 bg-white px-2.5 py-2"
                          >
                            <span className="text-[11px] text-zinc-500 font-medium">{shortDate}</span>
                            <div className="min-w-0 flex items-center gap-2">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 border ${statusClass}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                              <span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span>
                            </div>
                            <span className="text-[12px] text-zinc-900 font-semibold">
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
                  <section className="border border-zinc-200 bg-zinc-50 p-4">
                    <h4 className="text-xs font-semibold text-zinc-800 mb-2.5">AI signal</h4>

                    <div className="border border-zinc-200 bg-white px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500">Detected intent</p>
                      <p className="text-sm text-zinc-900 mt-1">
                        <span className="font-semibold">
                          {aiDetectedIntent === 'none'
                            ? 'No dominant intent'
                            : aiDetectedIntent === 'invoice'
                            ? 'Invoice'
                            : aiDetectedIntent === 'booking'
                            ? 'Booking'
                            : aiDetectedIntent === 'quote'
                            ? 'Quote'
                            : 'Promo'}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">Confidence: {aiConfidencePercent}%</p>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">Suggested actions</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setActiveToolId('booked');
                            setGlobalTab('tools');
                          }}
                          className={`w-full px-3 py-2 text-left border transition-colors ${
                            aiDetectedIntent === 'booking'
                              ? 'border-amber-600/60 bg-amber-600/10'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <p className="text-[12px] text-zinc-900 font-medium">Open BookedIt</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Suggested when booking intent is dominant.</p>
                        </button>

                        <button
                          onClick={() => {
                            setActiveToolId('invoice');
                            setGlobalTab('tools');
                          }}
                          className={`w-full px-3 py-2 text-left border transition-colors ${
                            aiDetectedIntent === 'invoice'
                              ? 'border-amber-600/60 bg-amber-600/10'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <p className="text-[12px] text-zinc-900 font-medium">Open FastInvoice</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Suggested when invoice intent is dominant.</p>
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center px-6 text-center">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Select a conversation to see customer profile, transactions, and AI signal.
                  </p>
                </div>
              )}
            </aside>

            {/* ── Mobile/Tablet Customer Intelligence Drawer ── */}
            {showMobileIntel && selectedContact && (
              <div className="xl:hidden fixed inset-0 z-[70] bg-zinc-900/40">
                <div className="absolute inset-x-0 bottom-0 max-h-[86vh] border-t border-zinc-200 bg-white flex flex-col">
                  <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">Context</p>
                      <h3 className="text-sm text-zinc-900 font-semibold mt-1">Customer profile</h3>
                    </div>
                    <button
                      onClick={() => setShowMobileIntel(false)}
                      className="h-8 w-8 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                    >
                      <X size={14} className="mx-auto" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                    {/* CRM Meta Profile */}
                    <section className="border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-zinc-500 font-medium">{selectedContact.customerName}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{selectedContact.channel}</p>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2 py-1 border ${
                            customerOrderVolume === 0
                              ? 'border-zinc-200 text-zinc-500 bg-zinc-100'
                              : customerOrderVolume === 1
                              ? 'border-amber-200 text-amber-700 bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          }`}
                        >
                          {customerStatusLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-zinc-200 bg-white p-3">
                          <p className="text-[10px] uppercase tracking-wide text-zinc-500">Total spent</p>
                          <p className="text-lg font-semibold text-zinc-900 mt-1">
                            {new Intl.NumberFormat('en-ZA', {
                              style: 'currency',
                              currency: 'ZAR',
                              maximumFractionDigits: 2,
                            }).format(customerLtv)}
                          </p>
                        </div>
                        <div className="border border-zinc-200 bg-white p-3">
                          <p className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</p>
                          <p className="text-lg font-semibold text-zinc-900 mt-1">{customerOrderVolume}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[11px] text-zinc-500">Loyalty tier</p>
                          <p className="text-[11px] text-zinc-800 font-medium">{loyalty.tier}</p>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${Math.max(3, loyalty.progress)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2">
                          Next: {loyalty.nextTier}
                          {customerLtv < 2500 ? ` — R${Math.max(0, loyalty.currentTarget - customerLtv).toFixed(2)} to go` : ''}
                        </p>
                      </div>
                    </section>

                    {/* Transaction Snapshot */}
                    <section className="border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-zinc-800">Recent transactions</h4>
                        {txLoading && <span className="text-[10px] text-zinc-500">Loading…</span>}
                      </div>

                      <div className="space-y-2">
                        {!txLoading && customerTransactions.length === 0 && (
                          <p className="text-[11px] text-zinc-500">No invoices or quotes for this customer yet.</p>
                        )}

                        {customerTransactions.map((txn) => {
                          const status = String(txn.status || '').toLowerCase();
                          const statusClass =
                            status === 'paid'
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                              : status === 'pending' || status === 'sent' || status === 'draft'
                              ? 'border-amber-200 text-amber-700 bg-amber-50'
                              : 'border-rose-200 text-rose-700 bg-rose-50';

                          const shortDate = new Date(txn.created_at).toLocaleDateString('en-ZA', {
                            day: '2-digit',
                            month: 'short',
                          });

                          return (
                            <div
                              key={txn.id}
                              className="grid grid-cols-[58px_1fr_auto] items-center gap-2 border border-zinc-200 bg-white px-2.5 py-2"
                            >
                              <span className="text-[11px] text-zinc-500 font-medium">{shortDate}</span>
                              <div className="min-w-0 flex items-center gap-2">
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 border ${statusClass}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                                <span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span>
                              </div>
                              <span className="text-[12px] text-zinc-900 font-semibold">
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
                    <section className="border border-zinc-200 bg-zinc-50 p-4">
                      <h4 className="text-xs font-semibold text-zinc-800 mb-2.5">AI signal</h4>

                      <div className="border border-zinc-200 bg-white px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">Detected intent</p>
                        <p className="text-sm text-zinc-900 mt-1">
                          <span className="font-semibold">
                            {aiDetectedIntent === 'none'
                              ? 'No dominant intent'
                              : aiDetectedIntent === 'invoice'
                              ? 'Invoice'
                              : aiDetectedIntent === 'booking'
                              ? 'Booking'
                              : aiDetectedIntent === 'quote'
                              ? 'Quote'
                              : 'Promo'}
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1">Confidence: {aiConfidencePercent}%</p>
                      </div>

                      <div className="mt-3">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">Suggested actions</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setShowMobileIntel(false);
                              setActiveToolId('booked');
                              setGlobalTab('tools');
                            }}
                            className={`w-full px-3 py-2 text-left border transition-colors ${
                              aiDetectedIntent === 'booking'
                                ? 'border-amber-600/60 bg-amber-600/10'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <p className="text-[12px] text-zinc-900 font-medium">Open BookedIt</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Suggested when booking intent is dominant.</p>
                          </button>

                          <button
                            onClick={() => {
                              setShowMobileIntel(false);
                              setActiveToolId('invoice');
                              setGlobalTab('tools');
                            }}
                            className={`w-full px-3 py-2 text-left border transition-colors ${
                              aiDetectedIntent === 'invoice'
                                ? 'border-amber-600/60 bg-amber-600/10'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <p className="text-[12px] text-zinc-900 font-medium">Open FastInvoice</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Suggested when invoice intent is dominant.</p>
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

            {/* ── TAB MODE ── */}
            {toolViewMode === 'tabs' && (
              <>
                <div className="relative border border-zinc-200 bg-zinc-50 overflow-hidden mb-4">
                  <div className="flex items-center">
                    <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex flex-row items-center gap-1 px-2 py-2">
                      {ALL_TOOLS.map(({ id, Icon, label }) => (
                        <button
                          key={id}
                          onClick={() => setActiveToolId(id)}
                          className={`flex-shrink-0 inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 min-h-[44px] transition-colors border ${
                            activeToolId === id
                              ? 'text-amber-700 bg-amber-600/10 border-amber-600/20'
                              : 'text-zinc-500 border-transparent hover:text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[9px] font-semibold uppercase tracking-wide">{label}</span>
                          {/* AI indicator dot */}
                          {aiExtraction?.tool === id && (
                            <span className="block h-1 w-1 bg-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setToolViewMode('list'); setActiveToolId(null); }}
                      className="flex-shrink-0 p-2.5 mr-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                      title="Switch to list view"
                    >
                      <LayoutList size={16} />
                    </button>
                  </div>
                  <div
                    className="pointer-events-none absolute top-0 right-10 h-full w-8"
                    style={{ background: 'linear-gradient(to left, #fafafa, transparent)' }}
                  />
                </div>

                <div className="pb-24">
                  {activeToolId === null ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center py-20 border border-zinc-200 bg-zinc-50">
                      <LayoutGrid size={28} className="text-zinc-700" />
                      <p className="text-sm text-zinc-400">Select a tab above to open a tool</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                      <div className="border border-zinc-200 bg-white p-4 md:col-span-2 lg:col-span-2">
                        {renderPlugin(activeToolId)}
                      </div>
                      <div className="border border-zinc-200 bg-white p-4">
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">Tool context</p>
                        <p className="mt-2 text-sm text-zinc-700">
                          Active module: <span className="font-semibold text-zinc-900">{activeModuleLabel}</span>
                        </p>
                        <p className="mt-2 text-sm font-semibold text-zinc-900">{activeToolContext.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{activeToolContext.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── LIST MODE ── */}
            {toolViewMode === 'list' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 border border-zinc-200 bg-zinc-50 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-700">Tools</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Tap to open</p>
                  </div>
                  <button
                    onClick={() => setToolViewMode('tabs')}
                    className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
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
                        <div key={id} className={`border ${isOpen ? 'border-amber-600/30' : 'border-zinc-200'} bg-white overflow-hidden`}>
                          <button
                            onClick={() => setActiveToolId(isOpen ? null : id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                              isOpen ? 'bg-zinc-100' : 'hover:bg-zinc-100'
                            }`}
                          >
                            <div className={`relative flex-shrink-0 h-9 w-9 ${color} flex items-center justify-center`}>
                              <Icon size={16} className="text-white" strokeWidth={2.25} />
                              {/* AI pre-fill indicator */}
                              {hasAi && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 border-2 border-white flex items-center justify-center">
                                  <Sparkles size={6} className="text-white" />
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-amber-700' : 'text-zinc-800'}`}>
                                  {label}
                                </p>
                                {hasAi && (
                                  <span className="text-[9px] font-semibold bg-amber-600/20 text-amber-700 px-1.5 py-0.5">
                                    AI ready
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{desc}</p>
                            </div>
                            <svg
                              className={`flex-shrink-0 transition-transform duration-200 text-zinc-400 ${isOpen ? 'rotate-90' : ''}`}
                              width="16" height="16" viewBox="0 0 16 16" fill="none"
                            >
                              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {isOpen && (
                            <div className="px-4 py-4 bg-zinc-50 border-t border-zinc-200">
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
                      <p className="text-xs text-zinc-400">
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50">
            <div className="px-4 py-6 md:py-8 md:px-6 max-w-6xl mx-auto w-full">
              <div className="md:flex md:gap-8 w-full">
                <aside className="md:w-64 flex flex-col gap-2 text-zinc-500 mb-5 md:mb-0">
                  {['Business Info', 'Connected Channels', 'Billing', 'Team Security'].map((item, index) => (
                    <button
                      key={item}
                      className={`w-full text-left px-3 py-2.5 text-sm border transition ${
                        index === 1
                          ? 'border-zinc-300 bg-zinc-100 text-zinc-900'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </aside>

                <section className="flex-1 bg-white border border-zinc-200 p-4 md:p-8 min-w-0">
                  {business ? (
                    <BusinessSettings business={business} onUpdated={(updated) => setBusiness(updated)} />
                  ) : (
                    <p className="text-sm text-zinc-500">Loading business profile…</p>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom nav (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { tab: 'chats'    as GlobalTab, icon: <Inbox    size={20} />, label: 'Inbox'    },
            { tab: 'tools'    as GlobalTab, icon: <Zap      size={20} />, label: 'Tools'    },
            { tab: 'settings' as GlobalTab, icon: <Settings size={20} />, label: 'Settings' },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => { setGlobalTab(tab); if (tab !== 'chats') setActiveContact(null); }}
              className={`flex flex-col items-center gap-1 px-5 py-2 transition-colors ${
                globalTab === tab
                  ? 'text-amber-700 bg-amber-600/10'
                  : 'text-zinc-400 hover:text-zinc-500'
              }`}
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex flex-col items-center gap-1 px-5 py-2 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-40"
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
