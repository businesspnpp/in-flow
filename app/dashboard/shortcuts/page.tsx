'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/supabase';
import LinkAppsTool from '@/components/LinkAppsTool';
import FastInvoice from '@/components/plugins/FastInvoice';
import BookedIt from '@/components/plugins/BookedIt';
import QuoteCraft from '@/components/plugins/QuoteCraft';
import MenuDrop from '@/components/plugins/MenuDrop';
import PinTracker from '@/components/plugins/PinTracker';
import PayNow from '@/components/plugins/PayNow';
import ReviewLink from '@/components/plugins/ReviewLink';
import PromoBlast from '@/components/plugins/PromoBlast';
import {
  Calculator, CalendarCheck, CreditCard, FileText, LayoutGrid, LayoutList,
  MapPin, Megaphone, Settings, ShoppingBag, Sparkles, Star,
  type LucideIcon,
} from 'lucide-react';

type ToolId = 'invoice' | 'booked' | 'quote' | 'menu' | 'pin' | 'paynow' | 'review' | 'promo' | 'settings';
const ALL_TOOLS: { id: ToolId; label: string; Icon: LucideIcon; color: string; desc: string }[] = [
  { id: 'invoice',  label: 'Invoice',  Icon: FileText,      color: 'bg-violet-600', desc: 'Generate and send an invoice' },
  { id: 'booked',   label: 'Booked',   Icon: CalendarCheck, color: 'bg-emerald-600', desc: 'Schedule an appointment' },
  { id: 'quote',    label: 'Quote',    Icon: Calculator,    color: 'bg-amber-600',  desc: 'Send a price estimate' },
  { id: 'menu',     label: 'Menu',     Icon: ShoppingBag,   color: 'bg-rose-600',   desc: 'Share your product menu' },
  { id: 'pin',      label: 'Pin',      Icon: MapPin,        color: 'bg-sky-600',    desc: 'Send a location pin' },
  { id: 'paynow',   label: 'PayNow',   Icon: CreditCard,    color: 'bg-blue-600',   desc: 'Send a secure payment link' },
  { id: 'review',   label: 'Review',   Icon: Star,          color: 'bg-yellow-600', desc: 'Request a Google review' },
  { id: 'promo',    label: 'Promo',    Icon: Megaphone,     color: 'bg-pink-600',   desc: 'Send a promo or voucher' },
  { id: 'settings', label: 'Settings', Icon: Settings,      color: 'bg-zinc-600',   desc: 'Channel and account settings' },
];

function getToolCtx(label: string | null) {
  switch (label) {
    case 'Invoice':  return { title: 'Fast-Invoice', description: 'Pull items and amounts from your catalog into an invoice. Confirming a draft drops a payment link straight into the chat.' };
    case 'Booked':   return { title: 'BookedIt', description: 'Check availability, review existing appointments, and send a calendar invite into the chat without double-booking.' };
    case 'Quote':    return { title: 'QuoteCraft', description: 'Put together a custom estimate with line items before turning it into a formal invoice.' };
    case 'Menu':     return { title: 'MenuDrop', description: 'Manage your catalog, prices, and variants. Send a compact menu card straight into the chat.' };
    case 'PayNow':   return { title: 'PayNow', description: 'Generate a one-off amount or a reusable payment link for deposits and full settlements.' };
    default:         return { title: 'Tool panel', description: 'Pick a tool above to send invoices, bookings, quotes, and more directly into the conversation.' };
  }
}

