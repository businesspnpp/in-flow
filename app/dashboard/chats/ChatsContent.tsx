'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isMissingTableError } from '@/lib/inflow-client';
import {
  ArrowRight, ArrowUpRight, CalendarCheck, CheckCheck, ChevronDown, ChevronLeft, ChevronRight,
  Download, FileText, Filter, Hash, Inbox, Info, MessageSquare, MoreHorizontal, Paperclip, Phone,
  Search, Smile, Sparkles, Star, Tag, UserPlus, Users, UtensilsCrossed, Wrench,
} from 'lucide-react';

/* ================================================================== */
/* Types                                                               */
/* ================================================================== */

type Message = { id: string; sender: 'business' | 'customer'; body: string; created_at: string; };
type InflowTransaction = { id: string; created_at: string; status: string; total: number; currency: string; type: string; reference: string; };
type MockMsg = { sender: 'business' | 'customer'; time: string; text: string; };
type MockConversation = { id: string; customerName: string; channel: string; avatarColor: string; lastMessageTime: string; unreadCount: number; statusTag: string; statusColor: string; messages: MockMsg[]; context: { totalSpent: string; orderVolume: number; loyalty: string; intent: string; }; };
interface AiExtraction { tool: string | null; prefill: Record<string, unknown>; confidence: number; extraction?: { detectedIntent?: string }; }
type PanelKey = 'list' | 'directory' | 'thread' | 'context';
type DirChannel = 'whatsapp' | 'instagram' | 'tiktok';
type DirCustomer = { id: string; name: string; avatarColor: string; initials: string; contact: string; channels: DirChannel[]; online: boolean; lastInteractionDays: number; };
type MobileScreen = 'list' | 'thread' | 'profile';
type MobileListTab = 'inbox' | 'directory';

/* ================================================================== */
/* Brand glyphs (lucide has no brand icons)                            */
/* ================================================================== */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path fill="#fff" d="M16 7.5c-4.7 0-8.5 3.8-8.5 8.5 0 1.5.4 2.9 1.1 4.2L7.5 24.5l4.5-1.1c1.2.7 2.6 1.1 4 1.1 4.7 0 8.5-3.8 8.5-8.5S20.7 7.5 16 7.5Zm4.9 12.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
    </svg>
  );
}
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <defs>
        <radialGradient id="igGradMain" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" /><stop offset="20%" stopColor="#fdf497" />
          <stop offset="40%" stopColor="#fd5949" /><stop offset="60%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="16" fill="url(#igGradMain)" />
      <rect x="9" y="9" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.6" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="20.3" cy="11.7" r="0.9" fill="#fff" />
    </svg>
  );
}
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#000" />
      <path fill="#fff" d="M19.3 8.5c.5 1.6 1.6 2.7 3.3 2.9v2.4c-1.2 0-2.3-.4-3.3-1.1v5.6c0 2.8-2.2 5-5 5-1 0-2-.3-2.8-.9a5 5 0 0 1 5.5-7.8v2.6a2.4 2.4 0 1 0 1.7 2.3v-11h.6Z" />
    </svg>
  );
}
const DIR_CHANNEL_ICON: Record<DirChannel, (p?: { size?: number }) => JSX.Element> = {
  whatsapp: (p) => <WhatsAppIcon {...p} />,
  instagram: (p) => <InstagramIcon {...p} />,
  tiktok: (p) => <TikTokIcon {...p} />,
};

/* ================================================================== */
/* Mock data — Inbox (chat list + thread)                              */
/* ================================================================== */

