'use client';

import { useEffect, useState } from 'react';
import { Calculator, CheckSquare, Loader2, Send, Square } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';
import {
  buildPublicLink,
  createShortToken,
  ensureChatExists,
  isMissingTableError,
  isUuid,
  resolveBusinessId,
} from '@/lib/inflow-client';
import type { InflowCatalogItem } from '@/lib/inflow-types';

interface AiCandidateItem {
  item: string;
  quantity?: number;
  price?: number;
}

interface QuoteCraftProps {
  activeChat: Chat | null;
  aiContext?: unknown;
  aiPrefill?: unknown;
}

type DraftSelection = {
  checked: boolean;
  quantity: number;
  unitPrice: number;
};

let invoiceTableUnavailable = false;

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function parseAiCandidates(payload: unknown): AiCandidateItem[] {
  if (!payload || typeof payload !== 'object') return [];

  const root = payload as Record<string, unknown>;
  const output: AiCandidateItem[] = [];

  const extraction = root.extraction as Record<string, unknown> | undefined;
  const invoiceDetails = extraction?.invoiceDetails as Record<string, unknown> | undefined;
  const lineItems = invoiceDetails?.lineItems;

  if (Array.isArray(lineItems)) {
    lineItems.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const row = entry as Record<string, unknown>;
      if (typeof row.item !== 'string') return;
      output.push({
        item: row.item,
        quantity: typeof row.quantity === 'number' ? row.quantity : 1,
        price: typeof row.price === 'number' ? row.price : undefined,
      });
    });
  }

  const prefill = root.prefill as Record<string, unknown> | undefined;
  const selectedItems = prefill?.selectedItems;
  if (Array.isArray(selectedItems)) {
    selectedItems.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const row = entry as Record<string, unknown>;
      if (typeof row.item !== 'string') return;
      output.push({
        item: row.item,
        quantity: typeof row.quantity === 'number' ? row.quantity : 1,
        price: typeof row.price === 'number' ? row.price : undefined,
      });
    });
  }

  return output;
}

