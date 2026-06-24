'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/supabase';
import BusinessSettings from '@/components/BusinessSettings';
import {
  ArrowLeft,
  ArrowRight,
  LogOut,
  MessageSquare,
  Settings,
  Zap,
  Users,
  PlusCircle,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Send,
  Inbox,
  Sparkles,
  BarChart3,
} from 'lucide-react';

type Message = {
  id: string;
  sender: 'business' | 'customer';
  body: string;
  created_at: string;
};

type GlobalTab = 'chats' | 'tools' | 'settings';

const TOOL_ACTIONS = [
  { label: 'Invoice', text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.', icon: '📄' },
  { label: 'BookedIt', text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!', icon: '📅' },
  { label: 'Quote', text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00', icon: '🛠️' },
  { label: 'Menu', text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.', icon: '🍔' },
];

const initialMessages: Message[] = [
  {
    id: 'm-1',
    sender: 'customer',
    body: "Hi! I'd like to book an appointment for a hair wash, treatment, and styling this week if you have any openings?",
    created_at: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [loadingSession, setLoadingSession] = useState(true);
  const [globalTab, setGlobalTab] = useState<GlobalTab>('chats');
  const [showThread, setShowThread] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  useEffect(() => {
    async function verifyAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .single();
      if (businessData) setBusiness(businessData);
      setLoadingSession(false);
    }
    verifyAuth();
  }, [router]);

  function scrollToBottom() {
    window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function appendMessage(text: string, sender: 'business' | 'customer' = 'business') {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender,
        body: text,
        created_at: new Date().toISOString(),
      },
    ]);
    scrollToBottom();
  }

  function getAutoReply(outgoing: string) {
    const normalized = outgoing.toLowerCase();
    if (/(hello|hi|details)/.test(normalized)) {
      return 'Awesome, thank you! Do you have a free slot available this Tuesday afternoon?';
    }
    if (/(booking|scheduled|confirmed)/.test(normalized)) {
      return 'Perfect! 16:00 on Tuesday works beautifully for me. See you then!';
    }
    if (/(invoice|payment|r250)/.test(normalized)) {
      return "Got the summary, thank you! I'll see you on Tuesday and settle up right after.";
    }
    return 'Sounds good, thanks for confirming! Let me know what the next steps are.';
  }

  function scheduleAutoReply(outgoing: string) {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    const nextReply = getAutoReply(outgoing);
    replyTimer.current = window.setTimeout(() => {
      appendMessage(nextReply, 'customer');
      replyTimer.current = null;
    }, 4000);
  }

  useEffect(() => {
    return () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    };
  }, []);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'business');
    setInput('');
    scheduleAutoReply(trimmed);
  }

  function handleToolAction(text: string) {
    appendMessage(text, 'business');
    scheduleAutoReply(text);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
      setIsSigningOut(false);
      alert('Failed to sign out. Please try again.');
    }
  }

  if (loadingSession) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-indigo-900/70">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Header */}
      <header className="flex-shrink-0 border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">inFlow</p>
              <p className="text-xs text-slate-500 font-medium">Unified Inbox</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-indigo-50/80 px-4 py-2 rounded-full border border-indigo-100/60">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              <span className="text-xs font-semibold text-indigo-900">Live</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2 rounded-full bg-red-500/90 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-red-200 hover:shadow-red-300 disabled:opacity-50"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
        {/* Tool Pills - More Interactive */}
        <div className="border-t border-slate-100/60 overflow-x-auto scrollbar-none px-6 py-3 bg-white/40">
          <div className="flex gap-2.5 whitespace-nowrap">
            {TOOL_ACTIONS.map((tool) => (
              <button
                key={tool.label}
                onClick={() => handleToolAction(tool.text)}
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-white border border-slate-200/80 px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/60 hover:shadow-md hover:scale-[1.02] active:scale-95"
              >
                <span className="text-base">{tool.icon}</span>
                {tool.label}
              </button>
            ))}
            <button className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-5 py-2.5 text-xs font-medium text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600">
              <PlusCircle size={16} />
              <span>Add Action</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Refined */}
      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        {/* Chats Tab */}
        {globalTab === 'chats' && (
          <div className="h-full w-full overflow-hidden">
            {!showThread ? (
              <div className="flex flex-col h-full overflow-hidden bg-white/40 backdrop-blur-sm">
                <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100/70 bg-white/60 backdrop-blur-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                      <Inbox size={18} className="text-indigo-500" />
                      Conversations
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">2 active chats · 1 unread</p>
                  </div>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 bg-white/80 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all w-36 focus:w-48" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  <button
                    onClick={() => setShowThread(true)}
                    className="w-full rounded-2xl bg-white border border-slate-200/80 p-5 text-left transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-base font-bold text-white shadow-md shadow-orange-200">
                      C1
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">Customer One</p>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">2m ago</span>
                      </div>
                      <p className="truncate text-xs text-slate-500 mt-0.5">WhatsApp Business · Consultation request</p>
                    </div>
                    <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  </button>
                  
                  <div className="w-full rounded-2xl bg-white border border-slate-200/80 p-5 opacity-60 transition-all flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-400">
                      C2
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-600">Customer Two</p>
                        <span className="text-[10px] font-medium text-slate-400">1h ago</span>
                      </div>
                      <p className="truncate text-xs text-slate-400 mt-0.5">Email · Support request</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Thread View - Enhanced
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100/70 bg-white/80 backdrop-blur-sm flex items-center gap-4">
                  <button
                    onClick={() => setShowThread(false)}
                    className="rounded-full border border-slate-200 p-2 text-slate-600 transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                      C1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Customer One</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        WhatsApp Business · Online
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-slate-50/50 to-white/80 flex flex-col gap-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                          message.sender === 'business'
                            ? 'rounded-br-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-200/50'
                            : 'rounded-bl-md bg-white border border-slate-200/80 text-slate-800 shadow-slate-200/30'
                        }`}
                      >
                        <p>{message.body}</p>
                        <p className={`mt-1.5 text-[10px] text-right font-medium ${message.sender === 'business' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                
                <div className="flex-shrink-0 border-t border-slate-100/70 bg-white/80 backdrop-blur-sm px-6 py-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full pl-5 pr-1.5 py-1.5 shadow-inner focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100/50 transition-all">
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
                      className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 py-2"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="flex h-10 w-10 items-center justify-center flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 transition-all hover:scale-105 hover:shadow-indigo-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tools Tab - More Visual */}
        {globalTab === 'tools' && (
          <div className="h-full overflow-y-auto px-6 py-8 bg-white/40 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Workspace Tools</h2>
                  <p className="text-sm text-slate-500">Quick actions to power your conversations</p>
                </div>
              </div>
              
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {TOOL_ACTIONS.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => handleToolAction(tool.text)}
                    className="group rounded-2xl bg-white border border-slate-200/80 p-6 text-left transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 flex flex-col items-start gap-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-2xl group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{tool.label}</p>
                      <p className="mt-1 text-xs text-slate-500">Send a mock card into chat</p>
                    </div>
                  </button>
                ))}
                <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center gap-2 opacity-60 hover:opacity-100 hover:border-indigo-300 transition-all">
                  <div className="p-3 rounded-full bg-slate-100 text-slate-400">
                    <PlusCircle size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Add Custom Tool</p>
                  <p className="text-xs text-slate-400">Create a new quick action</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab - Refined */}
        {globalTab === 'settings' && (
          <div className="h-full overflow-y-auto px-6 py-8 bg-white/40 backdrop-blur-sm">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                  <p className="text-sm text-slate-500">Manage your business profile</p>
                </div>
              </div>
              {business ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <BusinessSettings
                    business={business}
                    onUpdated={(updated) => setBusiness(updated)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
                  <p className="text-sm text-slate-400">Loading business profile...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Enhanced */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/50 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 md:static">
        <div className="flex items-center justify-around px-4 py-2.5 md:justify-start md:gap-3 md:px-6">
          <button
            onClick={() => { setGlobalTab('chats'); setShowThread(false); }}
            className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              globalTab === 'chats' 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <MessageSquare size={18} strokeWidth={globalTab === 'chats' ? 2.5 : 2} />
            <span className="hidden sm:inline">Chats</span>
          </button>
          <button
            onClick={() => setGlobalTab('tools')}
            className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              globalTab === 'tools' 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <Zap size={18} strokeWidth={globalTab === 'tools' ? 2.5 : 2} />
            <span className="hidden sm:inline">Tools</span>
          </button>
          <button
            onClick={() => setGlobalTab('settings')}
            className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              globalTab === 'settings' 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <Settings size={18} strokeWidth={globalTab === 'settings' ? 2.5 : 2} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
