'use client';

import { useState, useEffect } from 'react';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface AiPrefill {
  service?: string;
  amount?: string;
}

interface FastInvoiceProps {
  activeChat: Chat | null;
  aiPrefill?: AiPrefill;
}

export default function FastInvoice({ activeChat, aiPrefill }: FastInvoiceProps) {
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Apply AI prefill when it arrives
  useEffect(() => {
    if (aiPrefill?.service) setService(aiPrefill.service);
    if (aiPrefill?.amount) setAmount(aiPrefill.amount);
  }, [aiPrefill]);

  async function handleSend() {
    if (!service.trim() || !amount.trim() || !activeChat) return;
    setSending(true);

    const invoiceText =
      `📄 *INVOICE — inFlow*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Service: ${service}\n` +
      `Amount: R${amount}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Please use EFT / PayFast to settle.\n` +
      `Thank you for your business! 🙏`;

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: invoiceText,
    });

    await supabase
      .from('chats')
      .update({ last_message: `Invoice: R${amount}`, updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setSent(true);
    setSending(false);
    setTimeout(() => {
      setSent(false);
      setService('');
      setAmount('');
    }, 2500);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-amber-600" />
        <h3 className="text-sm font-bold text-zinc-900">Fast Invoice</h3>
        {aiPrefill && (
          <span className="ml-auto text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-semibold">
            AI filled
          </span>
        )}
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">
          Select a chat to send an invoice
        </p>
      )}

      {activeChat && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Service Description
            </label>
            <input
              type="text"
              placeholder="e.g. Car Service — Full"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Amount (ZAR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium">
                R
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {service && amount && (
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 text-xs text-zinc-600 whitespace-pre-line leading-relaxed font-mono">
              {`📄 INVOICE — inFlow\n━━━━━━━━━━━━━━━━━\nService: ${service}\nAmount: R${amount}\n━━━━━━━━━━━━━━━━━\nPlease use EFT / PayFast to settle.`}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!service.trim() || !amount.trim() || sending || sent}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {sent ? (
              <><CheckCircle size={14} /> Sent!</>
            ) : (
              <><Send size={14} /> Generate & Send</>
            )}
          </button>
        </>
      )}
    </div>
  );
}
