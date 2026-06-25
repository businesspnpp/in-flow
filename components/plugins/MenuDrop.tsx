'use client';

import { useState } from 'react';
import { ShoppingBag, Send } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface MenuDropProps {
  activeChat: Chat | null;
  aiPrefill?: any;
}

const MENU_ITEMS = [
  { name: 'Quarter Leg & Chips', price: 55 },
  { name: 'Full Chicken & Chips', price: 89 },
  { name: 'Beef Burger & Chips', price: 65 },
  { name: 'Veggie Wrap & Salad', price: 45 },
  { name: 'Lamb Shank & Mash', price: 120 },
  { name: 'Fish & Chips', price: 75 },
];

export default function MenuDrop({ activeChat, aiPrefill }: MenuDropProps) {
  const [sending, setSending] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const menuText =
    `📋 *MENU*\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    MENU_ITEMS.map((item) => `• ${item.name} — R${item.price}`).join('\n') +
    `\n━━━━━━━━━━━━━━━━━\n` +
    `Order now! 🍽️`;

  async function sendMenu() {
    if (!activeChat) return;
    setSending(true);

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: menuText,
    });

    setSending(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShoppingBag size={16} className="text-rose-600" />
        <h3 className="text-sm font-bold text-zinc-900">Menu Drop</h3>
      </div>

      <div className="bg-zinc-50 rounded-lg p-3 max-h-48 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <div key={item.name} className="flex justify-between py-1.5 border-b border-zinc-100 text-sm">
            <span>{item.name}</span>
            <span className="font-medium">R{item.price}</span>
          </div>
        ))}
      </div>

      <button
        onClick={sendMenu}
        disabled={!activeChat || sending}
        className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Send Menu
      </button>
    </div>
  );
}
