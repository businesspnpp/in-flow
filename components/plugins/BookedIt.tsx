'use client';

import { useState } from 'react';
import { CalendarCheck, Send } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';

interface BookedItProps {
  activeChat: Chat | null;
}

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookedIt({ activeChat }: BookedItProps) {
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function toggleSlot(slot: string) {
    if (booked.has(slot)) return; // can't unbook directly
    setSelected(slot === selected ? null : slot);
  }

  function bookSlot(slot: string) {
    setBooked((prev) => new Set([...prev, slot]));
    setSelected(null);
  }

  async function sendConfirmation() {
    if (!selected || !activeChat) return;
    setSending(true);

    const today = new Date().toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const confirmText =
      `📅 *Appointment Confirmed*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Date: ${today}\n` +
      `Time: ${selected}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Please arrive 5 minutes early.\n` +
      `Reply CANCEL to reschedule. ✅`;

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: confirmText,
    });

    await supabase
      .from('chats')
      .update({
        last_message: `Booking confirmed: ${selected}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activeChat.id);

    bookSlot(selected);
    setSending(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CalendarCheck size={16} className="text-[#6c63ff]" />
        <h3 className="text-sm font-semibold text-[#e8e8f0]">BookedIt</h3>
      </div>

      <p className="text-xs text-[#9090a8]">
        Today&apos;s slots — tap an available slot to select it
      </p>

      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((slot) => {
          const isBooked = booked.has(slot);
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              onClick={() => toggleSlot(slot)}
              disabled={isBooked}
              className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                isBooked
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800 cursor-default'
                  : isSelected
                  ? 'bg-[#6c63ff] text-white border border-[#6c63ff]'
                  : 'bg-[#1a1a24] text-[#9090a8] border border-[#2a2a3a] hover:border-[#6c63ff] hover:text-[#e8e8f0]'
              }`}
            >
              {slot}
              {isBooked && (
                <span className="block text-[9px] mt-0.5 text-emerald-400">Booked</span>
              )}
              {!isBooked && !isSelected && (
                <span className="block text-[9px] mt-0.5 text-[#4a4a5a]">Free</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && activeChat && (
        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#6c63ff]/40 text-xs text-[#9090a8]">
          <span className="text-[#6c63ff] font-medium">Draft:</span> Appointment at {selected}
        </div>
      )}

      <button
        onClick={sendConfirmation}
        disabled={!selected || !activeChat || sending}
        className="flex items-center justify-center gap-2 bg-[#6c63ff] hover:bg-[#7c73ff] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Confirm & Send Booking
      </button>
    </div>
  );
}
