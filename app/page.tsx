'use client';

import { useState } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import PluginContainer from '@/components/PluginContainer';
import { Chat } from '@/lib/supabase';

export default function Home() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center h-12 px-5 bg-[#13131a] border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#6c63ff] flex items-center justify-center">
            <span className="text-white text-xs font-bold">iF</span>
          </div>
          <span className="text-white font-semibold tracking-wide text-sm">
            in<span className="text-[#6c63ff]">Flow</span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#9090a8] text-xs">Live</span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 pt-12">
        {/* Column 1 – Chat List (1/4) */}
        <div className="w-1/4 min-w-[240px] border-r border-[#2a2a3a] flex flex-col">
          <ChatList activeChat={activeChat} onSelectChat={setActiveChat} />
        </div>

        {/* Column 2 – Chat Window (2/4) */}
        <div className="w-2/4 flex flex-col border-r border-[#2a2a3a]">
          <ChatWindow activeChat={activeChat} />
        </div>

        {/* Column 3 – Plugin Container (1/4) */}
        <div className="w-1/4 min-w-[280px] flex flex-col">
          <PluginContainer activeChat={activeChat} />
        </div>
      </div>
    </div>
  );
}
