'use client';

import { useState } from 'react';
import { CreditCard, Send } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface PayNowProps {
  activeChat: Chat | null;
  aiPrefill?: any;
}

export default function PayNow({ activeChat, aiPrefill }: PayNowProps) {
  const [sending, setSending] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Payment');

  async function sendPaymentLink() {
    if (!activeChat || !amount) return;
    setSending(true);

    const payText =
      `💰 *PAYMENT REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Amount: R${parseFloat(amount).toFixed(2)}\n` +
      `For: ${description}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Click to pay securely: [PayNow link]\n` +
      `(Payment processing coming soon)`;

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: payText,
    });

    setSending(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={16} className="text-blue-600" />
        <h3 className="text-sm font-bold text-zinc-200">Pay Now</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-zinc-400 block mb-1">Amount *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-[#121214] border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0 focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400 block mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for services"
            className="w-full px-3 py-2 bg-[#121214] border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0 focus:border-amber-500/50"
          />
        </div>
      </div>

      <button
        onClick={sendPaymentLink}
        disabled={!activeChat || !amount || sending}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Send Payment Request
      </button>
    </div>
  );
}
