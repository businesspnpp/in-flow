'use client';

import { useState, useEffect } from 'react';
import { Calculator, Send } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface AiPrefill {
  selectedIds?: string[];
  includeVat?: boolean;
}

interface QuoteCraftProps {
  activeChat: Chat | null;
  aiPrefill?: AiPrefill;
}

const ITEMS = [
  { id: 'diag',   label: 'Basic Diagnostics',   price: 250 },
  { id: 'parts',  label: 'Parts Replacement',    price: 600 },
  { id: 'labor',  label: 'Labour',               price: 400 },
  { id: 'fluid',  label: 'Fluid Top-Up',         price: 150 },
  { id: 'filter', label: 'Filter Replacement',   price: 200 },
  { id: 'vat',    label: 'VAT (15%)',             price: 0, isVat: true },
];

export default function QuoteCraft({ activeChat, aiPrefill }: QuoteCraftProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  // Apply AI prefill when it arrives
  useEffect(() => {
    if (!aiPrefill) return;
    const next = new Set<string>();
    aiPrefill.selectedIds?.forEach((id) => next.add(id));
    if (aiPrefill.includeVat) next.add('vat');
    if (next.size > 0) setChecked(next);
  }, [aiPrefill]);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedItems = ITEMS.filter((i) => !i.isVat && checked.has(i.id));
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price, 0);
  const includeVat = checked.has('vat');
  const total = includeVat ? Math.round(subtotal * 1.15) : subtotal;
  const deposit = Math.round(total * 0.5);

  async function handleSend() {
    if (!activeChat || selectedItems.length === 0) return;
    setSending(true);

    const lines = selectedItems.map((i) => `• ${i.label}: R${i.price}`).join('\n');
    const quoteText =
      `💼 *Quote from inFlow*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      (includeVat ? `• VAT (15%): R${total - subtotal}\n` : '') +
      `━━━━━━━━━━━━━━━━━\n` +
      `Total: R${total}\n` +
      `50% Deposit: R${deposit}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Reply YES to accept this quote. ✅`;

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: quoteText,
    });

    await supabase
      .from('chats')
      .update({ last_message: `Quote: R${total}`, updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setSending(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calculator size={16} className="text-amber-600" />
        <h3 className="text-sm font-bold text-zinc-900">QuoteCraft</h3>
        {aiPrefill && (
          <span className="ml-auto text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-semibold">
            AI filled
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {ITEMS.map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
                className="accent-amber-600 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-zinc-900 font-medium">{item.label}</span>
            </div>
            <span className="text-xs text-zinc-600">
              {item.isVat ? '15%' : `R${item.price}`}
            </span>
          </label>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Subtotal</span>
          <span className="font-medium">R{subtotal}</span>
        </div>
        {includeVat && (
          <div className="flex justify-between text-xs text-zinc-600">
            <span>VAT (15%)</span>
            <span className="font-medium">R{total - subtotal}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-zinc-900 border-t border-zinc-200 pt-2 mt-2">
          <span>Total</span>
          <span className="text-amber-600">R{total}</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-600 pt-1">
          <span>50% Deposit</span>
          <span className="font-medium">R{deposit}</span>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={selectedItems.length === 0 || !activeChat || sending}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Send Quote
      </button>
    </div>
  );
}
