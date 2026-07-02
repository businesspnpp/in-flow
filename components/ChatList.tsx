"use client";
import { useEffect, useState } from "react";
import { supabase, Chat } from "@/lib/supabase";
import { MessageCircle, MessageSquare, Search } from "lucide-react";

interface ChatListProps {
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  showLiveBadge?: boolean;
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path fill="#fff" d="M16 7.5c-4.7 0-8.5 3.8-8.5 8.5 0 1.5.4 2.9 1.1 4.2L7.5 24.5l4.5-1.1c1.2.7 2.6 1.1 4 1.1 4.7 0 8.5-3.8 8.5-8.5S20.7 7.5 16 7.5Zm4.9 12.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="igGradChatList" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="20%" stopColor="#fdf497" />
          <stop offset="40%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#igGradChatList)" />
      <circle cx="16" cy="16" r="5" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="22" cy="10" r="1.1" fill="#fff" />
    </svg>
  );
}

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#000" />
      <path fill="#fff" d="M19.3 8.5c.5 1.6 1.6 2.7 3.3 2.9v2.4c-1.2 0-2.3-.4-3.3-1.1v5.6c0 2.8-2.2 5-5 5-1 0-2-.3-2.8-.9a5 5 0 0 1 5.5-7.8v2.6a2.4 2.4 0 1 0 1.7 2.3v-11h.6Z" />
    </svg>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#1877F2" />
      <path fill="#fff" d="M18.6 12.2h-1.6c-.6 0-.9.4-.9.9v1.7h2.4l-.3 2.4h-2.1v6.3h-2.5v-6.3h-2v-2.4h2v-1.9c0-1.8 1.1-3 3-3h1.9v2.3Z" />
    </svg>
  );
}

function getChannelInfo(chatId: string) {
  const prefix = chatId.split(':')[0]?.toLowerCase();
  if (prefix === 'whatsapp') return { label: 'WhatsApp', Icon: WhatsAppIcon };
  if (prefix === 'instagram') return { label: 'Instagram', Icon: InstagramIcon };
  if (prefix === 'facebook') return { label: 'Facebook', Icon: FacebookIcon };
  if (prefix === 'tiktok') return { label: 'TikTok', Icon: TikTokIcon };
  return { label: 'Live', Icon: MessageSquare };
}

function normalizeMessageBody(body: string | null | undefined) {
  if (!body) return '—';
  const cleaned = body.replace(/^\[(WHATSAPP|INSTAGRAM|FACEBOOK|TIKTOK|LIVE CHAT)\]\s*/i, '').trim();
  return cleaned || body;
}

export default function ChatList({ activeChat, onSelectChat, showLiveBadge = false }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchChats() {
      const { data } = await supabase
        .from("chats")
        .select("*")
        .order("updated_at", { ascending: false });
      if (data) setChats(data as Chat[]);
    }
    fetchChats();
  }, []);

  useEffect(() => {
    // Use a unique topic per mount instead of a hardcoded name. If ChatList
    // is ever mounted twice at once (e.g. a "Live Inbox" view alongside the
    // normal chat list), reusing the same topic name causes Supabase to
    // throw "cannot add postgres_changes callbacks ... after subscribe()"
    // when the second instance tries to attach listeners.
    const topic = `chats-realtime-${Math.random().toString(36).slice(2)}`;

    // Defensive cleanup: if a channel with this exact topic somehow already
    // exists (e.g. a previous instance's cleanup didn't finish yet), remove
    // it before creating a new one.
    const existing = supabase.getChannels().find((c) => c.topic === `realtime:${topic}`);
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel(topic)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChats((prev) => [payload.new as Chat, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setChats((prev) =>
              prev
                .map((c) => (c.id === (payload.new as Chat).id ? (payload.new as Chat) : c))
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
            );
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = chats.filter(
    (c) =>
      (c.name ?? c.id).toLowerCase().includes(search.toLowerCase()) ||
      c.id.includes(search),
  );

  function initials(name: string | null, id: string) {
    return (name ?? id).slice(0, 2).toUpperCase();
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border-r border-zinc-200">
      <div className="p-5 border-b border-zinc-200">
        <div className="flex items-center gap-2 if-card-soft px-4 py-2.5 w-full">
          <Search size={18} className="text-zinc-500 flex-shrink-0" strokeWidth={2.25} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none flex-1"
            aria-label="Search conversations"
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto w-full">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500 p-6">
            <MessageCircle size={32} strokeWidth={1.5} />
            <span className="text-sm">No conversations yet</span>
          </div>
        )}
        {filtered.map((chat) => {
          const channelInfo = getChannelInfo(chat.id);
          const preview = normalizeMessageBody(chat.last_message);
          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-left ${activeChat?.id === chat.id ? "bg-[#795bf4]/8 border-l-2 border-l-[#795bf4]" : ""}`}
            >
              <div className="w-9 h-9 bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{initials(chat.name, chat.id)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="flex-shrink-0 text-zinc-500"><channelInfo.Icon size={14} /></span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 truncate">{channelInfo.label}</span>
                    {showLiveBadge && (
                      <span className="rounded-full border border-[#66dba3]/30 bg-[#66dba3]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#2ea66f]">
                        Live
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 ml-2 flex-shrink-0">{timeAgo(chat.updated_at)}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{preview}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
