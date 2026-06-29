"use client";
import { useState } from "react";
import { Star, Send } from "lucide-react";
import { supabase, Chat } from "@/lib/supabase";
interface ReviewLinkProps {
  activeChat: Chat | null;
  aiPrefill?: any;
}
export default function ReviewLink({ activeChat, aiPrefill }: ReviewLinkProps) {
  const [sending, setSending] = useState(false);
  const reviewText =
    `⭐ *LEAVE A REVIEW*\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `We'd love to hear about your experience!\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `Google Review: [Review link]\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `Your feedback helps us improve! 🙏`;
  async function sendReviewLink() {
    if (!activeChat) return;
    setSending(true);
    await supabase
      .from("messages")
      .insert({ chat_id: activeChat.id, sender: "business", body: reviewText });
    setSending(false);
  }
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <Star size={15} className="text-yellow-500" strokeWidth={2.25} />{" "}
        <h3 className="text-sm font-semibold text-zinc-900">
          Review Link
        </h3>{" "}
      </div>{" "}
      <p className="text-sm text-zinc-500">
        Send a Google review request to your customer.
      </p>{" "}
      <button
        onClick={sendReviewLink}
        disabled={!activeChat || sending}
        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5.5 transition-colors"
      >
        {" "}
        <Send size={13} strokeWidth={2.25} /> Send Review Request{" "}
      </button>{" "}
    </div>
  );
}
