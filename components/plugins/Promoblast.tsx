'use client';

import { useState } from 'react';
import { Megaphone, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface PromoBlastProps {
  activeChat: Chat | null;
}

const PRESET_PROMOS = [
  { label: '10% Off', code: 'INFLOW10', discount: '10% off', emoji: '🎉' },
  { label: '15% Off', code: 'SAVE15', discount: '15% off', emoji: '💥' },
  { label: 'Free Delivery', code: 'FREEDEL', discount: 'free delivery', emoji: '🚚' },
  { label: 'BOGO', code: 'BOGO50', discount: 'buy one get one 50% off', emoji: '🛍️' },
];

const EXPIRY_OPTIONS = ['Today only', '3 days', '7 days', '14 days', '30 days'];

function generateCode() {
  return 'FLOW' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function PromoBlast({ activeChat }: PromoBlastProps) {
  const [voucherCode, setVoucherCode] = useState('INFLOW10');
  const [discountText, setDiscountText] = useState('10% off');
  const [promoEmoji, setPromoEmoji] = useState('🎉');
  const [bookingLink, setBookingLink] = useState('inflow.to/book/biz_441');
  const [expiry, setExpiry] = useState('7 days');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function applyPreset(preset: typeof PRESET_PROMOS[0]) {
    setVoucherCode(preset.code);
    setDiscountText(preset.discount);
    setPromoEmoji(preset.emoji);
  }

  const defaultMessage = `We miss you! Use code *${voucherCode}* at checkout to get *${discountText}* on your next booking or order:\n${bookingLink}`;
  const finalMessage = customMessage || defaultMessage;

  const fullText =
    `${promoEmoji} *Special Offer — Just For You!*\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `${finalMessage}\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `⏰ Valid for: ${expiry}\n` +
    `Code: *${voucherCode}*\n\n` +
    `(Offer applies even if image doesn't load) ✅`;

  async function handleSend() {
    if (!activeChat) return;
    setSending(true);

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: fullText,
    });

    await supabase
      .from('chats')
      .update({ last_message: `Promo: ${voucherCode}`, updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setSent(true);
    setSending(false);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Megaphone size={16} className="text-pink-500" />
        <h3 className="text-sm font-bold text-zinc-900">PromoBlast</h3>
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">Select a chat to send a promo</p>
      )}

      {activeChat && (
        <>
          {/* Preset pickers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PROMOS.map((p) => (
                <button
                  key={p.code}
                  onClick={() => applyPreset(p)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors ${
                    voucherCode === p.code
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-pink-300'
                  }`}
                >
                  <span className="mr-1">{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voucher code */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Voucher Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors font-mono tracking-wider"
              />
              <button
                onClick={() => setVoucherCode(generateCode())}
                className="p-2.5 rounded-lg border border-zinc-200 text-zinc-500 hover:border-pink-300 hover:text-pink-500 transition-colors"
                title="Generate random code"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Discount text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Offer Description
            </label>
            <input
              type="text"
              placeholder="e.g. 10% off your next booking"
              value={discountText}
              onChange={(e) => setDiscountText(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors"
            />
          </div>

          {/* Booking link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Action Link
            </label>
            <input
              type="text"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors font-mono text-xs"
            />
          </div>

          {/* Expiry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Valid For
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setExpiry(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    expiry === opt
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-pink-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message override */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Custom Message (optional — overrides default)
            </label>
            <textarea
              rows={2}
              placeholder="Leave blank to use auto-generated message…"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors resize-none"
            />
          </div>

          {/* Preview */}
          <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 text-xs text-zinc-600 whitespace-pre-line leading-relaxed font-mono">
            {fullText}
          </div>

          {/* Failsafe note */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">✓</span>
            <p className="text-xs text-amber-700">
              Failsafe text renders immediately — voucher code visible even if image fails to load on low-data networks.
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {sent ? (
              <><CheckCircle size={14} /> Sent!</>
            ) : (
              <><Send size={14} /> Send PromoBlast</>
            )}
          </button>
        </>
      )}
    </div>
  );
        }
