"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, Chat, Message } from "@/lib/supabase";
import { sanitizeInput } from "@/lib/sanitize";
import { ChatMessageSchema } from "@/lib/validation";
import { Send, MessageSquare, AlertCircle } from "lucide-react";

interface ChatWindowProps {
  activeChat: Chat | null;
  canSend?: boolean;
  readOnlyReason?: string;
}

function normalizeMessageBody(body: string) {
  return body.replace(/^\[(WHATSAPP|INSTAGRAM|FACEBOOK|TIKTOK|LIVE CHAT)\]\s*/i, "").trim() || body;
}

function formatContactLabel(id: string) {
  const rawId = id.includes(":") ? id.split(":").slice(1).join(":") || id : id;
  return /^\+?\d{7,}$/.test(rawId) ? `+${rawId.replace(/^\+/, "")}` : rawId;
}

export default function ChatWindow({
  activeChat,
  canSend = true,
  readOnlyReason = "Replying is unavailable for this live conversation.",
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentChat = activeChat;
    if (!currentChat) {
      setMessages([]);
      return;
    }
    const chatId = currentChat.id;

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data as Message[]);
    }

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || !activeChat || sending || !canSend) return;
    setError("");

    try {
      const sanitizedBody = sanitizeInput(input.trim(), 4096);
      if (!sanitizedBody) {
        setError("Message cannot be empty after sanitization");
        return;
      }

      const validationResult = ChatMessageSchema.safeParse({
        body: sanitizedBody,
        chat_id: activeChat.id,
      });

      if (!validationResult.success) {
        setError(`Validation error: ${validationResult.error.errors.map((e) => e.message).join(", ")}`);
        return;
      }

      const { body, chat_id } = validationResult.data;
      setInput("");
      setSending(true);

      const metaResponse = await fetch(
        `https://graph.facebook.com/v20.0/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: chat_id,
            type: "text",
            text: { body },
          }),
        },
      );

      if (!metaResponse.ok) {
        setError("Failed to send message via WhatsApp");
        setSending(false);
        return;
      }

      const { error: insertError } = await supabase.from("messages").insert({ chat_id, sender: "business", body });
      if (insertError) {
        setError("Failed to save message");
        setSending(false);
        return;
      }

      await supabase
        .from("chats")
        .update({ last_message: body, updated_at: new Date().toISOString() })
        .eq("id", chat_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!activeChat) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-center p-6 h-full min-h-[50dvh]">
        <MessageSquare size={40} strokeWidth={1.5} className="text-zinc-300 mb-3" />
        <p className="text-sm text-zinc-500">Select a conversation to begin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 bg-white flex-shrink-0">
        <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">{(activeChat.name ?? formatContactLabel(activeChat.id)).slice(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 truncate max-w-[180px]">{activeChat.name ?? formatContactLabel(activeChat.id)}</p>
          <p className="text-[11px] text-zinc-500 truncate max-w-[180px]">{formatContactLabel(activeChat.id)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "business" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.sender === "business" ? "bg-[#795bf4] text-white" : "if-card-soft text-zinc-900"}`}
            >
              <p>{normalizeMessageBody(msg.body)}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === "business" ? "text-[#ddd5ff]" : "text-zinc-500"}`}>
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-5 border-t border-zinc-200 bg-white flex-shrink-0">
        {error && (
          <div className="mb-2 flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2.5">
            <AlertCircle size={13} className="text-red-600 flex-shrink-0" strokeWidth={2.25} />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        {!canSend && (
          <p className="mb-2 text-[11px] text-zinc-500">{readOnlyReason}</p>
        )}
        <div className="flex items-end gap-2 if-card-soft px-4 py-2.5">
          <textarea
            rows={1}
            placeholder="Type a reply..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none resize-none max-h-32"
            maxLength={4096}
            disabled={!canSend}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending || !canSend}
            className="if-btn-primary w-8 h-8 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          >
            <Send size={13} className="text-white" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
