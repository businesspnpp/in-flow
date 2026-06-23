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
    <div className="h-[100dvh] w-screen flex flex-col overflow-hidden bg-zinc-50">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3">
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

      <div className="flex-1 min-h-0 overflow-y-auto md:flex-row flex-col pt-0 pb-20 md:pt-0 md:pb-0">
        {/* Column 1 – Chat List */}
        <div className={`${panel === 'chats' ? 'flex' : 'hidden'} min-h-0 w-full md:flex md:w-1/4 md:min-w-[240px] md:flex-col md:border-r md:border-zinc-200`}>
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
        <div className={`${panel === 'plugins' ? 'flex' : 'hidden'} min-h-0 w-full md:flex md:w-1/4 md:min-w-[280px] md:flex-col`}>
          <PluginContainer activeChat={activeChat} business={business} onBusinessUpdate={setBusiness} />
        </div>
      </div>
      {/* Fixed bottom nav for mobile: occupies safe area and is always visible */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-zinc-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-full mx-auto flex items-center gap-2 px-2 py-2">
          <button
            onClick={() => setPanel('chats')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
              panel === 'chats' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'
            }`}
            style={{ minHeight: 44 }}
          >
            Chats
          </button>
          <button
            onClick={() => setPanel('chat')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
              panel === 'chat' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'
            }`}
            style={{ minHeight: 44 }}
          >
            Conversation
          </button>
          <button
            onClick={() => setPanel('plugins')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
              panel === 'plugins' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:text-zinc-900'
            }`}
            style={{ minHeight: 44 }}
          >
            Tools
          </button>
        </div>
      </div>
    </div>
  );
}
