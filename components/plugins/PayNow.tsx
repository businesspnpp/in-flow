'use client';

import { useState } from 'react';
import { CreditCard, Send, CheckCircle, Copy } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface PayNowProps {
  activeChat: Chat | null;
}

const PAYMENT_METHODS = ['Card', 'Instant EFT', 'Capitec Pay', 'SnapScan'];

export default function PayNow({ activeChat }: PayNowProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(
    new Set(['Card', 'Instant EFT', 'Capitec Pay'])
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  function toggleMethod(method: string) {
    setSelectedMethods((prev) => {
      const next = new Set(prev);
      if (next.has(method)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(method);
      } else {
        next.add(method);
      }
      return next;
    });
  }

  function generateToken() {
    return 'inv_' + Math.random().toString(36).slice(2, 9).toUpperCase();
  }

  async function handleSend() {
    if (!activeChat || !amount.trim()) return;
    setSending(true);

    const token = generateToken();
    const link = `inflow.to/pay/${token}`;
    const methods = Array.from(selectedMethods).join(', ');

    const paymentText =
      `💳 *Secure Payment Link*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      (description ? `For: ${description}\n` : '') +
      `Amount: R${amount}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Tap to pay securely:\n` +
      `${link}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Accepts: ${methods} 🔒`;

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: paymentText,
    });

    await supabase
      .from('chats')
      .update({ last_message: `Payment link: R${amount}`, updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setGeneratedLink(link);
    setSent(true);
    setSending(false);
    setTimeout(() => {
      setSent(false);
      setAmount('');
      setDescription('');
      setGeneratedLink('');
    }, 4000);
  }

  function handleCopy() {
    navigator.clipboard.writeText(`https://${generatedLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={16} className="text-blue-500" />
        <h3 className="text-sm font-bold text-zinc-900">PayNow</h3>
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">Select a chat to send a payment link</p>
      )}

      {activeChat && (
        <>
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Amount (ZAR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium">R</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Description (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Hair treatment & styling"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
            />
          </div>

          {/* Payment methods */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Accepted Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => toggleMethod(method)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedMethods.has(method)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-blue-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {amount && (
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 text-xs text-zinc-600 whitespace-pre-line leading-relaxed font-mono">
              {`💳 Secure Payment Link\n━━━━━━━━━━━━━━━━━\n${description ? `For: ${description}\n` : ''}Amount: R${amount}\n━━━━━━━━━━━━━━━━━\ninflow.to/pay/inv_XXXXXX\nAccepts: ${Array.from(selectedMethods).join(', ')} 🔒`}
            </div>
          )}

          {/* Generated link copy */}
          {generatedLink && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
              <span className="text-xs text-blue-700 font-mono flex-1 truncate">{generatedLink}</span>
              <button onClick={handleCopy} className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0">
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!amount.trim() || sending || sent}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {sent ? (
              <><CheckCircle size={14} /> Sent!</>
            ) : (
              <><Send size={14} /> Generate & Send Link</>
            )}
          </button>
        </>
      )}
    </div>
  );
        }
