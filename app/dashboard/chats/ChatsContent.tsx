'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isMissingTableError } from '@/lib/inflow-client';
import {
  ArrowLeft, ArrowRight, CalendarCheck, CheckCheck, FileText,
  Hash, MessageSquare, MoreHorizontal, Paperclip, Phone,
  Search, Smile, Sparkles, Star, UtensilsCrossed, Users, Wrench, X,
} from 'lucide-react';

type Message = { id: string; sender: 'business' | 'customer'; body: string; created_at: string; };
type InflowTransaction = { id: string; created_at: string; status: string; total: number; currency: string; type: string; reference: string; };
type MockMsg = { sender: 'business' | 'customer'; time: string; text: string; };
type MockConversation = { id: string; customerName: string; channel: string; avatarColor: string; lastMessageTime: string; unreadCount: number; statusTag: string; statusColor: string; messages: MockMsg[]; context: { totalSpent: string; orderVolume: number; loyalty: string; intent: string; }; };
interface AiExtraction { tool: string | null; prefill: Record<string, unknown>; confidence: number; extraction?: { detectedIntent?: string }; }

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

export default function ChatsContent() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [msgsByContact, setMsgsByContact] = useState<Record<string, Message[]>>(INIT_MSGS);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showIntel, setShowIntel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExtraction, setAiExtraction] = useState<AiExtraction | null>(null);
  const [txns, setTxns] = useState<InflowTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [invMissing, setInvMissing] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

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

  useEffect(() => { if (!activeContact) setShowIntel(false); }, [activeContact]);
  useEffect(() => {
    if (!activeContact) return;
    setMsgsByContact(prev => prev[activeContact] ? prev : { ...prev, [activeContact]: [] });
  }, [activeContact]);
  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

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

  const filtered = MOCK_CONVERSATIONS.filter(c =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
      {/* Conversation list */}
      <div className={`flex-shrink-0 flex flex-col bg-white border-r border-zinc-200 overflow-hidden ${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80`}>
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-900">Inbox</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">{MOCK_CONVERSATIONS.length} conversations</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Hash size={16} strokeWidth={2.25} /></button>
              <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Users size={16} strokeWidth={2.25} /></button>
            </div>
          </div>
          <div className="relative">
            <Search size={16} strokeWidth={2.25} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="w-full h-11 border border-zinc-200 bg-zinc-100 pl-9 pr-3 py-2.5 text-xs text-zinc-700 placeholder:text-zinc-500 outline-none focus:border-amber-600/50 transition" />
          </div>
          <div className="flex gap-1.5 mt-3">
            {['All', 'Unread', 'Mine'].map(f => (
              <button key={f} className={`px-3 py-1.5 text-[11px] font-semibold transition ${f === 'All' ? 'bg-amber-600 text-white' : 'bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {filtered.map(contact => (
            <button key={contact.id} onClick={() => setActiveContact(contact.id)} className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-100 ${activeContact === contact.id ? 'bg-zinc-100' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className={`h-10 w-10 flex items-center justify-center text-[13px] font-semibold text-white ${CHANNEL_COLORS[contact.channel] || 'bg-zinc-600'}`}>{contact.avatarColor}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border-2 border-white ${CHANNEL_DOT[contact.channel] || 'bg-zinc-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold text-zinc-900 truncate">{contact.customerName}</span>
                  <span className="text-[10px] text-zinc-500 flex-shrink-0">{contact.lastMessageTime}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate leading-snug">{contact.messages[0]?.text || ''}</p>
                {contact.statusTag && <span className={`mt-1.5 inline-block border px-1.5 py-0.5 text-[10px] font-medium ${contact.statusColor}`}>{contact.statusTag}</span>}
              </div>
              {contact.unreadCount > 0 && <span className="flex-shrink-0 mt-1 flex h-4 min-w-4 items-center justify-center bg-amber-600 px-1 text-[10px] font-bold text-white">{contact.unreadCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className={`flex-1 flex flex-col overflow-hidden bg-zinc-50 ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
        {!activeContact ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center"><MessageSquare size={28} className="text-zinc-400" /></div>
            <div className="text-center"><p className="text-sm font-medium text-zinc-500">Select a conversation</p><p className="text-xs text-zinc-400 mt-1">Choose from the list to start replying</p></div>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-zinc-200 bg-white">
              <button onClick={() => setActiveContact(null)} className="md:hidden flex h-8 w-8 items-center justify-center bg-zinc-100 text-zinc-500 transition"><ArrowLeft size={16} /></button>
              <div className={`h-9 w-9 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${CHANNEL_COLORS[selected?.channel || 'SMS']}`}>{selected?.avatarColor}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">{selected?.customerName}</p>
                <div className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 ${CHANNEL_DOT[selected?.channel || 'SMS'] || 'bg-zinc-400'}`} /><p className="text-xs text-zinc-500">{selected?.channel}</p></div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowIntel(true)} className="xl:hidden flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 transition-colors"><Users size={13} /> Intel</button>
                <button onClick={handleAi} disabled={aiLoading} className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium transition-colors border ${aiLoading ? 'bg-amber-600/10 text-amber-700 border-amber-600/20 animate-pulse cursor-wait' : 'bg-amber-600/10 text-amber-700 hover:bg-amber-600/20 border-amber-600/20'}`}><Sparkles size={13} />{aiLoading ? 'Reading…' : 'AI Assist'}</button>
                <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Phone size={15} /></button>
                <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><Star size={15} /></button>
                <button className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition"><MoreHorizontal size={15} /></button>
              </div>
            </div>
            {aiExtraction?.tool && (
              <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-amber-600/10 border-b border-amber-600/20">
                <Sparkles size={13} className="text-amber-700 flex-shrink-0" />
                <p className="text-xs text-amber-800 flex-1">AI detected a <span className="font-semibold capitalize">{aiExtraction.tool}</span> request{aiExtraction.confidence >= 0.8 ? ' — form pre-filled, review and send.' : ' — check the pre-fill before sending.'}</p>
                <button onClick={() => router.push('/dashboard/tools')} className="flex-shrink-0 text-[10px] font-semibold text-amber-700 bg-amber-600/20 px-2 py-1 hover:bg-amber-600/30 transition">Open tool →</button>
              </div>
            )}
            <div className="flex-shrink-0 border-b border-zinc-200 bg-white overflow-x-auto scrollbar-none px-4 py-2">
              <div className="flex gap-2 whitespace-nowrap">
                {TOOL_ACTIONS.map(tool => {
                  const TI = tool.Icon;
                  return <button key={tool.label} onClick={() => handleTool(tool.text)} className="flex-shrink-0 flex items-center gap-1.5 border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-amber-600/10 hover:border-amber-600/30 hover:text-amber-700 transition-colors"><TI size={13} />{tool.label}</button>;
                })}
              </div>
            </div>
            <div key={activeContact} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 my-2"><div className="flex-1 h-px bg-zinc-200" /><span className="text-[10px] text-zinc-400 font-medium uppercase">Today</span><div className="flex-1 h-px bg-zinc-200" /></div>
              {curMsgs.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'customer' && <div className={`h-7 w-7 flex-shrink-0 self-end flex items-center justify-center text-[10px] font-bold text-white ${CHANNEL_COLORS[selected?.channel || 'SMS'] || 'bg-zinc-600'}`}>{selected?.avatarColor}</div>}
                  <div className={`max-w-[75%] flex flex-col gap-1 ${msg.sender === 'business' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.sender === 'business' ? 'bg-amber-600 text-white font-medium' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'}`}>{msg.body}</div>
                    <div className={`flex items-center gap-1 ${msg.sender === 'business' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-zinc-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === 'business' && <CheckCheck size={12} className="text-amber-600" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="flex-shrink-0 border-t border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-2 focus-within:border-amber-600/50 transition-colors">
                <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0"><Paperclip size={16} /></button>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message…" className="flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400" />
                <button className="text-zinc-400 hover:text-zinc-500 transition flex-shrink-0"><Smile size={16} /></button>
                <button onClick={handleSend} disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center bg-amber-600 text-white transition hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"><ArrowRight size={15} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right context column */}
      <aside className="w-96 border-l border-zinc-200 bg-white hidden xl:flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-zinc-200">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">Context</p>
          <h3 className="text-sm text-zinc-900 font-semibold mt-1">Customer profile</h3>
        </div>
        {selected ? (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            <section className="border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-xs text-zinc-500 font-medium">{selected.customerName}</p><p className="text-[11px] text-zinc-500 mt-0.5">{selected.channel}</p></div>
                <span className={`text-[10px] font-medium px-2 py-1 border ${orderVol === 0 ? 'border-zinc-200 text-zinc-500 bg-zinc-100' : orderVol === 1 ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'}`}>{statusLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-200 bg-white p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Total spent</p><p className="text-lg font-semibold text-zinc-900 mt-1">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(ltv)}</p></div>
                <div className="border border-zinc-200 bg-white p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</p><p className="text-lg font-semibold text-zinc-900 mt-1">{orderVol}</p></div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between mb-1.5"><p className="text-[11px] text-zinc-500">Loyalty tier</p><p className="text-[11px] text-zinc-800 font-medium">{loyalty.tier}</p></div>
                <div className="h-1.5 w-full bg-zinc-200 overflow-hidden"><div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.max(3, loyalty.progress)}%` }} /></div>
                <p className="text-[10px] text-zinc-500 mt-2">Next: {loyalty.nextTier}{ltv < 2500 ? ` — R${Math.max(0, loyalty.target - ltv).toFixed(2)} to go` : ''}</p>
              </div>
            </section>
            <section className="border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center justify-between mb-3"><h4 className="text-xs font-semibold text-zinc-800">Recent transactions</h4>{txLoading && <span className="text-[10px] text-zinc-500">Loading…</span>}</div>
              <div className="space-y-2">
                {!txLoading && txns.length === 0 && <p className="text-[11px] text-zinc-500">No invoices or quotes for this customer yet.</p>}
                {txns.map(txn => {
                  const s = String(txn.status || '').toLowerCase();
                  const sc = s === 'paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : (s === 'pending' || s === 'sent' || s === 'draft') ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-rose-200 text-rose-700 bg-rose-50';
                  return <div key={txn.id} className="grid grid-cols-[58px_1fr_auto] items-center gap-2 border border-zinc-200 bg-white px-2.5 py-2"><span className="text-[11px] text-zinc-500 font-medium">{new Date(txn.created_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</span><div className="min-w-0 flex items-center gap-2"><span className={`text-[10px] font-medium px-1.5 py-0.5 border ${sc}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span><span className="text-[10px] text-zinc-500 truncate">{txn.reference || txn.type}</span></div><span className="text-[12px] text-zinc-900 font-semibold">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: txn.currency || 'ZAR', maximumFractionDigits: 2 }).format(Number(txn.total || 0))}</span></div>;
                })}
              </div>
            </section>
            <section className="border border-zinc-200 bg-zinc-50 p-4">
              <h4 className="text-xs font-semibold text-zinc-800 mb-2.5">AI signal</h4>
              <div className="border border-zinc-200 bg-white px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">Detected intent</p>
                <p className="text-sm text-zinc-900 mt-1 font-semibold">{aiIntent === 'none' ? 'No dominant intent' : aiIntent === 'invoice' ? 'Invoice' : aiIntent === 'booking' ? 'Booking' : aiIntent === 'quote' ? 'Quote' : 'Promo'}</p>
                <p className="text-[11px] text-zinc-500 mt-1">Confidence: {aiConf}%</p>
              </div>
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">Suggested actions</p>
                <div className="space-y-2">
                  {(['booked', 'invoice'] as const).map(tool => {
                    const isMatch = (tool === 'booked' && aiIntent === 'booking') || (tool === 'invoice' && aiIntent === 'invoice');
                    return <button key={tool} onClick={() => router.push('/dashboard/tools')} className={`w-full px-3 py-2 text-left border transition-colors ${isMatch ? 'border-amber-600/60 bg-amber-600/10' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}><p className="text-[12px] text-zinc-900 font-medium">{tool === 'booked' ? 'Open BookedIt' : 'Open FastInvoice'}</p><p className="text-[10px] text-zinc-500 mt-0.5">{tool === 'booked' ? 'Suggested when booking intent is dominant.' : 'Suggested when invoice intent is dominant.'}</p></button>;
                  })}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6 text-center"><p className="text-xs text-zinc-500 leading-relaxed">Select a conversation to see customer profile, transactions, and AI signal.</p></div>
        )}
      </aside>

      {/* Mobile intel drawer */}
      {showIntel && selected && (
        <div className="xl:hidden fixed inset-0 z-[70] bg-zinc-900/40">
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] border-t border-zinc-200 bg-white flex flex-col">
            <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
              <div><p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">Context</p><h3 className="text-sm text-zinc-900 font-semibold mt-1">Customer profile</h3></div>
              <button onClick={() => setShowIntel(false)} className="h-8 w-8 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"><X size={14} className="mx-auto" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-200 bg-white p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Total spent</p><p className="text-lg font-semibold text-zinc-900 mt-1">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(ltv)}</p></div>
                <div className="border border-zinc-200 bg-white p-3"><p className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</p><p className="text-lg font-semibold text-zinc-900 mt-1">{orderVol}</p></div>
              </div>
              <p className="text-xs text-zinc-500">AI Intent: <span className="font-semibold text-zinc-800">{aiIntent}</span></p>
              <button onClick={() => { setShowIntel(false); router.push('/dashboard/tools'); }} className="w-full px-3 py-2.5 text-sm font-semibold bg-amber-600 text-white">Open Tools</button>
            </div>
          </div>
          <button className="absolute inset-0 -z-10" aria-label="Close" onClick={() => setShowIntel(false)} />
        </div>
      )}
    </div>
  );
}