export default function ShortcutsPage() {
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tabs'>('list');
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    supabase.from('businesses').select('*').single()
      .then(({ data }) => { if (data) setBusiness(data as Business); });
  }, []);

  const activeLabel = useMemo(() => ALL_TOOLS.find(t => t.id === activeToolId)?.label ?? null, [activeToolId]);
  const toolCtx = useMemo(() => getToolCtx(activeLabel), [activeLabel]);
  const mockChat: any = null;

  function renderPlugin(id: ToolId) {
    switch (id) {
      case 'invoice':  return <FastInvoice activeChat={mockChat} />;
      case 'booked':   return <BookedIt activeChat={mockChat} />;
      case 'quote':    return <QuoteCraft activeChat={mockChat} />;
      case 'menu':     return <MenuDrop activeChat={mockChat} />;
      case 'pin':      return <PinTracker activeChat={mockChat} />;
      case 'paynow':   return <PayNow activeChat={mockChat} />;
      case 'review':   return <ReviewLink activeChat={mockChat} />;
      case 'promo':    return <PromoBlast activeChat={mockChat} />;
      case 'settings': return business ? <LinkAppsTool business={business} onUpdated={b => setBusiness(b)} /> : <p className="text-sm text-zinc-500">No business profile found.</p>;
      default: return null;
    }
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* TAB MODE */}
        {viewMode === 'tabs' && (
          <>
            <div className="relative border border-zinc-200 bg-zinc-50 overflow-hidden mb-4">
              <div className="flex items-center">
                <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex flex-row items-center gap-1 px-2 py-2">
                  {ALL_TOOLS.map(({ id, Icon, label }) => (
                    <button key={id} onClick={() => setActiveToolId(id)}
                      className={`flex-shrink-0 inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 min-h-[44px] transition-colors border ${activeToolId === id ? 'text-amber-700 bg-amber-600/10 border-amber-600/20' : 'text-zinc-500 border-transparent hover:text-zinc-700 hover:bg-zinc-100'}`}>
                      <Icon size={16} />
                      <span className="text-[9px] font-semibold uppercase tracking-wide">{label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setViewMode('list'); setActiveToolId(null); }} className="flex-shrink-0 p-2.5 mr-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors" title="Switch to list view">
                  <LayoutList size={16} />
                </button>
              </div>
              <div className="pointer-events-none absolute top-0 right-10 h-full w-8" style={{ background: 'linear-gradient(to left, #fafafa, transparent)' }} />
            </div>
            <div className="pb-24">
              {activeToolId === null ? (
                <div className="flex flex-col items-center justify-center gap-3 text-center py-20 border border-zinc-200 bg-zinc-50">
                  <LayoutGrid size={28} className="text-zinc-700" />
                  <p className="text-sm text-zinc-400">Select a tab above to open a tool</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <div className="border border-zinc-200 bg-white p-4 md:col-span-2 lg:col-span-2">{renderPlugin(activeToolId)}</div>
                  <div className="border border-zinc-200 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Tool context</p>
                    <p className="mt-2 text-sm text-zinc-700">Active module: <span className="font-semibold text-zinc-900">{activeLabel}</span></p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">{toolCtx.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">{toolCtx.description}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* LIST MODE */}
        {viewMode === 'list' && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border border-zinc-200 bg-zinc-50 mb-4">
              <div>
                <p className="text-xs font-semibold text-zinc-700">Tools</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Tap to open</p>
              </div>
              <button onClick={() => setViewMode('tabs')} className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors" title="Switch to tab view">
                <LayoutGrid size={16} />
              </button>
            </div>
            <div className="pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {ALL_TOOLS.map(({ id, Icon, label, color, desc }) => {
                  const isOpen = activeToolId === id;
                  return (
                    <div key={id} className={`border ${isOpen ? 'border-amber-600/30' : 'border-zinc-200'} bg-white overflow-hidden`}>
                      <button onClick={() => setActiveToolId(isOpen ? null : id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${isOpen ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}>
                        <div className={`relative flex-shrink-0 h-9 w-9 ${color} flex items-center justify-center`}>
                          <Icon size={16} className="text-white" strokeWidth={2.25} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-amber-700' : 'text-zinc-800'}`}>{label}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{desc}</p>
                        </div>
                        <svg className={`flex-shrink-0 transition-transform duration-200 text-zinc-400 ${isOpen ? 'rotate-90' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-4 py-4 bg-zinc-50 border-t border-zinc-200">{renderPlugin(id)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-start gap-2.5 px-4">
                <span className="text-amber-500 text-xs mt-0.5">
                  <Sparkles size={12} />
                </span>
                <p className="text-xs text-zinc-400">Open a conversation in Chats first — actions will send directly into that chat.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
