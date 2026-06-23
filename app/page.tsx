'use client';

import { useState, useRef } from 'react';
import { MessageSquare, FileText, CalendarCheck, Calculator, ShoppingBag } from 'lucide-react';

export default function Home() {
  // Mock conversation state for demo
  const [conversations, setConversations] = useState(() => [
    {
      id: 'mock-1',
      name: 'Customer One (WhatsApp Test)',
      updated_at: new Date().toISOString(),
      last_message: "Hi, I'm interested in automating my business setup and scheduling a consultation.",
      messages: [
        {
          id: 'm-in-1',
          sender: 'customer',
          body: "Hi, I'm interested in automating my business setup and scheduling a consultation.",
          created_at: new Date().toISOString(),
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState('mock-1');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  function appendMessage(text: string, from: 'business' | 'customer' = 'business') {
    setConversations((prev) => {
      return prev.map((c) => {
        if (c.id !== activeId) return c;
        const msg = {
          id: `m-${Date.now()}`,
          sender: from === 'business' ? 'business' : 'customer',
          body: text,
          created_at: new Date().toISOString(),
        };
        return {
          ...c,
          messages: [...c.messages, msg],
          last_message: text,
          updated_at: new Date().toISOString(),
        };
      });
    });
    // scroll into view after a short delay
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function handleSend() {
    if (!input.trim()) return;
    appendMessage(input.trim(), 'business');
    setInput('');
  }

  // Plugin output handler
  function handlePluginAction(text: string) {
    appendMessage(text, 'business');
  }

  const activeConv = conversations.find((c) => c.id === activeId)!;

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">iF</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">inFlow (Demo)</p>
              <p className="text-xs text-zinc-500">Meta App Review sandbox</p>
            </div>
          </div>
        </div>
        {/* Top tool menu (static, scrollable) */}
        <div className="flex-shrink-0 w-full overflow-x-auto whitespace-nowrap scrollbar-none flex flex-row items-center gap-2 px-3 py-2 bg-white border-b border-zinc-200">
          <button onClick={() => handlePluginAction('📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-700"> <FileText size={16} /> Invoice</button>
          <button onClick={() => handlePluginAction('📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-700"> <CalendarCheck size={16} /> BookedIt</button>
          <button onClick={() => handlePluginAction('🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-700"> <Calculator size={16} /> Quote</button>
          <button onClick={() => handlePluginAction('🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-700"> <ShoppingBag size={16} /> Menu</button>
        </div>
      </div>

      {/* Main content: sidebar + conversation + tools area */}
      <div className="flex-1 min-h-0 md:flex-row flex-col pt-0">
        {/* Sidebar */}
        <div className="min-h-0 w-full md:w-1/4 md:min-w-[240px] border-r border-zinc-100 bg-white">
          <div className="p-3 border-b border-zinc-200">
            <input placeholder="Search conversations..." className="w-full bg-zinc-50 rounded-lg px-3 py-2 text-sm outline-none border border-zinc-200" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full flex items-center gap-3 px-4 py-3 border-b border-zinc-100 text-left ${activeId === c.id ? 'bg-zinc-50 border-l-4 border-l-amber-600' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold">C1</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 truncate">{c.name}</span>
                    <span className="text-[10px] text-zinc-500">now</span>
                  </div>
                  <p className="text-xs text-zinc-600 truncate mt-1">{c.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation panel */}
        <div className="w-full flex-1 min-h-0 flex flex-col md:w-2/4">
          <div className="flex-shrink-0 px-4 py-3 border-b border-zinc-200 bg-white">
            <p className="text-sm font-semibold text-zinc-900">{activeConv.name}</p>
            <p className="text-xs text-zinc-500">+{activeConv.id}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-24 w-full max-w-full">
            <div className="flex flex-col gap-3 mt-4">
              {activeConv.messages.map((m: any) => (
                <div key={m.id} className={`flex ${m.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.sender === 'business' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-none'} max-w-[85%] px-3 py-2 rounded-lg text-sm`}> 
                    <p>{m.body}</p>
                    <p className={`text-[10px] mt-1 ${m.sender === 'business' ? 'text-amber-100' : 'text-zinc-500'} text-right`}>{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-zinc-200 bg-white">
            <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
              <textarea rows={1} placeholder="Type a reply..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none resize-none max-h-32" />
              <button onClick={handleSend} disabled={!input.trim()} className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tools/Plugins side (show plugin-like info) */}
        <div className="min-h-0 w-full md:w-1/4 md:min-w-[280px] border-l border-zinc-100 bg-white p-4">
          <p className="text-sm font-semibold text-zinc-900">Tools</p>
          <div className="mt-3 space-y-3">
            <button onClick={() => handlePluginAction('📄 Invoice Generated: #INV-2026-001 — Total: R250.00. Click to view.')} className="w-full text-left rounded-lg border border-zinc-200 px-3 py-2 text-sm">Generate Invoice</button>
            <button onClick={() => handlePluginAction('📅 Consultation Confirmed: Tuesday at 16:00. Looking forward to speaking with you!')} className="w-full text-left rounded-lg border border-zinc-200 px-3 py-2 text-sm">Send Booking</button>
            <button onClick={() => handlePluginAction('🛠️ Quote Details: Basic Diagnostics & Labour — Total: R750.00')} className="w-full text-left rounded-lg border border-zinc-200 px-3 py-2 text-sm">Send Quote</button>
            <button onClick={() => handlePluginAction('🍔 Order Summary: 1x Quarter Leg & Chips (R55). Processing order now.')} className="w-full text-left rounded-lg border border-zinc-200 px-3 py-2 text-sm">Send Order</button>
          </div>
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t flex flex-row items-center justify-around">
        <button className="text-sm text-zinc-700">Chats</button>
        <button className="text-sm text-zinc-700">Conversation</button>
        <button className="text-sm text-zinc-700">Tools</button>
      </div>
    </div>
  );
}
