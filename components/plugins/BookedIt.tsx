'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, Clock3, Loader2, Plus, Send, Trash2 } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';
import {
  buildPublicLink,
  createShortToken,
  ensureChatExists,
  isUuid,
  resolveBusinessId,
} from '@/lib/inflow-client';
import type { AIContextExtraction } from '@/lib/inflow-types';

interface SlotRange {
  startTime: string;
  endTime: string;
}

interface BookedItProps {
  activeChat: Chat | null;
  aiContext?: unknown;
  aiPrefill?: unknown;
}

type BookingRow = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toMinutes(value: string): number {
  const [hour, minute] = value.split(':').map((part) => Number.parseInt(part, 10));
  return hour * 60 + minute;
}

function normalizeTime(value: string): string {
  if (!value) return '';
  return value.length === 5 ? `${value}:00` : value;
}

function parseBookingContext(payload: unknown): { date?: string; time?: string } {
  if (!payload || typeof payload !== 'object') return {};

  const root = payload as Record<string, unknown>;
  const extraction = root.extraction as AIContextExtraction | undefined;
  const bookingDetails = extraction?.bookingDetails;

  const suggestedDate = bookingDetails?.requestedDate || (root.suggestedDate as string | undefined);
  const suggestedTime = bookingDetails?.requestedTimeSlot || (root.suggestedSlot as string | undefined);

  return {
    date: suggestedDate ?? undefined,
    time: suggestedTime ?? undefined,
  };
}

