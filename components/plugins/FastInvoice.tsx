'use client';

import { useState } from 'react';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface FastInvoiceProps {
  activeChat: Chat | null;
}

export default function FastInvoice({ activeChat }: FastInvoiceProps) {
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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
        <FileText size={16} className="text-[#6c63ff]" />
        <h3 className="text-sm font-semibold text-[#e8e8f0]">Fast Invoice</h3>
      </div>

      {!activeChat && (
        <p className="text-xs text-[#4a4a5a] text-center py-4">
          Select a chat to send an invoice
        </p>
      )}

      {activeChat && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#9090a8] uppercase tracking-wider">
              Service Description
            </label>
            <input
              type="text"
              placeholder="e.g. Car Service — Full"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#4a4a5a] outline-none focus:border-[#6c63ff] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#9090a8] uppercase tracking-wider">
              Amount (ZAR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9090a8]">
                R
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded-lg pl-7 pr-3 py-2 text-sm text-[#e8e8f0] placeholder-[#4a4a5a] outline-none focus:border-[#6c63ff] transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {service && amount && (
            <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#2a2a3a] text-xs text-[#9090a8] whitespace-pre-line leading-relaxed">
              {`📄 INVOICE — inFlow\n━━━━━━━━━━━━━━━━━\nService: ${service}\nAmount: R${amount}\n━━━━━━━━━━━━━━━━━\nPlease use EFT / PayFast to settle.`}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!service.trim() || !amount.trim() || sending || sent}
            className="flex items-center justify-center gap-2 bg-[#6c63ff] hover:bg-[#7c73ff] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {sent ? (
              <>
                <CheckCircle size={14} />
                Sent!
              </>
            ) : (
              <>
                <Send size={14} />
                Generate & Send
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
