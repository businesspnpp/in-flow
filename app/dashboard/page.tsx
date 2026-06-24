'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Chat, Message } from '@/lib/supabase';
import {
  ArrowLeft,
  ArrowRight,
  LogOut,
  MessageSquare,
  Settings,
  Smartphone,
  Zap,
  Instagram,
  Facebook,
} from 'lucide-react';

type GlobalTab = 'chats' | 'tools' | 'settings';

type ChannelItem = {
  id: string;
  name: string;
  description: string;
  Icon: typeof MessageSquare;
  isActive: boolean;
};

const TOOL_ACTIONS = [
  { label: 'Invoice', text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.' },
  { label: 'BookedIt', text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!' },
  { label: 'Quote', text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00' },
  { label: 'Menu', text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.' },
];

const CHANNELS: ChannelItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Link your WhatsApp Business profile via Meta Secure OAuth.',
    Icon: MessageSquare,
    isActive: true,
  },
  {
    id: 'instagram',
    name: 'Instagram DM',
    description: 'Manage your professional Instagram direct messages.',
    Icon: Instagram,
    isActive: false,
  },
  {
    id: 'facebook',
    name: 'Facebook Business',
    description: 'Sync your company Facebook Page conversations.',
    Icon: Facebook,
    isActive: false,
  },
  {
    id: 'sms',
    name: 'SMS Gateway',
    description: 'Connect your local SMS integration.',
    Icon: Smartphone,
    isActive: false,
  },
];

const META_CONFIG_ID = '2301977283876651';

type BusinessProfile = {
  id: string;
  whatsapp_phone_number_id?: string | null;
  whatsapp_number?: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [loadingSession, setLoadingSession] = useState(true);
  const [globalTab, setGlobalTab] = useState<GlobalTab>('chats');
  const [showThread, setShowThread] = useState(false);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [connectSuccess, setConnectSuccess] = useState('');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatChannelRef = useRef<any>(null);
  const messageChannelRef = useRef<any>(null);

  useEffect(() => {
    async function verifyAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setLoadingSession(false);
    }

    verifyAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loadingSession) {
      return;
    }

    async function loadBusiness() {
      const { data, error } = await supabase
        .from<BusinessProfile>('businesses')
        .select('id,whatsapp_phone_number_id,whatsapp_number')
        .limit(1)
        .single();

      if (error) {
        console.error('[Dashboard] Load business failed:', error);
        return;
      }

      setBusiness(data ?? null);
      setWhatsappConnected(Boolean(data?.whatsapp_phone_number_id));
    }

    loadBusiness();
  }, [loadingSession]);

  useEffect(() => {
    if (loadingSession) {
      return;
    }

    async function loadChats() {
      const { data, error } = await supabase
        .from<Chat>('chats')
        .select('id,name,last_message,updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('[Dashboard] Load chats failed:', error);
        return;
      }

      setChats(data ?? []);
    }

    loadChats();

    const channel = supabase
      .channel('chats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chats' },
        (payload) => {
          const incoming = payload.new as Chat;
          setChats((prev) => {
            const next = prev.filter((chat) => chat.id !== incoming.id);
            return [incoming, ...next].sort(
              (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          });
        }
      )
      .subscribe();

    chatChannelRef.current = channel;

    return () => {
      if (chatChannelRef.current) {
        supabase.removeChannel(chatChannelRef.current);
      }
    };
  }, [loadingSession]);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      const { data, error } = await supabase
        .from<Message>('messages')
        .select('id,chat_id,sender,body,created_at')
        .eq('chat_id', activeChat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[Dashboard] Load messages failed:', error);
        setError(error.message);
        return;
      }

      setMessages(data ?? []);
    }

    loadMessages();

    const channel = supabase
      .channel(`messages-${activeChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${activeChat.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    messageChannelRef.current = channel;

    return () => {
      if (messageChannelRef.current) {
        supabase.removeChannel(messageChannelRef.current);
      }
    };
  }, [activeChat]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (!event.origin.endsWith('facebook.com')) {
        return;
      }

      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'WA_EMBEDDED_SIGNUP') {
          return;
        }

        if (data.event === 'FINISH' && data.data) {
          window.sessionStorage.setItem(
            'wa_embedded_signup',
            JSON.stringify({ phone_number_id: data.data.phone_number_id, waba_id: data.data.waba_id })
          );
        }
      } catch {
        // Ignore malformed messages from other frames or domains.
      }
    };

    window.addEventListener('message', listener);

    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(js);
    }

    (window as any).fbAsyncInit = function () {
      (window as any).FB?.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v20.0',
      });
    };

    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  async function sendChatMessage(chat: Chat, body: string) {
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }

    setError(null);

    const { error: insertError } = await supabase.from('messages').insert({
      chat_id: chat.id,
      sender: 'business',
      body: trimmed,
    });

    if (insertError) {
      console.error('[Dashboard] Message insert failed:', insertError);
      setError('Unable to send message to the database.');
      return;
    }

    const { error: updateError } = await supabase
      .from('chats')
      .update({ last_message: trimmed, updated_at: new Date().toISOString() })
      .eq('id', chat.id);

    if (updateError) {
      console.error('[Dashboard] Chat update failed:', updateError);
    }

    if (activeChat?.id === chat.id) {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          chat_id: chat.id,
          sender: 'business',
          body: trimmed,
          created_at: new Date().toISOString(),
        },
      ]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || !activeChat) {
      return;
    }

    setInput('');
    await sendChatMessage(activeChat, trimmed);
  }

  async function handleToolAction(text: string) {
    const chatToSend = activeChat ?? chats[0];
    if (!chatToSend) {
      setError('Select a conversation before using quick actions.');
      return;
    }

    if (!activeChat) {
      setActiveChat(chatToSend);
      setShowThread(true);
    }

    await sendChatMessage(chatToSend, text);
  }

  async function attemptConnectWithDiagnostics() {
    setConnectError('');
    setConnectSuccess('');
    setConnectLoading(true);

    if (!business) {
      setConnectError('Unable to connect WhatsApp: missing business profile.');
      setConnectLoading(false);
      return;
    }

    try {
      const diagRes = await fetch('/api/whatsapp/diagnostics', { method: 'POST' });
      const diagData = await diagRes.json();

      if (!diagRes.ok || !diagData?.ok) {
        setConnectError(diagData?.error || 'Diagnostics failed.');
        return;
      }

      const missing = Object.entries(diagData.result?.env || {})
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missing.length > 0) {
        setConnectError(`Missing env: ${missing.join(', ')}.`);
        return;
      }

      await handleEmbeddedSignup();
    } catch (err) {
      console.error('[Dashboard] WhatsApp diagnostics failed:', err);
      setConnectError(err instanceof Error ? err.message : 'Diagnostics request failed');
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleEmbeddedSignup() {
    const fb = (window as any).FB;
    if (!fb) {
      setConnectError('Facebook SDK failed to load. Please refresh the page.');
      return;
    }

    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      setConnectError(
        'Login timed out — the auth dialog may be blocked by your browser. Please allow popups and try again.'
      );
    }, 30000);

    fb.login(
      async (response: any) => {
        window.clearTimeout(timer);
        if (timedOut) {
          return;
        }

        if (!response?.authResponse?.code) {
          setConnectError('Onboarding cancelled or permissions were not fully authorized.');
          return;
        }

        const authCode = response.authResponse.code;

        let signupMeta: { phone_number_id?: string; waba_id?: string } = {};
        try {
          const raw = window.sessionStorage.getItem('wa_embedded_signup');
          if (raw) {
            signupMeta = JSON.parse(raw);
          }
        } catch {
          // ignore parse errors
        }

        try {
          const connectRes = await fetch('/api/whatsapp/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              business_id: business?.id,
              code: authCode,
              waba_id: signupMeta.waba_id,
              phone_number_id: signupMeta.phone_number_id,
            }),
          });

          const connectData = await connectRes.json();

          if (!connectRes.ok) {
            setConnectError(connectData?.error || `Server responded with status ${connectRes.status}`);
            return;
          }

          setConnectSuccess('WhatsApp Business Account connected successfully.');
          setWhatsappConnected(true);
          window.sessionStorage.removeItem('wa_embedded_signup');
        } catch (err) {
          console.error('[Dashboard] WhatsApp connect failed:', err);
          setConnectError(err instanceof Error ? err.message : 'WhatsApp connect failed.');
        }
      },
      {
        config_id: META_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '3',
        },
      }
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
      setIsSigningOut(false);
      setError('Failed to sign out. Please try again.');
    }
  }

  if (loadingSession) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-white">
        <p className="text-sm font-semibold text-zinc-500 animate-pulse">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-white">
      <header className="flex-shrink-0 border-b border-zinc-200 bg-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900">inFlow</p>
            <p className="text-xs text-zinc-500">Production Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Authenticated
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
              title="Sign out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-100 overflow-x-auto scrollbar-none px-4 py-3">
          <div className="flex gap-2 whitespace-nowrap">
            {TOOL_ACTIONS.map((tool) => (
              <button
                key={tool.label}
                onClick={() => handleToolAction(tool.text)}
                className="flex-shrink-0 inline-flex items-center rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                {tool.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        {globalTab === 'chats' && (
          <div className="h-full w-full overflow-hidden">
            {!showThread ? (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0 px-4 py-4 border-b border-zinc-100 bg-white">
                  <h2 className="text-sm font-semibold text-zinc-900">Chats</h2>
                  <p className="mt-1 text-xs text-zinc-500">Live conversation stream</p>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  {chats.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
                      No active conversations found yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => {
                            setActiveChat(chat);
                            setShowThread(true);
                            setError(null);
                          }}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-left transition hover:bg-zinc-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white">
                              {(chat.name ?? chat.id).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-zinc-900">{chat.name ?? chat.id}</p>
                              <p className="truncate text-xs text-zinc-500">{chat.last_message ?? 'No recent message'}</p>
                            </div>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(chat.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0 px-4 py-3 border-b border-zinc-200 bg-white flex items-center gap-3">
                  <button
                    onClick={() => setShowThread(false)}
                    className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100 md:hidden"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{activeChat?.name ?? activeChat?.id}</p>
                    <p className="text-xs text-zinc-500">WhatsApp Business</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 bg-zinc-50 flex flex-col gap-3">
                  {messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-zinc-500">
                      <p className="text-sm">No messages in this conversation yet.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                            message.sender === 'business'
                              ? 'rounded-br-none bg-amber-600 text-white'
                              : 'rounded-bl-none border border-zinc-200 bg-white text-zinc-900'
                          }`}
                        >
                          <p>{message.body}</p>
                          <p className={`mt-2 text-[10px] text-right ${message.sender === 'business' ? 'text-amber-100' : 'text-zinc-500'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="flex-shrink-0 border-t border-zinc-200 bg-white px-4 py-4">
                  <div className="flex flex-row items-center justify-between w-full gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-full">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="flex h-9 w-9 items-center justify-center flex-shrink-0 rounded-full bg-amber-600 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {globalTab === 'tools' && (
          <div className="h-full overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-lg font-semibold text-zinc-900">Tools</h2>
              <p className="mt-1 text-xs text-zinc-500">Administrative workspace for quick actions.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {TOOL_ACTIONS.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => handleToolAction(tool.text)}
                    className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-left transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-amber-600">
                      <Zap size={18} />
                    </div>
                    <p className="mt-3 font-semibold text-zinc-900">{tool.label}</p>
                    <p className="mt-1 text-xs text-zinc-500">Send a quick action into the selected conversation.</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {globalTab === 'settings' && (
          <div className="h-full overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-lg font-semibold text-zinc-900">Connected Channels</h2>
              <p className="mt-1 text-xs text-zinc-500">Omni-channel integrations and connection status.</p>
              <div className="mt-6 space-y-3">
                {CHANNELS.map((channel) => (
                  <div key={channel.id} className={`rounded-2xl border px-6 py-4 ${channel.isActive ? 'border-zinc-200 bg-white' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-lg flex-shrink-0 ${channel.isActive ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-500'}`}>
                        <channel.Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-900">{channel.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">{channel.description}</p>
                        <div className="mt-3">
                          {channel.isActive ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {channel.id === 'whatsapp' && channel.isActive && (
                      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">WhatsApp Business</p>
                              <p className="text-xs text-zinc-500">
                                {whatsappConnected ? `Connected to ${business?.whatsapp_number ?? 'your verified line'}` : 'Not integrated yet'}
                              </p>
                            </div>
                            <button
                              onClick={attemptConnectWithDiagnostics}
                              disabled={connectLoading}
                              className="rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                            >
                              {connectLoading ? 'Connecting...' : whatsappConnected ? 'Reconnect WhatsApp' : 'Connect WhatsApp'}
                            </button>
                          </div>

                          {connectSuccess ? (
                            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                              {connectSuccess}
                            </p>
                          ) : null}

                          {connectError ? (
                            <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                              {connectError}
                            </p>
                          ) : null}

                          <div className="rounded-2xl bg-white border border-zinc-200 p-4 text-xs text-zinc-600">
                            <p className="font-semibold text-zinc-900 text-sm">WhatsApp setup</p>
                            <p className="mt-2">This card starts the real Meta Secure OAuth connection for WhatsApp Business. Once completed, inbound messages will stream into this live inbox.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white md:static">
        <div className="flex items-center justify-around px-4 py-3 md:justify-start md:gap-2">
          <button
            onClick={() => {
              setGlobalTab('chats');
              setShowThread(false);
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              globalTab === 'chats' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Chats</span>
          </button>
          <button
            onClick={() => setGlobalTab('tools')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              globalTab === 'tools' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Zap size={18} />
            <span className="hidden sm:inline">Tools</span>
          </button>
          <button
            onClick={() => setGlobalTab('settings')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              globalTab === 'settings' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