export default function QuoteCraft({ activeChat, aiContext, aiPrefill }: QuoteCraftProps) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<InflowCatalogItem[]>([]);
  const [draft, setDraft] = useState<Record<string, DraftSelection>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      setError(null);

      const id = await resolveBusinessId();
      if (!id) {
        setError('Unable to resolve business profile.');
        setLoading(false);
        return;
      }

      setBusinessId(id);

      const { data, error: catalogError } = await supabase
        .from('inflow_items_catalog')
        .select('*')
        .eq('business_id', id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (catalogError) {
        setError(catalogError.message);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as InflowCatalogItem[];
      setCatalog(rows);

      const baseline: Record<string, DraftSelection> = {};
      rows.forEach((item) => {
        baseline[item.id] = {
          checked: false,
          quantity: 1,
          unitPrice: Number(item.price),
        };
      });
      setDraft(baseline);
      setLoading(false);
    }

    loadCatalog();
  }, []);

  useEffect(() => {
    if (catalog.length === 0) return;
    const contextPayload = aiContext ?? aiPrefill;
    if (!contextPayload) return;

    const candidates = parseAiCandidates(contextPayload);
    if (candidates.length === 0) {
      const textBlob = JSON.stringify(contextPayload).toLowerCase();
      setDraft((prev) => {
        const next = { ...prev };
        catalog.forEach((item) => {
          if (textBlob.includes(item.name.toLowerCase())) {
            next[item.id] = { ...next[item.id], checked: true };
          }
        });
        return next;
      });
      return;
    }

    setDraft((prev) => {
      const next = { ...prev };

      candidates.forEach((candidate) => {
        const target = catalog.find((item) => {
          const itemName = normalizeText(item.name);
          const candidateName = normalizeText(candidate.item);
          return itemName.includes(candidateName) || candidateName.includes(itemName);
        });

        if (!target) return;

        next[target.id] = {
          checked: true,
          quantity: candidate.quantity && candidate.quantity > 0 ? candidate.quantity : 1,
          unitPrice: typeof candidate.price === 'number' && candidate.price > 0 ? candidate.price : Number(target.price),
        };
      });

      return next;
    });
  }, [aiContext, aiPrefill, catalog]);

  function patchDraft(itemId: string, patch: Partial<DraftSelection>) {
    setDraft((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        ...patch,
      },
    }));
  }

  const selectedRows = catalog
    .map((item) => ({ item, state: draft[item.id] }))
    .filter((row) => row.state?.checked);

  const subtotal = selectedRows.reduce((sum, row) => {
    const qty = Number.isFinite(row.state.quantity) ? row.state.quantity : 1;
    const unit = Number.isFinite(row.state.unitPrice) ? row.state.unitPrice : Number(row.item.price);
    return sum + qty * unit;
  }, 0);

  async function sendQuote() {
    if (!businessId || !activeChat || selectedRows.length === 0) return;

    setSending(true);
    setError(null);

    const reference = `Q-${Date.now().toString().slice(-8)}`;
    const shortToken = createShortToken(12);
    const quoteLink = buildPublicLink(`/quote/${shortToken}`);

    const lineItems = selectedRows.map((row) => ({
      catalogItemId: row.item.id,
      item: row.item.name,
      description: row.item.description,
      price: row.state.unitPrice,
      quantity: row.state.quantity,
    }));

    const chatId = isUuid(activeChat.id) ? activeChat.id : null;

    if (!invoiceTableUnavailable) {
      const { error: quoteError } = await supabase.from('inflow_invoices').insert({
        business_id: businessId,
        chat_id: chatId,
        type: 'quote',
        reference,
        customer_name: activeChat.name,
        line_items: lineItems,
        subtotal,
        vat_amount: 0,
        total: subtotal,
        currency: 'ZAR',
        status: 'sent',
      });

      if (quoteError && !isMissingTableError(quoteError, 'inflow_invoices')) {
        setError(quoteError.message);
        setSending(false);
        return;
      }

      if (quoteError && isMissingTableError(quoteError, 'inflow_invoices')) {
        invoiceTableUnavailable = true;
      }
    }

    const messageLines = selectedRows
      .map((row) => `• ${row.item.name} x${row.state.quantity} — R${(row.state.quantity * row.state.unitPrice).toFixed(2)}`)
      .join('\n');

    const body =
      `💼 *Quote ${reference}*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `${messageLines}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Total: R${subtotal.toFixed(2)}\n` +
      `Approve link: ${quoteLink}`;

    await ensureChatExists(activeChat.id, {
      name: activeChat.name,
      lastMessage: body,
    });

    const { error: messageError } = await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender: 'business',
      body,
    });

    if (messageError) {
      setError(messageError.message);
      setSending(false);
      return;
    }

    await supabase
      .from('chats')
      .update({ last_message: `Quote ${reference}: R${subtotal.toFixed(2)}`, updated_at: new Date().toISOString() })
      .eq('id', activeChat.id);

    setShowConfirm(false);
    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Loader2 size={14} className="animate-spin" />
        Loading quote catalog...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex items-center gap-2">
        <Calculator size={16} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-zinc-800">QuoteCraft</h3>
        {Boolean(aiContext || aiPrefill) && (
          <span className="ml-auto text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 font-medium border border-zinc-300">
            AI matched
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {catalog.map((item) => {
          const state = draft[item.id];
          return (
            <div key={item.id} className="border border-zinc-200 bg-white p-3 flex flex-col gap-2">
              <button
                className="flex items-center gap-2 text-left"
                onClick={() => patchDraft(item.id, { checked: !state?.checked })}
              >
                {state?.checked ? <CheckSquare size={16} className="text-amber-600" /> : <Square size={16} className="text-zinc-400" />}
                <span className="text-sm font-medium text-zinc-800">{item.name}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={state?.quantity ?? 1}
                  onChange={(event) => patchDraft(item.id, { quantity: Math.max(1, Number.parseInt(event.target.value || '1', 10)) })}
                  className="bg-white border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={state?.unitPrice ?? Number(item.price)}
                  onChange={(event) => patchDraft(item.id, { unitPrice: Math.max(0, Number.parseFloat(event.target.value || '0')) })}
                  className="bg-white border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500"
                  placeholder="Unit price"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-zinc-200 bg-zinc-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Selected items</span>
          <span className="font-semibold text-zinc-800">{selectedRows.length}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-zinc-500">Total</span>
          <span className="font-semibold text-amber-600">R{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => setShowConfirm(true)}
        disabled={!activeChat || selectedRows.length === 0}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 transition-colors"
      >
        <Send size={14} />
        Review and confirm quote
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {showConfirm && (
        <div className="absolute inset-0 bg-white border border-zinc-200 p-4 flex flex-col gap-3 z-20">
          <h4 className="text-sm font-semibold text-zinc-800">Confirm quote</h4>
          <div className="max-h-56 overflow-y-auto border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 space-y-2">
            {selectedRows.map((row) => (
              <div key={row.item.id} className="flex justify-between gap-3">
                <span>{row.item.name} x{row.state.quantity}</span>
                <span className="font-medium">R{(row.state.quantity * row.state.unitPrice).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold text-zinc-800">
            <span>Total</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 border border-zinc-300 bg-white py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={sendQuote}
              disabled={sending}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 text-sm font-medium disabled:opacity-40 transition-colors"
            >
              {sending ? 'Sending...' : 'Confirm and dispatch'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
