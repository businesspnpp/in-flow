'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Calculator,
  FileText,
  Facebook,
  Instagram,
  MessageSquare,
  Settings,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';

type Message = {
  id: string;
  sender: 'business' | 'customer';
  body: string;
  created_at: string;
};

type TabKey = 'chats' | 'tools' | 'settings';

const TOOL_ACTIONS = [
  {
    label: 'Invoice',
    text: '📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.',
    icon: FileText,
  },
  {
    label: 'BookedIt',
    text: '📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!',
    icon: CalendarCheck,
  },
  {
    label: 'Quote',
    text: '🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00',
    icon: Calculator,
  },
  {
    label: 'Menu',
    text: '🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.',
    icon: ShoppingBag,
  },
];

const CHANNELS = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'WhatsApp Business conversation routing.',
    icon: MessageSquare,
    status: 'Active',
  },
  {
    id: 'instagram',
    title: 'Instagram DM',
    description: 'Instagram message sync for business.',
    icon: Instagram,
    status: 'Coming Soon',
  },
  {
    id: 'facebook',
    title: 'Facebook Business',
    description: 'Page message integration for Facebook.',
    icon: Facebook,
    status: 'Coming Soon',
  },
  {
    id: 'sms',
    title: 'SMS Gateway',
    description: 'Local SMS channel for customer updates.',
    icon: Smartphone,
    status: 'Coming Soon',
  },
];

const initialMessages: Message[] = [
  {
    id: 'm-1',
    sender: 'customer',
    body: "Hi, I'm interested in automating my business setup and scheduling a consultation.",
    created_at: new Date().toISOString(),
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('chats');
  const [chatView, setChatView] = useState<'list' | 'thread'>('list');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

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
    if (/(hello|hi|details)/.test(normalized)) {
      return 'Awesome, thank you! Do you have an open slot available this Tuesday afternoon for that consultation?';
    }
    if (/(booking|scheduled|confirmed)/.test(normalized)) {
      return 'Perfect! 16:00 on Tuesday works beautifully for me. Should I expect a voice call or a link through here?';
    }
    if (/(invoice|payment|r250)/.test(normalized)) {
      return "Received, thank you! I'll process the payment right away and let you know when it goes through.";
    }
    return 'Sounds good, thanks for confirming! What are the next steps to get everything finalized on your end?';
  }

  function scheduleAutoReply(outgoing: string) {
    if (replyTimer.current) {
      window.clearTimeout(replyTimer.current);
    }
    const nextReply = getAutoReply(outgoing);
    replyTimer.current = window.setTimeout(() => {
      appendMessage(nextReply, 'customer');
      replyTimer.current = null;
    }, 4000);
  }

  useEffect(() => {
    return () => {
      if (replyTimer.current) {
        window.clearTimeout(replyTimer.current);
      }
    };
  }, []);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'business');
    setInput('');
    scheduleAutoReply(trimmed);
  }

  function handleToolbarAction(text: string) {
    appendMessage(text, 'business');
    scheduleAutoReply(text);
  }

  function openThread() {
    setActiveTab('chats');
    setChatView('thread');
  }

  function goBackToList() {
    setChatView('list');
  }

  function switchTab(tab: TabKey) {
    setActiveTab(tab);
    if (tab === 'chats') {
      setChatView('list');
    }
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-white text-zinc-900">
      <header className="flex-shrink-0 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold">inFlow sandbox</p>
            <p className="text-xs text-zinc-500">Client-side review mode</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Mock</span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 scrollbar-none">
          {TOOL_ACTIONS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => handleToolbarAction(tool.text)}
              className="flex-shrink-0 rounded-full bg-zinc-100 px-4 py-2 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-200"
            >
              {tool.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'chats' ? (
          chatView === 'list' ? (
            <section className="h-full min-h-0 overflow-hidden">
              <div className="px-4 py-4 border-b border-zinc-200">
                <p className="text-sm font-semibold">Chats</p>
                <p className="mt-1 text-xs text-zinc-500">Tap any conversation to open the thread.</p>
              </div>
              <div className="overflow-y-auto px-4 py-3 min-h-0 h-[calc(100%-84px)]">
                <button
                  type="button"
                  onClick={openThread}
                  className="w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left transition hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-white">C</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900">Customer One</p>
                      <p className="mt-1 text-xs text-zinc-500">WhatsApp Business • Latest: consultation request</p>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          ) : (
            <section className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3">
                <button type="button" onClick={goBackToList} className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <p className="text-sm font-semibold">Customer One</p>
                  <p className="text-xs text-zinc-500">WhatsApp conversation</p>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === 'business'
                        ? 'bg-amber-600 text-white rounded-br-none'
                        : 'bg-white text-zinc-900 rounded-bl-none border border-zinc-200'
                    }`}>
                      <p>{message.body}</p>
                      <p className={`mt-2 text-[10px] text-right ${message.sender === 'business' ? 'text-amber-100' : 'text-zinc-500'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-zinc-200 bg-white px-4 py-4">
                <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message"
                    className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>
          )
        ) : activeTab === 'tools' ? (
          <section className="h-full min-h-0 overflow-y-auto px-4 py-4">
            <div className="mb-4">
              <p className="text-sm font-semibold">Tools</p>
              <p className="mt-1 text-xs text-zinc-500">Administrative workspace for quick actions.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {TOOL_ACTIONS.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => handleToolbarAction(tool.text)}
                  className="group rounded-3xl border border-zinc-200 bg-white p-4 text-left transition hover:border-amber-300"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-amber-700">
                    <tool.icon size={18} />
                  </div>
                  <p className="mt-3 font-semibold text-zinc-900">{tool.label}</p>
                  <p className="mt-2 text-sm text-zinc-500">Send a mock {tool.label.toLowerCase()} card into the chat.</p>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="h-full min-h-0 overflow-y-auto px-4 py-4">
            <div className="mb-4">
              <p className="text-sm font-semibold">Settings</p>
              <p className="mt-1 text-xs text-zinc-500">Omni-channel integrations and connection status.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CHANNELS.map((channel) => (
                <div key={channel.id} className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                        <channel.icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{channel.title}</p>
                        <p className="text-xs text-zinc-500">{channel.description}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">{channel.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className="flex-shrink-0 border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => switchTab('chats')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'chats' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Chats
          </button>
          <button
            type="button"
            onClick={() => switchTab('tools')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'tools' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Tools
          </button>
          <button
            type="button"
            onClick={() => switchTab('settings')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'settings' ? 'bg-amber-100 text-amber-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
}