export default function BookedIt({ activeChat, aiContext, aiPrefill }: BookedItProps) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [existing, setExisting] = useState<BookingRow[]>([]);
  const [draftRanges, setDraftRanges] = useState<SlotRange[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const id = await resolveBusinessId();
      if (!id) {
        setError('Unable to resolve business profile.');
        setLoading(false);
        return;
      }

      setBusinessId(id);
      setSelectedDate(toIsoDate(new Date()));
      setLoading(false);
    }

    init();
  }, []);

  useEffect(() => {
    async function loadDayBookings() {
      if (!businessId || !selectedDate) return;

      const { data, error: queryError } = await supabase
        .from('inflow_bookings')
        .select('id, booking_date, start_time, end_time, status')
        .eq('business_id', businessId)
        .eq('booking_date', selectedDate)
        .eq('status', 'confirmed')
        .order('start_time', { ascending: true });

      if (queryError) {
        setError(queryError.message);
        return;
      }

      setExisting((data ?? []) as BookingRow[]);
      setDraftRanges([]);
    }

    loadDayBookings();
  }, [businessId, selectedDate]);

  useEffect(() => {
    const contextPayload = aiContext ?? aiPrefill;
    const parsed = parseBookingContext(contextPayload);

    if (parsed.date) {
      setSelectedDate(parsed.date);
    }

    if (parsed.time && /^\d{1,2}:\d{2}/.test(parsed.time)) {
      const normalized = parsed.time.slice(0, 5);
      setStartTime(normalized);
      const nextHour = String(Math.min(23, Number.parseInt(normalized.slice(0, 2), 10) + 1)).padStart(2, '0');
      setEndTime(`${nextHour}:${normalized.slice(3, 5)}`);
    }
  }, [aiContext, aiPrefill]);

  const dayTiles = Array.from({ length: 14 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: toIsoDate(date),
      label: date.toLocaleDateString('en-ZA', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-ZA', { month: 'short' }),
    };
  });

  function hasOverlap(candidate: SlotRange): boolean {
    const candidateStart = toMinutes(candidate.startTime);
    const candidateEnd = toMinutes(candidate.endTime);

    const combined = [
      ...existing.map((item) => ({ start: item.start_time.slice(0, 5), end: item.end_time.slice(0, 5) })),
      ...draftRanges.map((item) => ({ start: item.startTime, end: item.endTime })),
    ];

    return combined.some((range) => {
      const start = toMinutes(range.start);
      const end = toMinutes(range.end);
      return candidateStart < end && candidateEnd > start;
    });
  }

  function addRange() {
    setError(null);
    if (!startTime || !endTime) {
      setError('Start and end time are required.');
      return;
    }

    if (toMinutes(startTime) >= toMinutes(endTime)) {
      setError('End time must be after start time.');
      return;
    }

    const candidate = { startTime, endTime };
    if (hasOverlap(candidate)) {
      setError('This range overlaps with an existing booking.');
      return;
    }

    setDraftRanges((prev) => [...prev, candidate]);
  }

  function removeDraft(index: number) {
    setDraftRanges((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function sendBooking() {
    if (!businessId || !activeChat || !selectedDate || draftRanges.length === 0) return;
    setSending(true);
    setError(null);

    const rows = draftRanges.map((range) => ({
      business_id: businessId,
      chat_id: isUuid(activeChat.id) ? activeChat.id : null,
      customer_name: activeChat.name,
      booking_date: selectedDate,
      start_time: normalizeTime(range.startTime),
      end_time: normalizeTime(range.endTime),
      status: 'confirmed',
      source: 'manual_override',
      public_booking_token: createShortToken(16),
    }));

    const { data: created, error: insertError } = await supabase
      .from('inflow_bookings')
      .insert(rows)
      .select('public_booking_token, start_time, end_time');

    if (insertError) {
      setError(insertError.message);
      setSending(false);
      return;
    }

    const firstToken = created?.[0]?.public_booking_token;
    const bookingLink = firstToken ? buildPublicLink(`/book/${firstToken}`) : null;

    const rangeText = draftRanges.map((range) => `• ${range.startTime} - ${range.endTime}`).join('\n');
    const messageBody =
      `📅 *Booking Confirmed*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Date: ${selectedDate}\n` +
      `${rangeText}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      (bookingLink ? `Manage booking: ${bookingLink}` : 'Your booking has been reserved.');

    await ensureChatExists(activeChat.id, {
      name: activeChat.name,
      lastMessage: messageBody,
    });

    const { error: messageError } = await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body: messageBody,
    });

    if (messageError) {
      setError(messageError.message);
      setSending(false);
      return;
    }

    await supabase
      .from('chats')
      .update({
        last_message: `Booking confirmed: ${selectedDate}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activeChat.id);

    setDraftRanges([]);
    if (selectedDate) {
      const { data } = await supabase
        .from('inflow_bookings')
        .select('id, booking_date, start_time, end_time, status')
        .eq('business_id', businessId)
        .eq('booking_date', selectedDate)
        .eq('status', 'confirmed')
        .order('start_time', { ascending: true });
      setExisting((data ?? []) as BookingRow[]);
    }

    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Loader2 size={14} className="animate-spin" />
        Loading schedule...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CalendarCheck size={16} className="text-amber-600" />
        <h3 className="text-sm font-bold text-zinc-900">BookedIt</h3>
        {Boolean(aiContext || aiPrefill) && (
          <span className="ml-auto text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
            AI matched
          </span>
        )}
      </div>

      <p className="text-xs text-zinc-600">Pick a day to open its detailed range scheduler.</p>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {dayTiles.map((tile) => (
          <button
            key={tile.iso}
            onClick={() => setSelectedDate(tile.iso)}
            className={`rounded-lg border px-2 py-2 text-center transition-colors ${
              selectedDate === tile.iso
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-300'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wide">{tile.label}</div>
            <div className="text-sm font-semibold">{tile.day}</div>
            <div className="text-[10px]">{tile.month}</div>
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 flex flex-col gap-3">
          <p className="text-xs font-semibold text-zinc-700">Schedule for {selectedDate}</p>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={addRange}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 text-white px-3 py-2 text-sm font-semibold hover:bg-zinc-700"
            >
              <Plus size={14} />
              Add Range
            </button>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold mb-2">Existing bookings</p>
            {existing.length === 0 && <p className="text-xs text-zinc-500">No confirmed bookings on this day.</p>}
            {existing.length > 0 && (
              <div className="space-y-1">
                {existing.map((row) => (
                  <div key={row.id} className="text-xs text-zinc-700 flex items-center gap-2">
                    <Clock3 size={12} className="text-zinc-400" />
                    {row.start_time.slice(0, 5)} - {row.end_time.slice(0, 5)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold mb-2">Draft ranges to insert</p>
            {draftRanges.length === 0 && <p className="text-xs text-amber-700">Add one or more ranges before sending.</p>}
            {draftRanges.map((range, index) => (
              <div key={`${range.startTime}-${range.endTime}-${index}`} className="flex items-center justify-between text-xs text-zinc-800 py-1">
                <span>{range.startTime} - {range.endTime}</span>
                <button
                  onClick={() => removeDraft(index)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <button
        onClick={sendBooking}
        disabled={!selectedDate || !activeChat || sending || draftRanges.length === 0}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        <Send size={14} />
        Send Booking
      </button>
    </div>
  );
}
