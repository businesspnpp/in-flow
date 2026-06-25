'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface ReviewLinkProps {
  activeChat: Chat | null;
}

const MESSAGE_TEMPLATES = [
  {
    id: 'standard',
    label: 'Standard',
    text: (link: string) =>
      `⭐ *Quick Favour?*\n━━━━━━━━━━━━━━━━━\nThank you for choosing us today! If you're happy with your experience, would you mind dropping us a quick rating?\n\nIt takes 5 seconds:\n${link}\n━━━━━━━━━━━━━━━━━\nWe really appreciate your support! 🙏`,
  },
  {
    id: 'warm',
    label: 'Warm',
    text: (link: string) =>
      `😊 Hi! We hope you loved your experience with us today.\n\nWould you mind sharing a quick Google review? It means the world to small businesses like ours:\n${link}\n\nThank you so much! 💛`,
  },
  {
    id: 'brief',
    label: 'Brief',
    text: (link: string) =>
      `⭐ Happy with your service today? Leave us a quick Google review:\n${link}\nThank you! 🙏`,
  },
];

export default function ReviewLink({ activeChat }: ReviewLinkProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [customName, setCustomName] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Mock business review link — in production this comes from business.google_review_url
  const MOCK_BIZ_ID = 'biz_441';
  const reviewLink = `inflow.to/review/${MOCK_BIZ_ID}`;

  const template = MESSAGE_TEMPLATES.find((t) => t.id === selectedTemplate)!;
  const messageText = customName
    ? template.text(reviewLink).replace('Hi!', `Hi ${customName}!`).replace('Thank you for', `Thank you for`)
    : template.text(reviewLink);

  async function handleSend() {
    if (!activeChat) return;
    setSending(true);

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: messageText,
    });

    await supabase
      .from('chats')
      .update({ last_message: 'Review request sent', updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setSent(true);
    setSending(false);
    setTimeout(() => {
      setSent(false);
      setCustomName('');
    }, 3000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Star size={16} className="text-yellow-500" />
        <h3 className="text-sm font-bold text-zinc-900">Review Link</h3>
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">Select a chat to send a review request</p>
      )}

      {activeChat && (
        <>
          {/* Customer name (optional personalisation) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Customer Name (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Thabo"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100 transition-colors"
            />
          </div>

          {/* Template selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Message Style
            </label>
            <div className="flex gap-2">
              {MESSAGE_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedTemplate === t.id
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-yellow-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review link display */}
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5">
            <ExternalLink size={12} className="text-yellow-600 flex-shrink-0" />
            <span className="text-xs text-yellow-700 font-mono">{reviewLink}</span>
            <span className="ml-auto text-[10px] text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
              Tracks clicks
            </span>
          </div>

          {/* Preview */}
          <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 text-xs text-zinc-600 whitespace-pre-line leading-relaxed">
            {messageText}
          </div>

          {/* Star rating preview */}
          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-xs text-zinc-500">Redirects to Google Maps review</span>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {sent ? (
              <><CheckCircle size={14} /> Sent!</>
            ) : (
              <><Send size={14} /> Send Review Request</>
            )}
          </button>
        </>
      )}
    </div>
  );
}
