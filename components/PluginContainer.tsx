"use client";
import { useState } from "react";
import {
  FileText,
  CalendarCheck,
  Calculator,
  ShoppingBag,
  MapPin,
  CreditCard,
  Star,
  Megaphone,
  Settings,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { Chat, Business } from "@/lib/supabase";
import FastInvoice from "@/components/plugins/FastInvoice";
import BookedIt from "@/components/plugins/BookedIt";
import QuoteCraft from "@/components/plugins/QuoteCraft";
import MenuDrop from "@/components/plugins/MenuDrop";
import PinTracker from "@/components/plugins/PinTracker";
import PayNow from "@/components/plugins/PayNow";
import ReviewLink from "@/components/plugins/ReviewLink";
import PromoBlast from "@/components/plugins/PromoBlast";
import LinkAppsTool from "@/components/LinkAppsTool";
interface PluginContainerProps {
  activeChat: Chat | null;
  business?: Business | null;
  onBusinessUpdate?: (b: Business) => void;
}
const TABS = [
  {
    id: "invoice",
    Icon: FileText,
    label: "Invoice",
    color: "text-violet-500",
    bg: "bg-violet-500",
  },
  {
    id: "booked",
    Icon: CalendarCheck,
    label: "Booked",
    color: "text-emerald-500",
    bg: "bg-emerald-500",
  },
  {
    id: "quote",
    Icon: Calculator,
    label: "Quote",
    color: "text-amber-500",
    bg: "bg-amber-500",
  },
  {
    id: "menu",
    Icon: ShoppingBag,
    label: "Menu",
    color: "text-rose-500",
    bg: "bg-rose-500",
  },
  {
    id: "pin",
    Icon: MapPin,
    label: "Pin",
    color: "text-sky-500",
    bg: "bg-sky-500",
  },
  {
    id: "paynow",
    Icon: CreditCard,
    label: "PayNow",
    color: "text-blue-500",
    bg: "bg-blue-500",
  },
  {
    id: "review",
    Icon: Star,
    label: "Review",
    color: "text-yellow-500",
    bg: "bg-yellow-500",
  },
  {
    id: "promo",
    Icon: Megaphone,
    label: "Promo",
    color: "text-pink-500",
    bg: "bg-pink-500",
  },
  {
    id: "settings",
    Icon: Settings,
    label: "Settings",
    color: "text-slate-400",
    bg: "bg-slate-500",
  },
] as const;
type TabId = (typeof TABS)[number]["id"];
type ViewMode = "list" | "tabs";
export default function PluginContainer({
  activeChat,
  business,
  onBusinessUpdate,
}: PluginContainerProps) {
  const [activeTab, setActiveTab] = useState<TabId | null>(null); // null = list overview const [viewMode, setViewMode] = useState<ViewMode>('list'); function renderPlugin(id: TabId) { switch (id) { case 'invoice': return <FastInvoice activeChat={activeChat} strokeWidth={2.25} />; case 'booked': return <BookedIt activeChat={activeChat} strokeWidth={2.25} />; case 'quote': return <QuoteCraft activeChat={activeChat} strokeWidth={2.25} />; case 'menu': return <MenuDrop activeChat={activeChat} strokeWidth={2.25} />; case 'pin': return <PinTracker activeChat={activeChat} strokeWidth={2.25} />; case 'paynow': return <PayNow activeChat={activeChat} strokeWidth={2.25} />; case 'review': return <ReviewLink activeChat={activeChat} strokeWidth={2.25} />; case 'promo': return <PromoBlast activeChat={activeChat} strokeWidth={2.25} />; case 'settings': return business ? ( <LinkAppsTool business={business} onUpdated={(b) => onBusinessUpdate?.(b)} /> ) : ( <div className="text-sm text-zinc-500">No business profile found.</div> ); default: return null; } } /* ─── TAB MODE ─── */ if (viewMode === 'tabs') { return ( <div className="flex flex-col h-full max-w-full"> {/* Tab bar header */} <div className="flex-shrink-0 w-full relative"> <div className="flex items-center border-b border-zinc-200 bg-white"> {/* Scrollable tabs */} <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none touch-scroll flex flex-row items-center gap-1 px-2 py-2.5"> {TABS.map(({ id, Icon, label, color }) => ( <button key={id} onClick={() => setActiveTab(id)} title={label} className={`flex-shrink-0 inline-flex flex-col items-center justify-center gap-1 px-4 py-2.5.5 min-h-[44px] transition-colors ${ activeTab === id ? `${color} bg-amber-50 border border-amber-100` : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50' }`} > <Icon size={17} strokeWidth={2.25} /> <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span> </button> ))} </div> {/* Toggle button */} <button onClick={() => { setViewMode('list'); setActiveTab(null); }} className="flex-shrink-0 p-2.5 mr-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors" title="Switch to list view" > <LayoutList size={18} strokeWidth={2.25} /> </button> </div> {/* Fade hint */} <div className="pointer-events-none absolute top-0 right-10 h-full w-8 md:hidden" style={{ background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))' }} /> </div> {/* Plugin content */} <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-full"> {activeTab === null ? ( <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16"> <LayoutGrid size={28} className="text-zinc-300" strokeWidth={2.25} /> <p className="text-sm text-zinc-500">Select a tab above to open a tool</p> </div> ) : ( renderPlugin(activeTab) )} </div> </div> ); } /* ─── LIST MODE ─── */ return ( <div className="flex flex-col h-full max-w-full"> {/* List header with toggle */} <div className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 bg-white"> <div> <p className="text-xs font-semibold text-zinc-900">Tools</p> <p className="text-[10px] text-zinc-500 mt-0.5">Tap to open</p> </div> <button onClick={() => setViewMode('tabs')} className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors" title="Switch to tab view" > <LayoutGrid size={18} strokeWidth={2.25} /> </button> </div> {/* Scrollable list */} <div className="flex-1 overflow-y-auto pb-24"> <div className="divide-y divide-zinc-100"> {TABS.map(({ id, Icon, label, bg }) => { const isOpen = activeTab === id; return ( <div key={id}> {/* Row button */} <button onClick={() => setActiveTab(isOpen ? null : id)} className={`w-full flex items-center gap-3 px-4 py-3.5.5 text-left transition-colors ${ isOpen ? 'bg-zinc-50' : 'bg-white hover:bg-zinc-50' }`} > {/* Icon badge */} <div className={`flex-shrink-0 h-9 w-9 ${bg} flex items-center justify-center`}> <Icon size={18} className="text-white" strokeWidth={2.25} /> </div> {/* Label */} <div className="flex-1 min-w-0"> <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-amber-600' : 'text-zinc-900'}`}> {label} </p> <p className="text-[10px] text-zinc-500 mt-0.5">{getDesc(id)}</p> </div> {/* Chevron */} <svg className={`flex-shrink-0 transition-transform duration-200 text-zinc-500 ${isOpen ? 'rotate-90' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" > <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg> </button> {/* Expanded plugin content */} {isOpen && ( <div className="px-4 py-4 bg-white border-t border-zinc-100"> {renderPlugin(id)} </div> )} </div> ); })} </div> {!activeChat && ( <div className="mt-3 flex items-start gap-2.5 px-4"> <span className="text-amber-500 text-xs mt-0.5">↑</span> <p className="text-xs text-zinc-500"> Open a conversation in Inbox first — actions will send directly into that chat. </p> </div> )} </div> </div> );
}
function getDesc(id: TabId): string {
  const map: Record<TabId, string> = {
    invoice: "Generate & send invoice",
    booked: "Schedule appointment",
    quote: "Send price estimate",
    menu: "Share product menu",
    pin: "Send location pin",
    paynow: "Send secure payment link",
    review: "Request Google review",
    promo: "Send promo & voucher",
    settings: "Channel & account settings",
  };
  return map[id];
}