const CHANNEL_COLORS: Record<string, string> = { WhatsApp: 'bg-emerald-600', Instagram: 'bg-zinc-700', Email: 'bg-blue-600', SMS: 'bg-slate-600', 'Facebook Business': 'bg-blue-700' };
const CHANNEL_DOT: Record<string, string> = { WhatsApp: 'bg-emerald-500', Instagram: 'bg-zinc-500', Email: 'bg-blue-500', SMS: 'bg-slate-500', 'Facebook Business': 'bg-blue-400' };
const TOOL_ACTIONS = [
  { label: 'Invoice',  Icon: FileText,        text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.' },
  { label: 'BookedIt', Icon: CalendarCheck,   text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!' },
  { label: 'Quote',    Icon: Wrench,          text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00' },
  { label: 'Menu',     Icon: UtensilsCrossed, text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.' },
];
const MOCK_CONVERSATIONS: MockConversation[] = [
  { id:'chat_1',customerName:'Customer One',channel:'WhatsApp',avatarColor:'CO',lastMessageTime:'Now',unreadCount:1,statusTag:'New Lead',statusColor:'border-emerald-200 text-emerald-700 bg-emerald-50',messages:[{sender:'customer',time:'06:23 PM',text:"Hi! I'd like to book an appointment for a hair wash, treatment, and styling this week if you have any openings?"}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'BookedIt Action Controller'}},
  { id:'chat_2',customerName:'Thabo Nkosi',channel:'Instagram',avatarColor:'TN',lastMessageTime:'2m',unreadCount:3,statusTag:'Urgent',statusColor:'border-rose-200 text-rose-700 bg-rose-50',messages:[{sender:'customer',time:'06:21 PM',text:'Interested in the property you advertised on your stories, can we arrange a walkthrough schedule for Thursday afternoon?'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'BookedIt Action Controller'}},
  { id:'chat_3',customerName:'Priya Maharaj',channel:'Email',avatarColor:'PM',lastMessageTime:'14m',unreadCount:0,statusTag:'Sales',statusColor:'border-purple-200 text-purple-700 bg-purple-50',messages:[{sender:'customer',time:'06:09 PM',text:'My fixed term mortgage is up for renewal soon. Can you send over a formal quotation matching the rates we discussed?'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'QuoteCraft Action Controller'}},
  { id:'chat_4',customerName:'James Okafor',channel:'SMS',avatarColor:'JO',lastMessageTime:'1h',unreadCount:0,statusTag:'General',statusColor:'border-zinc-300 text-zinc-500 bg-zinc-100',messages:[{sender:'customer',time:'05:15 PM',text:'Thanks for the quick response! Let me know when the payment link is generated so I can wrap this up.'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'FastInvoice Action Controller'}},
  { id:'chat_5',customerName:'Lindiwe Dlamini',channel:'WhatsApp',avatarColor:'LD',lastMessageTime:'15m',unreadCount:2,statusTag:'Retail Sale',statusColor:'border-amber-200 text-amber-700 bg-amber-50',messages:[{sender:'customer',time:'06:28 PM',text:'Hi, do you have 5 boxes of the high-top leather sneakers left in size 8? If yes, please send me an invoice directly so I can secure them right now.'}],context:{totalSpent:'R 4,200.00',orderVolume:2,loyalty:'Silver Tier',intent:'FastInvoice Action Controller'}},
  { id:'chat_6',customerName:'Sipho Mthembu',channel:'WhatsApp',avatarColor:'SM',lastMessageTime:'32m',unreadCount:0,statusTag:'Barber / Fade',statusColor:'border-blue-200 text-blue-700 bg-blue-50',messages:[{sender:'customer',time:'06:11 PM',text:'Yo! Need a sharp Taper Fade with dye before my weekend event. What slots does the master barber have open tomorrow afternoon?'}],context:{totalSpent:'R 1,850.00',orderVolume:8,loyalty:'Gold VIP',intent:'BookedIt Action Controller'}},
  { id:'chat_7',customerName:'Elena Rostova',channel:'Instagram',avatarColor:'ER',lastMessageTime:'45m',unreadCount:1,statusTag:'Quote Request',statusColor:'border-purple-200 text-purple-700 bg-purple-50',messages:[{sender:'customer',time:'05:58 PM',text:'Hello, I am interested in your custom catering menu for a corporate group of 45 people. Can you generate a custom price estimate for me?'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'QuoteCraft Action Controller'}},
  { id:'chat_8',customerName:'Brandon Stark',channel:'Facebook Business',avatarColor:'BS',lastMessageTime:'2h',unreadCount:0,statusTag:'Inventory Menu',statusColor:'border-teal-200 text-teal-700 bg-teal-50',messages:[{sender:'customer',time:'04:43 PM',text:'Hey, could you send over your latest product catalog or digital price menu? I want to see what shades you have available in stock.'}],context:{totalSpent:'R 850.00',orderVolume:1,loyalty:'Starter',intent:'MenuDrop Action Controller'}},
  { id:'chat_9',customerName:'Zanele Khumalo',channel:'WhatsApp',avatarColor:'ZK',lastMessageTime:'3h',unreadCount:0,statusTag:'Payment Pending',statusColor:'border-rose-200 text-rose-700 bg-rose-50',messages:[{sender:'customer',time:'03:12 PM',text:"I'm ready to checkout for the custom jewelry piece. Can you drop a secure PayNow link here so I can process the transaction via EFT?"}],context:{totalSpent:'R 12,500.00',orderVolume:3,loyalty:'Gold VIP',intent:'FastInvoice Action Controller'}},
  { id:'chat_10',customerName:'Marcus Vance',channel:'SMS',avatarColor:'MV',lastMessageTime:'4h',unreadCount:0,statusTag:'Wholesale Buyer',statusColor:'border-amber-200 text-amber-700 bg-amber-50',messages:[{sender:'customer',time:'02:05 PM',text:'We need to restock 50 units of the industrial valves for our site. Please issue a comprehensive itemized quote with bulk tier discounts.'}],context:{totalSpent:'R 45,000.00',orderVolume:5,loyalty:'Enterprise Platinum',intent:'QuoteCraft Action Controller'}},
  { id:'chat_11',customerName:'Amina Diop',channel:'Instagram',avatarColor:'AD',lastMessageTime:'5h',unreadCount:0,statusTag:'New Lead',statusColor:'border-emerald-200 text-emerald-700 bg-emerald-50',messages:[{sender:'customer',time:'01:15 PM',text:'Stumbled onto your design profile! Do you have a list of service pack rates or a menu of options for brand consulting?'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'MenuDrop Action Controller'}},
  { id:'chat_12',customerName:'Tariq Mahmood',channel:'WhatsApp',avatarColor:'TM',lastMessageTime:'1d',unreadCount:0,statusTag:'Service Delivery',statusColor:'border-blue-200 text-blue-700 bg-blue-50',messages:[{sender:'customer',time:'Yesterday',text:'The delivery arrived safely. Please send the final invoice statement so our accounting department can close out the ledger point.'}],context:{totalSpent:'R 3,100.00',orderVolume:1,loyalty:'Silver Tier',intent:'FastInvoice Action Controller'}},
  { id:'chat_13',customerName:'Chloe Jenkins',channel:'Facebook Business',avatarColor:'CJ',lastMessageTime:'1d',unreadCount:0,statusTag:'General',statusColor:'border-zinc-300 text-zinc-500 bg-zinc-100',messages:[{sender:'customer',time:'Yesterday',text:'What are your operational hours over the coming public holiday? Just want to know if I can still come by for collections.'}],context:{totalSpent:'R 450.00',orderVolume:1,loyalty:'Starter',intent:'No dominant intent'}},
  { id:'chat_14',customerName:'Dumi Ndlovu',channel:'WhatsApp',avatarColor:'DN',lastMessageTime:'2d',unreadCount:0,statusTag:'Barber / Cut',statusColor:'border-blue-200 text-blue-700 bg-blue-50',messages:[{sender:'customer',time:'2 days ago',text:'Hey check, can I change my appointment time from 10:00 AM to 02:30 PM this Saturday? Let me know if that spot is open on your book.'}],context:{totalSpent:'R 900.00',orderVolume:4,loyalty:'Silver Tier',intent:'BookedIt Action Controller'}},
  { id:'chat_15',customerName:'Sophia Martinez',channel:'Instagram',avatarColor:'SM',lastMessageTime:'3d',unreadCount:0,statusTag:'Bulk Order',statusColor:'border-amber-200 text-amber-700 bg-amber-50',messages:[{sender:'customer',time:'3 days ago',text:'We need an explicit cost estimation matrix for 100 customized hoodies with embroidered emblems. Please create a draft quote record.'}],context:{totalSpent:'R 0,00',orderVolume:0,loyalty:'Starter',intent:'QuoteCraft Action Controller'}},
];

const INIT_MSGS: Record<string, Message[]> = MOCK_CONVERSATIONS.reduce((acc, conv) => {
  acc[conv.id] = conv.messages.map((m, i) => ({ id: `${conv.id}_m_${i + 1}`, sender: m.sender, body: m.text, created_at: new Date(Date.now() - (conv.messages.length - i) * 60_000).toISOString() }));
  return acc;
}, {} as Record<string, Message[]>);

/* ================================================================== */
/* Mock data — Customer directory                                      */
/* ================================================================== */

const DIR_TABS = ['All Customers', 'Channels & DMs', 'Team Members', 'Workflows & Plugins', 'Calendars & Sync', 'Billing & Plan'];

const DIR_CUSTOMERS: DirCustomer[] = [
  { id: 'c1', name: 'Lindiwe', avatarColor: 'bg-amber-700', initials: 'LD', contact: '+27 82 386 0192 / lindiwe@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 13 },
  { id: 'c2', name: 'Thabo', avatarColor: 'bg-zinc-800', initials: 'TN', contact: '+27 71 940 2218 / thabo.nkosi@gmail.com', channels: ['whatsapp', 'instagram', 'tiktok'], online: true, lastInteractionDays: 13 },
  { id: 'c3', name: 'Sipho', avatarColor: 'bg-orange-700', initials: 'SM', contact: '+27 84 552 7710 / sipho.m@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 29 },
  { id: 'c4', name: 'Zanele', avatarColor: 'bg-rose-700', initials: 'ZK', contact: '+27 76 213 4490 / zanele.k@gmail.com', channels: ['whatsapp', 'instagram'], online: true, lastInteractionDays: 31 },
];

// Links a directory row to its real conversation in the Inbox panel
const CUSTOMER_TO_CHAT: Record<string, string> = { c1: 'chat_5', c2: 'chat_2', c3: 'chat_6', c4: 'chat_9' };

const RECENT_INQUIRIES = [
  { name: 'Lindiwe', avatarColor: 'bg-amber-700', initials: 'LD', channel: 'whatsapp' as DirChannel, message: "You're worn out — sent the rebooking link." },
  { name: 'Thabo', avatarColor: 'bg-zinc-800', initials: 'TN', channel: 'instagram' as DirChannel, message: 'We restocked the listing you asked about.' },
  { name: 'Sipho', avatarColor: 'bg-orange-700', initials: 'SM', channel: 'tiktok' as DirChannel, message: 'Hn... yeah Saturday afternoon works for t...' },
];
const SEGMENTS = ['VIP Customers', 'New This Month', 'Needs Follow-Up'];
const TOP_BOOKING_CLIENTS = [
  { name: 'Lindiwe', count: 16 },
  { name: 'Sipho', count: 14 },
  { name: 'Thabo', count: 5 },
];

/* ================================================================== */
/* Collapsible panel shell (desktop only)                              */
/* ================================================================== */

function CollapsiblePanel({
  title, icon: Icon, expanded, onToggle, widthClass, border = 'right', children,
}: {
  title: string;
  icon: any;
  expanded: boolean;
  onToggle: () => void;
  widthClass: string;
  border?: 'left' | 'right';
  children: React.ReactNode;
}) {
  const borderClass = border === 'left' ? 'border-l' : 'border-r';
  if (!expanded) {
    return (
      <div className={`flex-shrink-0 w-11 flex flex-col items-center bg-white ${borderClass} border-zinc-200 py-4 gap-3`}>
        <button onClick={onToggle} title={`Expand ${title}`} className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition">
          <Icon size={16} />
        </button>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide [writing-mode:vertical-rl] rotate-180">{title}</span>
      </div>
    );
  }
  return (
    <div className={`flex-shrink-0 flex flex-col bg-white ${borderClass} border-zinc-200 overflow-hidden ${widthClass}`}>
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50/60">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700"><Icon size={14} className="text-zinc-400" /> {title}</div>
        <button onClick={onToggle} title={`Collapse ${title}`} className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:bg-zinc-200/60 transition">
          {border === 'left' ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}

/* ================================================================== */
/* Mobile segmented tab bar (Inbox / Customers)                        */
/* ================================================================== */

function MobileListTabs({ active, onChange }: { active: MobileListTab; onChange: (tab: MobileListTab) => void; }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-1.5 px-4 pt-3 pb-2 bg-white border-b border-zinc-200">
      <button
        onClick={() => onChange('inbox')}
        className={`flex items-center gap-1.5 flex-1 justify-center rounded-lg py-1.5 text-xs font-semibold transition ${active === 'inbox' ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600'}`}
      >
        <Inbox size={13} /> Inbox
      </button>
      <button
        onClick={() => onChange('directory')}
        className={`flex items-center gap-1.5 flex-1 justify-center rounded-lg py-1.5 text-xs font-semibold transition ${active === 'directory' ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600'}`}
      >
        <Users size={13} /> Customers
      </button>
    </div>
  );
}

/* ================================================================== */
/* Main component                                                      */
/* ================================================================== */

export default function ChatsContent() {
  const router = useRouter();

  // desktop panel collapse state
  const [panels, setPanels] = useState<Record<PanelKey, boolean>>({ list: true, directory: true, thread: true, context: true });

  // mobile navigation state (drill-down: list -> thread -> profile)
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('list');
  const [mobileListTab, setMobileListTab] = useState<MobileListTab>('inbox');

  // inbox / thread
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [msgsByContact, setMsgsByContact] = useState<Record<string, Message[]>>(INIT_MSGS);
  const [input, setInput] = useState('');
  const [listSearch, setListSearch] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExtraction, setAiExtraction] = useState<AiExtraction | null>(null);
  const [txns, setTxns] = useState<InflowTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [invMissing, setInvMissing] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  // directory
  const [directorySearch, setDirectorySearch] = useState('');
  const [activeDirTab, setActiveDirTab] = useState(DIR_TABS[0]);

  const selected = MOCK_CONVERSATIONS.find(c => c.id === activeContact);
  const curMsgs = useMemo(() => activeContact ? (msgsByContact[activeContact] ?? []) : [], [activeContact, msgsByContact]);
  const aiIntent = useMemo<'booking' | 'invoice' | 'quote' | 'promo' | 'none'>(() => {
    const ei = aiExtraction?.extraction?.detectedIntent;
    if (ei === 'booking' || ei === 'invoice' || ei === 'quote' || ei === 'promo') return ei as any;
    if (aiExtraction?.tool === 'booked') return 'booking';
    if (aiExtraction?.tool === 'invoice') return 'invoice';
    if (aiExtraction?.tool === 'quote') return 'quote';
    if (aiExtraction?.tool === 'promo') return 'promo';
    return 'none';
  }, [aiExtraction]);
  const aiConf = useMemo(() => Math.max(0, Math.min(99, Math.round((aiExtraction?.confidence ?? 0) * 100))), [aiExtraction]);
  const ltv = useMemo(() => txns.reduce((s, t) => s + Number(t.total || 0), 0), [txns]);
  const orderVol = useMemo(() => txns.length, [txns]);
  const statusLabel = useMemo(() => orderVol === 0 ? 'New Lead' : orderVol === 1 ? 'First-Time Buyer' : 'Repeat Client', [orderVol]);
  const loyalty = useMemo(() => {
    if (ltv < 500) return { tier: 'Starter', nextTier: 'Growth', target: 500, progress: Math.round(ltv / 500 * 100) };
    if (ltv < 2500) return { tier: 'Growth', nextTier: 'Elite', target: 2500, progress: Math.round(ltv / 2500 * 100) };
    return { tier: 'Elite', nextTier: 'Elite+', target: ltv, progress: 100 };
  }, [ltv]);

  useEffect(() => {
    if (!activeContact || !selected || invMissing) { setTxns([]); return; }
    setTxLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('inflow_invoices').select('id,created_at,status,total,currency,type,reference')
          .eq('customer_name', selected.customerName).order('created_at', { ascending: false }).limit(5);
        if (error) { if (isMissingTableError(error, 'inflow_invoices')) setInvMissing(true); setTxns([]); }
        else setTxns((data ?? []) as InflowTransaction[]);
      } catch { setTxns([]); } finally { setTxLoading(false); }
    })();
  }, [activeContact, invMissing, selected]);

  useEffect(() => {
    if (!activeContact) return;
    setMsgsByContact(prev => prev[activeContact] ? prev : { ...prev, [activeContact]: [] });
  }, [activeContact]);
  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  function togglePanel(key: PanelKey) { setPanels(prev => ({ ...prev, [key]: !prev[key] })); }

  function selectChat(id: string) {
    setActiveContact(id);
    setPanels(prev => ({ ...prev, thread: true, context: true }));
    setMobileScreen('thread');
  }
  function selectCustomerRow(customerId: string) {
    const chatId = CUSTOMER_TO_CHAT[customerId];
    if (chatId) selectChat(chatId);
  }

  function scrollBottom() { window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50); }
  function appendMsg(text: string, sender: 'business' | 'customer' = 'business', cid: string | null = activeContact) {
    if (!cid) return;
    setMsgsByContact(prev => ({ ...prev, [cid]: [...(prev[cid] ?? []), { id: `m-${Date.now()}`, sender, body: text, created_at: new Date().toISOString() }] }));
    if (cid === activeContact) scrollBottom();
  }
  function autoReply(text: string) {
    const n = text.toLowerCase();
    if (/(hello|hi|details)/.test(n)) return 'Awesome, thank you! Do you have a free slot available this Tuesday afternoon?';
    if (/(booking|scheduled|confirmed)/.test(n)) return 'Perfect! 16:00 on Tuesday works beautifully for me. See you then!';
    if (/(invoice|payment|r250)/.test(n)) return "Got the summary, thank you! I'll see you on Tuesday and settle up right after.";
    return 'Sounds good, thanks for confirming! Let me know what the next steps are.';
  }
  function scheduleReply(text: string, cid: string) {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => { appendMsg(autoReply(text), 'customer', cid); replyTimer.current = null; }, 4000);
  }
  function handleSend() {
    if (!activeContact) return;
    const t = input.trim(); if (!t) return;
    appendMsg(t, 'business', activeContact); setInput(''); scheduleReply(t, activeContact);
  }
  function handleTool(text: string) { if (activeContact) { appendMsg(text, 'business', activeContact); scheduleReply(text, activeContact); } }
  async function handleAi() {
    if (!activeContact || curMsgs.length === 0) return;
    setAiLoading(true); setAiExtraction(null);
    try {
      const transcript = curMsgs.map(m => `${m.sender === 'business' ? 'Business' : 'Customer'}: ${m.body}`).join('\n');
      const res = await fetch('/api/ai/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transcript }) });
      if (!res.ok) throw new Error('failed');
      const data: AiExtraction = await res.json();
      setAiExtraction(data);
      if (data.tool) router.push('/dashboard/tools');
    } catch (e) { console.error(e); } finally { setAiLoading(false); }
  }

  const filteredChats = MOCK_CONVERSATIONS.filter(c =>
    c.customerName.toLowerCase().includes(listSearch.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(listSearch.toLowerCase()))
  );
  const filteredCustomers = DIR_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(directorySearch.toLowerCase()) || c.contact.toLowerCase().includes(directorySearch.toLowerCase())
  );

  /* ================================================================ */
  /* Shared content blocks — reused by both the desktop columns and    */
  /* the mobile full-screen drill-down views.                          */
  /* ================================================================ */

  function renderInboxList() {
    return (
      <>
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-zinc-900">Inbox</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">{MOCK_CONVERSATIONS.length} conversations</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition"><Hash size={14} /></button>
              <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition"><Users size={14} /></button>
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={listSearch} onChange={e => setListSearch(e.target.value)} placeholder="Search conversations…" className="w-full h-9 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-blue-400 focus:bg-white transition" />
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {['All', 'Unread', 'Mine'].map(f => (
              <button key={f} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${f === 'All' ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-zinc-100">
          {filteredChats.map(contact => (
            <button key={contact.id} onClick={() => selectChat(contact.id)} className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50/60 active:bg-blue-50 ${activeContact === contact.id ? 'bg-blue-50/80' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shadow-sm ${CHANNEL_COLORS[contact.channel] || 'bg-zinc-600'}`}>{contact.avatarColor}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${CHANNEL_DOT[contact.channel] || 'bg-zinc-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[12px] font-semibold text-zinc-900 truncate">{contact.customerName}</span>
                  <span className="text-[10px] text-zinc-400 flex-shrink-0">{contact.lastMessageTime}</span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate leading-snug">{contact.messages[0]?.text || ''}</p>
                {contact.statusTag && <span className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${contact.statusColor}`}>{contact.statusTag}</span>}
              </div>
              {contact.unreadCount > 0 && <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{contact.unreadCount}</span>}
            </button>
          ))}
        </div>
      </>
    );
  }

  function renderDirectory() {
    return (
      <div className="p-4 space-y-4">
        {/* mini banner */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-sky-100 flex items-center justify-center"><ArrowUpRight size={13} className="text-sky-600" strokeWidth={2.5} /></div>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-zinc-900 leading-snug">Manage and Segment Your &lsquo;dock&rsquo; Customer Base.</h3>
                <p className="text-[11px] text-zinc-600 mt-0.5">View profiles and interaction history, Lindiwe.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            <button className="flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-orange-600 transition"><Download size={11} /> Export</button>
            <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-blue-700 transition"><UserPlus size={11} /> Add Customer</button>
          </div>
        </div>

        {/* tabs */}
        <div className="border-b border-zinc-200 overflow-x-auto scrollbar-none">
          <nav className="flex gap-4 whitespace-nowrap">
            {DIR_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveDirTab(tab)} className={`relative pb-2 text-[11px] font-medium transition-colors ${activeDirTab === tab ? 'text-blue-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
                {tab}
                {activeDirTab === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </nav>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative flex-1 min-w-[110px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={directorySearch} onChange={e => setDirectorySearch(e.target.value)} placeholder="Search" className="w-full h-8 rounded-lg border border-zinc-200 bg-white pl-7 pr-2 text-[11px] text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-blue-400 transition" />
          </div>
          <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition"><Filter size={12} /></button>
          <button className="h-8 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition">Segment <ChevronDown size={11} /></button>
        </div>
        <div className="flex gap-1.5 -mt-2">
          <button className="h-7 rounded-lg bg-zinc-100 px-2.5 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-200 transition">Recent DM Inquiries</button>
          <button className="h-7 rounded-lg bg-zinc-100 px-2.5 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-200 transition">Frequent Bookers</button>
        </div>

        {/* table */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-x-auto">
          <table className="w-full text-[11px] min-w-[480px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2 pl-3 pr-2 text-left font-semibold uppercase tracking-wide text-zinc-500">Profile</th>
                <th className="py-2 px-2 text-left font-semibold uppercase tracking-wide text-zinc-500">Name</th>
                <th className="py-2 px-2 text-left font-semibold uppercase tracking-wide text-zinc-500">Contact</th>
                <th className="py-2 px-2 text-left font-semibold uppercase tracking-wide text-zinc-500">Channels</th>
                <th className="py-2 px-2 pr-3 text-left font-semibold uppercase tracking-wide text-zinc-500">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCustomers.map(c => (
                <tr key={c.id} onClick={() => selectCustomerRow(c.id)} className="cursor-pointer hover:bg-blue-50/50 active:bg-blue-50 transition-colors">
                  <td className="py-2 pl-3 pr-2"><div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${c.avatarColor}`}>{c.initials}</div></td>
                  <td className="py-2 px-2 font-medium text-zinc-900">{c.name}</td>
                  <td className="py-2 px-2 text-zinc-500 max-w-[120px] truncate">{c.contact}</td>
                  <td className="py-2 px-2"><div className="flex items-center gap-1">{c.channels.map(ch => <span key={ch}>{DIR_CHANNEL_ICON[ch]({ size: 15 })}</span>)}{c.online && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />}</div></td>
                  <td className="py-2 px-2 pr-3 text-zinc-500">{c.lastInteractionDays}d ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* insight cards (stacked) */}
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <h4 className="text-[11px] font-semibold text-zinc-900 mb-1">Recent DM Inquiries</h4>
          <p className="text-[10px] text-zinc-400 mb-2">Last Message</p>
          <div className="space-y-2">
            {RECENT_INQUIRIES.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-semibold text-white ${item.avatarColor}`}>{item.initials}</div>
                  <span className="absolute -bottom-1 -right-1">{DIR_CHANNEL_ICON[item.channel]({ size: 12 })}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <h4 className="text-[11px] font-semibold text-zinc-900 mb-1">Segment & Tag</h4>
          <div className="relative mb-2 mt-2">
            <Tag size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input placeholder="Tag customer..." className="w-full h-7 rounded-lg border border-zinc-200 bg-zinc-50 pl-7 pr-2 text-[10px] text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-blue-400 transition" />
          </div>
          <div className="space-y-1.5">
            {SEGMENTS.map(seg => (
              <button key={seg} className="w-full flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-100 transition">
                {seg} <ChevronRight size={12} className="text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <h4 className="text-[11px] font-semibold text-zinc-900 mb-1">Customer Insights</h4>
          <p className="text-[10px] text-zinc-400">New Customers (Last 30 Days)</p>
          <p className="text-2xl font-bold text-zinc-900 mt-0.5 mb-2">13</p>
          <p className="text-[10px] text-zinc-400 mb-1.5">Top Booking Clients</p>
          <div className="space-y-1">
            {TOP_BOOKING_CLIENTS.map(client => (
              <div key={client.name} className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-700 font-medium">{client.name}</span>
                <span className="text-zinc-900 font-semibold">{client.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderThread(mobile: boolean) {
    if (!activeContact) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center"><MessageSquare size={28} className="text-blue-400" /></div>
          <div className="text-center"><p className="text-sm font-medium text-zinc-500">Select a conversation</p><p className="text-xs text-zinc-400 mt-1">Choose from the Inbox or Customers panel</p></div>
        </div>
      );
    }
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-zinc-200 bg-white">
          {mobile && (
            <button onClick={() => setMobileScreen('list')} className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition">
              <ChevronLeft size={18} />
            </button>
          )}
          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm ${CHANNEL_COLORS[selected?.channel || 'SMS']}`}>{selected?.avatarColor}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{selected?.customerName}</p>
            <div className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOT[selected?.channel || 'SMS'] || 'bg-zinc-400'}`} /><p className="text-xs text-zinc-500">{selected?.channel}</p></div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleAi} disabled={aiLoading} className={`flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-lg text-xs font-medium transition-colors border ${aiLoading ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse cursor-wait' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}`}>
              <Sparkles size={13} /><span className="hidden sm:inline">{aiLoading ? 'Reading…' : 'AI Assist'}</span>
            </button>
            <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Phone size={15} /></button>
            <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Star size={15} /></button>
            {mobile ? (
              <button onClick={() => setMobileScreen('profile')} className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition"><Info size={16} /></button>
            ) : (
              <button className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><MoreHorizontal size={15} /></button>
            )}
          </div>
        </div>
        {aiExtraction?.tool && (
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-blue-50 border-b border-blue-100">
            <Sparkles size={13} className="text-blue-700 flex-shrink-0" />
            <p className="text-xs text-blue-800 flex-1">AI detected a <span className="font-semibold capitalize">{aiExtraction.tool}</span> request{aiExtraction.confidence >= 0.8 ? ' — form pre-filled, review and send.' : ' — check the pre-fill before sending.'}</p>
            <button onClick={() => router.push('/dashboard/tools')} className="flex-shrink-0 rounded-lg text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-1 hover:bg-blue-200 transition">Open tool →</button>
          </div>
        )}
        <div className="flex-shrink-0 border-b border-zinc-200 bg-white overflow-x-auto scrollbar-none px-3 sm:px-4 py-2">
          <div className="flex gap-2 whitespace-nowrap">
            {TOOL_ACTIONS.map(tool => {
              const TI = tool.Icon;
              return <button key={tool.label} onClick={() => handleTool(tool.text)} className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 active:bg-blue-100 transition-colors"><TI size={13} />{tool.label}</button>;
            })}
          </div>
        </div>
        <div key={activeContact} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 my-2"><div className="flex-1 h-px bg-zinc-200" /><span className="text-[10px] text-zinc-400 font-medium uppercase">Today</span><div className="flex-1 h-px bg-zinc-200" /></div>
          {curMsgs.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'customer' && <div className={`h-7 w-7 rounded-full flex-shrink-0 self-end flex items-center justify-center text-[10px] font-bold text-white ${CHANNEL_COLORS[selected?.channel || 'SMS'] || 'bg-zinc-600'}`}>{selected?.avatarColor}</div>}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col gap-1 ${msg.sender === 'business' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'business' ? 'bg-blue-600 text-white font-medium rounded-br-md' : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-md'}`}>{msg.body}</div>
                <div className={`flex items-center gap-1 ${msg.sender === 'business' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-zinc-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sender === 'business' && <CheckCheck size={12} className="text-blue-600" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex-shrink-0 border-t border-zinc-200 bg-white px-3 sm:px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-2 rounded-full bg-zinc-100 border border-zinc-200 px-4 py-2 focus-within:border-blue-400 focus-within:bg-white transition-colors">
            <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0"><Paperclip size={16} /></button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message…" className="flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 min-w-0" />
            <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0"><Smile size={16} /></button>
            <button onClick={handleSend} disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"><ArrowRight size={15} /></button>
          </div>
        </div>
      </div>
    );
  }

  function renderProfile(mobile: boolean) {
    if (!selected) {
      return (
        <div className="h-full flex items-center justify-center px-6 text-center"><p className="text-xs text-zinc-500 leading-relaxed">Select a conversation to see customer profile, transactions, and AI signal.</p></div>
      );
    }
    return (
      <div className="h-full flex flex-col">
        {mobile && (
          <div className="flex-shrink-0 flex items-center gap-3 px-3 py-3 border-b border-zinc-200 bg-white">
            <button onClick={() => setMobileScreen('thread')} className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition"><ChevronLeft size={18} /></button>
            <p className="text-sm font-semibold text-zinc-900">Customer profile</p>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div><p className="text-xs text-zinc-500 font-medium">{selected.customerName}</p><p className="text-[11px] text-zinc-500 mt-0.5">{selected.channel}</p></div>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${orderVol === 0 ? 'border-zinc-200 text-zinc-500 bg-zinc-100' : orderVol === 1 ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'}`}>{statusLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Total spent</p><p className="text-lg font-bold text-zinc-900 mt-1">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(ltv)}</p></div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</p><p className="text-lg font-bold text-zinc-900 mt-1">{orderVol}</p></div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between mb-1.5"><p className="text-[11px] text-zinc-500">Loyalty tier</p><p className="text-[11px] text-zinc-800 font-medium">{loyalty.tier}</p></div>
              <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden"><div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.max(3, loyalty.progress)}%` }} /></div>
              <p className="text-[10px] text-zinc-500 mt-2">Next: {loyalty.nextTier}{ltv < 2500 ? ` — R${Math.max(0, loyalty.target - ltv).toFixed(2)} to go` : ''}</p>
            </div>
          </section>
          <section className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3"><h4 className="text-xs font-semibold text-zinc-800">Recent transactions</h4>{txLoading && <span className="text-[10px] text-zinc-500">Loading…</span>}</div>
            <div className="space-y-2">
              {!txLoading && txns.length === 0 && <p className="text-[11px] text-zinc-500">No invoices or quotes for this customer yet.</p>}
              {txns.map(txn => {
                const s = String(txn.status || '').toLowerCase();
                const sc = s === 'paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : (s === 'pending' || s === 'sent' || s === 'draft') ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-rose-200 text-rose-700 bg-rose-50';
                return <div key={txn.id} className="grid grid-cols-[58px_1fr_auto] items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2"><span className="text-[11px] text-zinc-500 font-medium">{new Date(txn.created_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</span><div className="min-w-0 flex items-center gap-2"><span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${sc}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span><span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span></div><span className="text-[12px] text-zinc-900 font-semibold">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: txn.currency || 'ZAR', maximumFractionDigits: 2 }).format(Number(txn.total || 0))}</span></div>;
              })}
            </div>
          </section>
          <section className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4">
            <h4 className="text-xs font-semibold text-zinc-800 mb-2.5">AI signal</h4>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Detected intent</p>
              <p className="text-sm text-zinc-900 mt-1 font-semibold">{aiIntent === 'none' ? 'No dominant intent' : aiIntent === 'invoice' ? 'Invoice' : aiIntent === 'booking' ? 'Booking' : aiIntent === 'quote' ? 'Quote' : 'Promo'}</p>
              <p className="text-[11px] text-zinc-500 mt-1">Confidence: {aiConf}%</p>
            </div>
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">Suggested actions</p>
              <div className="space-y-2">
                {(['booked', 'invoice'] as const).map(tool => {
                  const isMatch = (tool === 'booked' && aiIntent === 'booking') || (tool === 'invoice' && aiIntent === 'invoice');
                  return <button key={tool} onClick={() => router.push('/dashboard/tools')} className={`w-full px-3 py-2 text-left rounded-lg border transition-colors ${isMatch ? 'border-blue-300 bg-blue-50' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}><p className="text-[12px] text-zinc-900 font-medium">{tool === 'booked' ? 'Open BookedIt' : 'Open FastInvoice'}</p><p className="text-[10px] text-zinc-500 mt-0.5">{tool === 'booked' ? 'Suggested when booking intent is dominant.' : 'Suggested when invoice intent is dominant.'}</p></button>;
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /* Render                                                            */
  /* ================================================================ */

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-slate-50">

      {/* Mobile (< lg): single full-screen view at a time, drill-down navigation */}
      <div className="flex lg:hidden flex-col h-full min-h-0 bg-white">
        {mobileScreen === 'list' && (
          <div className="flex flex-col h-full min-h-0">
            <MobileListTabs active={mobileListTab} onChange={setMobileListTab} />
            <div className="flex-1 min-h-0 overflow-y-auto">
              {mobileListTab === 'inbox' ? renderInboxList() : renderDirectory()}
            </div>
          </div>
        )}
        {mobileScreen === 'thread' && renderThread(true)}
        {mobileScreen === 'profile' && renderProfile(true)}
      </div>

      {/* Desktop (lg and up): four collapsible columns side by side */}
      <div className="hidden lg:flex flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <CollapsiblePanel title="Inbox" icon={Inbox} expanded={panels.list} onToggle={() => togglePanel('list')} widthClass="w-80">
          {renderInboxList()}
        </CollapsiblePanel>

        <CollapsiblePanel title="Customers" icon={Users} expanded={panels.directory} onToggle={() => togglePanel('directory')} widthClass="flex-1 min-w-[360px]">
          {renderDirectory()}
        </CollapsiblePanel>

        <CollapsiblePanel title="Conversation" icon={MessageSquare} expanded={panels.thread} onToggle={() => togglePanel('thread')} widthClass="flex-1 min-w-[360px]">
          {renderThread(false)}
        </CollapsiblePanel>

        <CollapsiblePanel title="Profile" icon={Star} expanded={panels.context} onToggle={() => togglePanel('context')} widthClass="w-96" border="left">
          {renderProfile(false)}
        </CollapsiblePanel>
      </div>
    </div>
  );
}
