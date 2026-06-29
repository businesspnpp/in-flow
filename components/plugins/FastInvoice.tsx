"use client";
import { useState, useEffect } from "react";
import { CheckSquare, FileText, Loader2, Send, Square } from "lucide-react";
import { supabase, Chat } from "@/lib/supabase";
import {
  buildPublicLink,
  createShortToken,
  ensureChatExists,
  isMissingTableError,
  isUuid,
  resolveBusinessId,
} from "@/lib/inflow-client";
import type { InflowCatalogItem } from "@/lib/inflow-types";
interface AiCandidateItem {
  item: string;
  quantity?: number;
  price?: number;
}
interface FastInvoiceProps {
  activeChat: Chat | null;
  aiContext?: unknown;
  aiPrefill?: unknown;
}
type DraftSelection = { checked: boolean; quantity: number; unitPrice: number };
let invoiceTableUnavailable = false;
function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
function parseAiCandidates(payload: unknown): AiCandidateItem[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const output: AiCandidateItem[] = [];
  const extraction = root.extraction as Record<string, unknown> | undefined;
  const invoiceDetails = extraction?.invoiceDetails as
    Record<string, unknown> | undefined;
  const lineItems = invoiceDetails?.lineItems;
  if (Array.isArray(lineItems)) {
    lineItems.forEach((entry) => {
      if (!entry || typeof entry !== "object") return;
      const row = entry as Record<string, unknown>;
      if (typeof row.item !== "string") return;
      output.push({
        item: row.item,
        quantity: typeof row.quantity === "number" ? row.quantity : 1,
        price: typeof row.price === "number" ? row.price : undefined,
      });
    });
  }
  const prefill = root.prefill as Record<string, unknown> | undefined;
  const selectedItems = prefill?.selectedItems;
  if (Array.isArray(selectedItems)) {
    selectedItems.forEach((entry) => {
      if (!entry || typeof entry !== "object") return;
      const row = entry as Record<string, unknown>;
      if (typeof row.item !== "string") return;
      output.push({
        item: row.item,
        quantity: typeof row.quantity === "number" ? row.quantity : 1,
        price: typeof row.price === "number" ? row.price : undefined,
      });
    });
  }
  return output;
}
export default function FastInvoice({
  activeChat,
  aiContext,
  aiPrefill,
}: FastInvoiceProps) {
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
        setError("Unable to resolve business profile.");
        setLoading(false);
        return;
      }
      setBusinessId(id);
      const { data, error: catalogError } = await supabase
        .from("inflow_items_catalog")
        .select("*")
        .eq("business_id", id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
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
          if (textBlob.includes(item.name.toLowerCase()))
            next[item.id] = { ...next[item.id], checked: true };
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
          return (
            itemName.includes(candidateName) || candidateName.includes(itemName)
          );
        });
        if (!target) return;
        next[target.id] = {
          checked: true,
          quantity:
            candidate.quantity && candidate.quantity > 0
              ? candidate.quantity
              : 1,
          unitPrice:
            typeof candidate.price === "number" && candidate.price > 0
              ? candidate.price
              : Number(target.price),
        };
      });
      return next;
    });
  }, [aiContext, aiPrefill, catalog]);
  function patchDraft(itemId: string, patch: Partial<DraftSelection>) {
    setDraft((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }));
  }
  const selectedRows = catalog
    .map((item) => ({ item, state: draft[item.id] }))
    .filter((row) => row.state?.checked);
  const subtotal = selectedRows.reduce((sum, row) => {
    const qty = Number.isFinite(row.state.quantity) ? row.state.quantity : 1;
    const unit = Number.isFinite(row.state.unitPrice)
      ? row.state.unitPrice
      : Number(row.item.price);
    return sum + qty * unit;
  }, 0);
  async function sendInvoice() {
    if (!businessId || !activeChat || selectedRows.length === 0) return;
    setSending(true);
    setError(null);
    const reference = `INV-${Date.now().toString().slice(-8)}`;
    const shortToken = createShortToken(12);
    const invoiceLink = buildPublicLink(`/pay/${shortToken}`);
    const lineItems = selectedRows.map((row) => ({
      catalogItemId: row.item.id,
      item: row.item.name,
      description: row.item.description,
      price: row.state.unitPrice,
      quantity: row.state.quantity,
    }));
    const chatId = isUuid(activeChat.id) ? activeChat.id : null;
    if (!invoiceTableUnavailable) {
      const { error: insertInvoiceError } = await supabase
        .from("inflow_invoices")
        .insert({
          business_id: businessId,
          chat_id: chatId,
          type: "invoice",
          reference,
          customer_name: activeChat.name,
          line_items: lineItems,
          subtotal,
          vat_amount: 0,
          total: subtotal,
          currency: "ZAR",
          status: "sent",
        });
      if (
        insertInvoiceError &&
        !isMissingTableError(insertInvoiceError, "inflow_invoices")
      ) {
        setError(insertInvoiceError.message);
        setSending(false);
        return;
      }
      if (
        insertInvoiceError &&
        isMissingTableError(insertInvoiceError, "inflow_invoices")
      )
        invoiceTableUnavailable = true;
    }
    const messageLines = selectedRows
      .map(
        (row) =>
          `• ${row.item.name} x${row.state.quantity} — R${(row.state.quantity * row.state.unitPrice).toFixed(2)}`,
      )
      .join("\n");
    const invoiceText = `📄 *Invoice ${reference}*\n━━━━━━━━━━━━━━━━━\n${messageLines}\n━━━━━━━━━━━━━━━━━\nTotal: R${subtotal.toFixed(2)}\nPay now: ${invoiceLink}`;
    await ensureChatExists(activeChat.id, {
      name: activeChat.name,
      lastMessage: invoiceText,
    });
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        chat_id: activeChat.id,
        sender: "business",
        body: invoiceText,
      });
    if (messageError) {
      setError(messageError.message);
      setSending(false);
      return;
    }
    await supabase
      .from("chats")
      .update({
        last_message: `Invoice ${reference}: R${subtotal.toFixed(2)}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeChat.id);
    setShowConfirm(false);
    setSending(false);
  }
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {" "}
        <Loader2 size={13} className="animate-spin" strokeWidth={2.25} />{" "}
        Loading catalog...{" "}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 relative">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <FileText
          size={15}
          className="text-amber-600"
          strokeWidth={2.25}
        />{" "}
        <h3 className="text-sm font-semibold text-zinc-900">Fast Invoice</h3>{" "}
        {Boolean(aiContext || aiPrefill) && (
          <span className="ml-auto text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 font-semibold border border-zinc-300">
            {" "}
            AI matched{" "}
          </span>
        )}{" "}
      </div>{" "}
      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">
          Select a chat to send an invoice
        </p>
      )}{" "}
      {catalog.length === 0 && (
        <p className="text-xs text-zinc-500">
          No active catalog items. Add items in Menu Drop first.
        </p>
      )}{" "}
      {catalog.length > 0 && (
        <div className="flex flex-col gap-2">
          {" "}
          {catalog.map((item) => {
            const state = draft[item.id];
            return (
              <div
                key={item.id}
                className="border border-zinc-200 bg-white p-5 flex flex-col gap-2"
              >
                {" "}
                <button
                  className="flex items-center gap-2 text-left"
                  onClick={() =>
                    patchDraft(item.id, { checked: !state?.checked })
                  }
                >
                  {" "}
                  {state?.checked ? (
                    <CheckSquare
                      size={15}
                      className="text-amber-600 flex-shrink-0"
                      strokeWidth={2.25}
                    />
                  ) : (
                    <Square
                      size={15}
                      className="text-zinc-500 flex-shrink-0"
                      strokeWidth={2.25}
                    />
                  )}{" "}
                  <span className="text-sm text-zinc-900">
                    {item.name}
                  </span>{" "}
                </button>{" "}
                <div className="grid grid-cols-2 gap-2">
                  {" "}
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={state?.quantity ?? 1}
                    onChange={(e) =>
                      patchDraft(item.id, {
                        quantity: Math.max(
                          1,
                          Number.parseInt(e.target.value || "1", 10),
                        ),
                      })
                    }
                    className="border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                    placeholder="Qty"
                  />{" "}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={state?.unitPrice ?? Number(item.price)}
                    onChange={(e) =>
                      patchDraft(item.id, {
                        unitPrice: Math.max(
                          0,
                          Number.parseFloat(e.target.value || "0"),
                        ),
                      })
                    }
                    className="border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                    placeholder="Unit price"
                  />{" "}
                </div>{" "}
              </div>
            );
          })}{" "}
        </div>
      )}{" "}
      {/* Summary */}{" "}
      <div className="border border-zinc-200 bg-zinc-50 p-5 text-sm">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <span className="text-zinc-500">Selected</span>{" "}
          <span className="font-semibold text-zinc-900">
            {selectedRows.length} item{selectedRows.length !== 1 ? "s" : ""}
          </span>{" "}
        </div>{" "}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-zinc-200">
          {" "}
          <span className="text-zinc-500">Total</span>{" "}
          <span className="font-semibold text-zinc-900">
            R{subtotal.toFixed(2)}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={!activeChat || selectedRows.length === 0}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5.5 transition-colors"
      >
        {" "}
        <Send size={13} strokeWidth={2.25} /> Review & Send Invoice{" "}
      </button>{" "}
      {error && <p className="text-xs text-red-600">{error}</p>}{" "}
      {/* Confirm overlay */}{" "}
      {showConfirm && (
        <div className="absolute inset-0 bg-white border border-zinc-200 p-5 flex flex-col gap-3 z-20">
          {" "}
          <h4 className="text-sm font-semibold text-zinc-900">
            Confirm invoice
          </h4>{" "}
          <div className="max-h-56 overflow-y-auto border border-zinc-200 bg-zinc-50 p-5 text-xs text-zinc-900 space-y-2">
            {" "}
            {selectedRows.map((row) => (
              <div key={row.item.id} className="flex justify-between gap-3">
                {" "}
                <span>
                  {row.item.name} ×{row.state.quantity}
                </span>{" "}
                <span className="font-semibold">
                  R{(row.state.quantity * row.state.unitPrice).toFixed(2)}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
          <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-1 border-t border-zinc-200">
            {" "}
            <span>Total</span> <span>R{subtotal.toFixed(2)}</span>{" "}
          </div>{" "}
          <div className="flex gap-2 mt-auto">
            {" "}
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 border border-zinc-300 py-2.5 text-sm text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              {" "}
              Back{" "}
            </button>{" "}
            <button
              onClick={sendInvoice}
              disabled={sending}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-sm font-semibold disabled:opacity-40 transition-colors"
            >
              {" "}
              {sending ? "Sending..." : "Confirm & Send"}{" "}
            </button>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
