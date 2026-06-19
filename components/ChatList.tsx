'use client';

import { useEffect, useState } from 'react';
import { supabase, Chat } from '@/lib/supabase';
import { MessageCircle, Search } from 'lucide-react';

interface ChatListProps {
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export default function ChatList({ activeChat, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState('');

  // Initial load
  useEffect(() => {
    async function fetchChats() {
      const { data } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });
      if (data) setChats(data as Chat[]);
    }
    fetchChats();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('chats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chats' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setChats((prev) => [payload.new as Chat, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setChats((prev) =>
              prev
                .map((c) => (c.id === (payload.new as Chat).id ? (payload.new as Chat) : c))
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = chats.filter(
    (c) =>
      (c.name ?? c.id).toLowerCase().includes(search.toLowerCase()) ||
      c.id.includes(search)
  );

  function initials(name: string | null, id: string) {
    const label = name ?? id;
    return label.slice(0, 2).toUpperCase();
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  return (
    <div className="flex flex-col h-full bg-[#13131a]">
      {/* Search bar */}
      <div className="p-2 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2 bg-[#1a1a24] rounded-lg px-2 py-1">
          <Search size={14} className="text-[#9090a8]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#e8e8f0] placeholder-[#9090a8] outline-none flex-1"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#4a4a5a]">
            <MessageCircle size={32} />
            <span className="text-xs">No conversations yet</span>
          </div>
        )}
        {filtered.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full flex items-center gap-3 px-3 py-2 border-b border-[#1a1a24] hover:bg-[#1a1a24] transition-colors text-left ${
              activeChat?.id === chat.id ? 'bg-[#1a1a24] border-l-2 border-l-[#6c63ff]' : ''
            }`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#9c93ff] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {initials(chat.name, chat.id)}
              </span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#e8e8f0] truncate">
                  {chat.name ?? chat.id}
                </span>
                <span className="text-[10px] text-[#9090a8] ml-1 flex-shrink-0">
                  {timeAgo(chat.updated_at)}
                </span>
              </div>
              <p className="text-xs text-[#9090a8] truncate mt-0.5">
                {chat.last_message ?? '—'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
