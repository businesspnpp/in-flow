'use client';

import { useState } from 'react';
import { Calculator, Send } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface QuoteCraftProps {
  activeChat: Chat | null;
}

const ITEMS = [
  { id: 'diag', label: 'Basic Diagnostics', price: 250 },
  { id: 'parts', label: 'Parts Replacement', price: 600 },
  { id: 'labor', label: 'Labour', price: 400 },
  { id: 'fluid', label: 'Fluid Top-Up', price: 150 },
  { id: 'filter', label: 'Filter Replacement', price: 200 },
  { id: 'vat', label: 'VAT (15%)', price: 0, isVat: true },
];

export default function QuoteCraft({ activeChat }: QuoteCraftProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

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
        <Calculator size={16} className="text-[#6c63ff]" />
        <h3 className="text-sm font-semibold text-[#e8e8f0]">QuoteCraft</h3>
      </div>

      <div className="flex flex-col gap-2">
        {ITEMS.map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between bg-[#1a1a24] rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[#22223a] transition-colors"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
                className="accent-[#6c63ff] w-3.5 h-3.5"
              />
              <span className="text-xs text-[#e8e8f0]">{item.label}</span>
            </div>
            <span className="text-xs text-[#9090a8]">
              {item.isVat ? '15%' : `R${item.price}`}
            </span>
          </label>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#2a2a3a] flex flex-col gap-1">
        <div className="flex justify-between text-xs text-[#9090a8]">
          <span>Subtotal</span>
          <span>R{subtotal}</span>
        </div>
        {includeVat && (
          <div className="flex justify-between text-xs text-[#9090a8]">
            <span>VAT (15%)</span>
            <span>R{total - subtotal}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold text-[#e8e8f0] border-t border-[#2a2a3a] pt-1 mt-1">
          <span>Total</span>
          <span className="text-[#6c63ff]">R{total}</span>
        </div>
        <div className="flex justify-between text-xs text-[#9090a8]">
          <span>50% Deposit</span>
          <span>R{deposit}</span>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={selectedItems.length === 0 || !activeChat || sending}
        className="flex items-center justify-center gap-2 bg-[#6c63ff] hover:bg-[#7c73ff] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Send Quote
      </button>
    </div>
  );
}
