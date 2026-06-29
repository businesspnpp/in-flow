"use client";
import { useState } from "react";
import { MapPin, Send } from "lucide-react";
import { supabase, Chat } from "@/lib/supabase";
interface PinTrackerProps {
  activeChat: Chat | null;
  aiPrefill?: any;
}
export default function PinTracker({ activeChat, aiPrefill }: PinTrackerProps) {
  const [sending, setSending] = useState(false);
  const [address, setAddress] = useState("14 Bree Street, Johannesburg");
  const pinText =
    `📍 *LOCATION*\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `${address}\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `Google Maps: https://maps.google.com/?q=${encodeURIComponent(address)}`;
  async function sendPin() {
    if (!activeChat) return;
    setSending(true);
    await supabase
      .from("messages")
      .insert({ chat_id: activeChat.id, sender: "business", body: pinText });
    setSending(false);
  }
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <MapPin size={15} className="text-sky-600" strokeWidth={2.25} />{" "}
        <h3 className="text-sm font-semibold text-zinc-900">
          Pin Tracker
        </h3>{" "}
      </div>{" "}
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
        className="w-full border border-zinc-300 bg-white px-4 py-2.5.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500"
      />{" "}
      <button
        onClick={sendPin}
        disabled={!activeChat || !address || sending}
        className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5.5 transition-colors"
      >
        {" "}
        <Send size={13} strokeWidth={2.25} /> Send Location{" "}
      </button>{" "}
    </div>
  );
}
