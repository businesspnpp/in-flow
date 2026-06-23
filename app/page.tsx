'use client';

import { useEffect, useState } from 'react';
import BusinessOnboarding from '@/components/BusinessOnboarding';
import Auth from '@/components/Auth';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import PluginContainer from '@/components/PluginContainer';
import { supabase, Chat, Business } from '@/lib/supabase';

export default function Home() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [panel, setPanel] = useState<'chats' | 'chat' | 'plugins'>('chats');

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await supabase.from('businesses').select('*').limit(1).single();
      if (data) {
        setBusiness(data as Business);
      }
      setLoading(false);
    }
    loadBusiness();
  }, []);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setSessionLoading(false);
      supabase.auth.onAuthStateChange((_event, sess) => {
        setIsAuthenticated(!!sess?.access_token);
      });
    }
    checkSession();
  }, []);

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-500">
        Loading business profile...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onSignedIn={() => setIsAuthenticated(true)} />;
  }

  if (!business) {
    return <BusinessOnboarding onCompleted={(newBusiness) => setBusiness(newBusiness)} />;
  }

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-zinc-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">iF</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 tracking-tight truncate">
              in<span className="text-amber-600">Flow</span>
            </p>
            <p className="text-xs text-zinc-600 truncate block">{business.business_name}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-600 text-xs font-medium">Live</span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden md:flex-row flex-col pt-12 pb-12 md:pt-0 md:pb-0">
        {/* Column 1 – Chat List */}
        <div className={`${panel === 'chats' ? 'flex' : 'hidden'} min-h-0 md:flex md:w-1/4 md:min-w-[240px] md:flex-col md:border-r md:border-zinc-200`}>
          <ChatList
            activeChat={activeChat}
            onSelectChat={(chat) => {
              setActiveChat(chat);
              setPanel('chat');
            }}
          />
        </div>

        {/* Column 2 – Chat Window */}
        <div className={`${panel === 'chat' ? 'flex' : 'hidden'} w-full flex-1 min-h-0 flex-col md:w-2/4 md:border-r md:border-zinc-200`}> 
          <ChatWindow activeChat={activeChat} />
        </div>

        {/* Column 3 – Plugin Container */}
        <div className={`${panel === 'plugins' ? 'flex' : 'hidden'} min-h-0 md:flex md:w-1/4 md:min-w-[280px] md:flex-col`}>
          <PluginContainer activeChat={activeChat} business={business} onBusinessUpdate={setBusiness} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 bg-white p-2 md:hidden gap-2">
        <button
          onClick={() => setPanel('chats')}
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${panel === 'chats' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'}`}
        >
          Chats
        </button>
        <button
          onClick={() => setPanel('chat')}
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${panel === 'chat' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'}`}
        >
          Conversation
        </button>
        <button
          onClick={() => setPanel('plugins')}
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${panel === 'plugins' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'}`}
        >
          Tools
        </button>
      </div>
    </div>
  );
}
