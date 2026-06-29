'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface AiPrefill {
  voucherCode?: string;
  discountText?: string;
  expiry?: string;
  customMessage?: string;
}

interface PromoBlastProps {
  activeChat: Chat | null;
  aiPrefill?: AiPrefill;
}

const PRESET_PROMOS = [
  { label: '10% Off',      code: 'INFLOW10', discount: '10% off',                  emoji: '🎉' },
  { label: '15% Off',      code: 'SAVE15',   discount: '15% off',                  emoji: '💥' },
  { label: 'Free Delivery',code: 'FREEDEL',  discount: 'free delivery',             emoji: '🚚' },
  { label: 'BOGO',         code: 'BOGO50',   discount: 'buy one get one 50% off',  emoji: '🛍️' },
];

const EXPIRY_OPTIONS = ['Today only', '3 days', '7 days', '14 days', '30 days'];

function generateCode() {
  return 'FLOW' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function PromoBlast({ activeChat, aiPrefill }: PromoBlastProps) {
  const [voucherCode,   setVoucherCode]   = useState('INFLOW10');
  const [discountText,  setDiscountText]  = useState('10% off');
  const [promoEmoji,    setPromoEmoji]    = useState('🎉');
  const [bookingLink,   setBookingLink]   = useState('inflow.to/book/biz_441');
  const [expiry,        setExpiry]        = useState('7 days');
  const [customMessage, setCustomMessage] = useState('');
  const [sending,       setSending]       = useState(false);
  const [sent,          setSent]          = useState(false);

  // Apply AI prefill when it arrives
  useEffect(() => {
    if (!aiPrefill) return;
    if (aiPrefill.voucherCode)   setVoucherCode(aiPrefill.voucherCode);
    if (aiPrefill.discountText)  setDiscountText(aiPrefill.discountText);
    if (aiPrefill.expiry)        setExpiry(aiPrefill.expiry);
    if (aiPrefill.customMessage) setCustomMessage(aiPrefill.customMessage);
  }, [aiPrefill]);

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
        <Megaphone size={16} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-zinc-800">PromoBlast</h3>
        {aiPrefill && (
          <span className="ml-auto text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 font-medium border border-zinc-300">
            AI filled
          </span>
        )}
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">Select a chat to send a promo</p>
      )}

      {activeChat && (
        <>
          {/* Preset pickers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Quick presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PROMOS.map((p) => (
                <button
                  key={p.code}
                  onClick={() => applyPreset(p)}
                  className={`py-2 px-3 text-xs font-medium border text-left transition-colors ${
                    voucherCode === p.code
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'
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
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Voucher code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors font-mono tracking-wider"
              />
              <button
                onClick={() => setVoucherCode(generateCode())}
                className="p-2.5 border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
                title="Generate random code"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Discount text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Offer description
            </label>
            <input
              type="text"
              placeholder="e.g. 10% off your next booking"
              value={discountText}
              onChange={(e) => setDiscountText(e.target.value)}
              className="bg-white border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Booking link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Action link
            </label>
            <input
              type="text"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              className="bg-white border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors font-mono text-xs"
            />
          </div>

          {/* Expiry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Valid for
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setExpiry(opt)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    expiry === opt
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message override */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">
              Custom message (optional — overrides default)
            </label>
            <textarea
              rows={2}
              placeholder="Leave blank to use auto-generated message…"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="bg-white border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors resize-none"
            />
          </div>

          {/* Preview */}
          <div className="bg-zinc-50 p-3 border border-zinc-200 text-xs text-zinc-700 whitespace-pre-line leading-relaxed font-mono">
            {fullText}
          </div>

          {/* Failsafe note */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2">
            <span className="text-amber-600 text-xs mt-0.5 flex-shrink-0">✓</span>
            <p className="text-xs text-amber-800">
              This text sends immediately — the voucher code stays visible even if an image fails to load on a slow connection.
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 transition-colors"
          >
            {sent ? (
              <><CheckCircle size={14} /> Sent</>
            ) : (
              <><Send size={14} /> Send promo</>
            )}
          </button>
        </>
      )}
    </div>
  );
}
