// MenuDrop.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { supabase, Chat } from "@/lib/supabase";
import { resolveBusinessId } from "@/lib/inflow-client";
import type { InflowCatalogItem } from "@/lib/inflow-types";
interface MenuDropProps {
  activeChat?: Chat | null;
  aiContext?: unknown;
  aiPrefill?: unknown;
}
type EditableItem = InflowCatalogItem & { isDirty?: boolean };
function formatPrice(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}
export default function MenuDrop({ activeChat: _activeChat }: MenuDropProps) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
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
      setItems((data ?? []) as EditableItem[]);
      setLoading(false);
    }
    loadCatalog();
  }, []);
  const canAdd = useMemo(() => {
    const price = Number.parseFloat(newPrice);
    return (
      newName.trim().length > 0 &&
      Number.isFinite(price) &&
      price >= 0 &&
      Boolean(businessId)
    );
  }, [businessId, newName, newPrice]);
  async function addItem() {
    if (!businessId) return;
    const parsedPrice = Number.parseFloat(newPrice);
    if (!newName.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0)
      return;
    setError(null);
    const maxSort = items.reduce((h, item) => Math.max(h, item.sort_order), 0);
    const { data, error: insertError } = await supabase
      .from("inflow_items_catalog")
      .insert({
        business_id: businessId,
        kind: "menu_item",
        name: newName.trim(),
        price: parsedPrice,
        currency: "ZAR",
        is_active: true,
        sort_order: maxSort + 1,
      })
      .select("*")
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setItems((prev) => [...prev, data as EditableItem]);
    setNewName("");
    setNewPrice("");
  }
  function updateLocalItem(id: string, patch: Partial<EditableItem>) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...patch, isDirty: true } : item,
      ),
    );
  }
  async function persistItem(id: string) {
    const item = items.find((e) => e.id === id);
    if (!item || !businessId || !item.isDirty) return;
    const parsedPrice = Number.parseFloat(String(item.price));
    if (!item.name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Item name and price must be valid.");
      return;
    }
    setSavingId(id);
    setError(null);
    const { data, error: updateError } = await supabase
      .from("inflow_items_catalog")
      .update({
        name: item.name.trim(),
        price: parsedPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("business_id", businessId)
      .select("*")
      .single();
    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }
    setItems((prev) =>
      prev.map((e) =>
        e.id === id ? { ...(data as EditableItem), isDirty: false } : e,
      ),
    );
    setSavingId(null);
  }
  async function removeItem(id: string) {
    if (!businessId) return;
    const snapshot = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setError(null);
    const { error: deleteError } = await supabase
      .from("inflow_items_catalog")
      .delete()
      .eq("id", id)
      .eq("business_id", businessId);
    if (deleteError) {
      setItems(snapshot);
      setError(deleteError.message);
    }
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
  if (!businessId)
    return <p className="text-xs text-red-600">Business profile not found.</p>;
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <ShoppingBag
          size={15}
          className="text-red-600"
          strokeWidth={2.25}
        />{" "}
        <h3 className="text-sm font-semibold text-zinc-900">Menu Drop</h3>{" "}
      </div>{" "}
      {/* Add item */}{" "}
      <div className="border border-zinc-200 bg-zinc-50 p-5">
        {" "}
        <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-semibold mb-2">
          Add item
        </p>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2">
          {" "}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Item name"
            className="border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500"
          />{" "}
          <input
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            className="border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500"
          />{" "}
          <button
            onClick={addItem}
            disabled={!canAdd}
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
          >
            {" "}
            <Plus size={13} strokeWidth={2.25} /> Add{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Item list */}{" "}
      <div className="border border-zinc-200 bg-white max-h-72 overflow-y-auto divide-y divide-zinc-100">
        {" "}
        {items.length === 0 && (
          <div className="p-5 text-xs text-zinc-500">No catalog items yet.</div>
        )}{" "}
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            {" "}
            <input
              value={item.name}
              onChange={(e) =>
                updateLocalItem(item.id, { name: e.target.value })
              }
              onBlur={() => persistItem(item.id)}
              className="flex-1 border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
            />{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-xs text-zinc-500">R</span>{" "}
              <input
                value={formatPrice(Number(item.price))}
                type="number"
                min="0"
                step="0.01"
                onChange={(e) =>
                  updateLocalItem(item.id, {
                    price: Number.parseFloat(e.target.value || "0"),
                  })
                }
                onBlur={() => persistItem(item.id)}
                className="w-24 border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
              />{" "}
              <button
                onClick={() => removeItem(item.id)}
                className="inline-flex h-8 w-8 items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title="Remove item"
              >
                {" "}
                <Trash2 size={13} strokeWidth={2.25} />{" "}
              </button>{" "}
            </div>{" "}
            {savingId === item.id && (
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                {" "}
                <Loader2
                  size={11}
                  className="animate-spin"
                  strokeWidth={2.25}
                />{" "}
                Saving{" "}
              </div>
            )}{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {error && <p className="text-xs text-red-600">{error}</p>}{" "}
    </div>
  );
}
