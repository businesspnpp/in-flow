'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { supabase, Chat } from '@/lib/supabase';
import { resolveBusinessId } from '@/lib/inflow-client';
import type { InflowCatalogItem } from '@/lib/inflow-types';

interface MenuDropProps {
  activeChat?: Chat | null;
  aiContext?: unknown;
  aiPrefill?: unknown;
}

type EditableItem = InflowCatalogItem & {
  isDirty?: boolean;
};

function formatPrice(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

export default function MenuDrop({ activeChat: _activeChat }: MenuDropProps) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

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

      setItems((data ?? []) as EditableItem[]);
      setLoading(false);
    }

    loadCatalog();
  }, []);

  const canAdd = useMemo(() => {
    const price = Number.parseFloat(newPrice);
    return newName.trim().length > 0 && Number.isFinite(price) && price >= 0 && Boolean(businessId);
  }, [businessId, newName, newPrice]);

  async function addItem() {
    if (!businessId) return;
    const parsedPrice = Number.parseFloat(newPrice);
    if (!newName.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return;
    }

    setError(null);

    const maxSort = items.reduce((highest, item) => Math.max(highest, item.sort_order), 0);

    const { data, error: insertError } = await supabase
      .from('inflow_items_catalog')
      .insert({
        business_id: businessId,
        kind: 'menu_item',
        name: newName.trim(),
        price: parsedPrice,
        currency: 'ZAR',
        is_active: true,
        sort_order: maxSort + 1,
      })
      .select('*')
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setItems((prev) => [...prev, data as EditableItem]);
    setNewName('');
    setNewPrice('');
  }

  function updateLocalItem(id: string, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, isDirty: true } : item)));
  }

  async function persistItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item || !businessId || !item.isDirty) return;

    const parsedPrice = Number.parseFloat(String(item.price));
    if (!item.name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Item name and price must be valid.');
      return;
    }

    setSavingId(id);
    setError(null);

    const { data, error: updateError } = await supabase
      .from('inflow_items_catalog')
      .update({
        name: item.name.trim(),
        price: parsedPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('business_id', businessId)
      .select('*')
      .single();

    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }

    setItems((prev) => prev.map((entry) => (entry.id === id ? ({ ...(data as EditableItem), isDirty: false }) : entry)));
    setSavingId(null);
  }

  async function removeItem(id: string) {
    if (!businessId) return;
    const snapshot = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setError(null);

    const { error: deleteError } = await supabase
      .from('inflow_items_catalog')
      .delete()
      .eq('id', id)
      .eq('business_id', businessId);

    if (deleteError) {
      setItems(snapshot);
      setError(deleteError.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Loader2 size={14} className="animate-spin" />
        Loading live catalog...
      </div>
    );
  }

  if (!businessId) {
    return <p className="text-xs text-rose-500">Business profile not found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShoppingBag size={16} className="text-rose-600" />
        <h3 className="text-sm font-bold text-zinc-900">Menu Drop</h3>
      </div>

      <div className="rounded-xl border border-zinc-200 p-3 bg-white">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold mb-2">Add New Item</p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2">
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Item Name"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
          />
          <input
            value={newPrice}
            onChange={(event) => setNewPrice(event.target.value)}
            placeholder="Price Value"
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
          />
          <button
            onClick={addItem}
            disabled={!canAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-700"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 max-h-72 overflow-y-auto divide-y divide-zinc-100">
        {items.length === 0 && (
          <div className="p-4 text-xs text-zinc-500">No catalog items yet. Add your first item above.</div>
        )}

        {items.map((item) => (
          <div key={item.id} className="p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={item.name}
              onChange={(event) => updateLocalItem(item.id, { name: event.target.value })}
              onBlur={() => persistItem(item.id)}
              className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">R</span>
              <input
                value={formatPrice(Number(item.price))}
                type="number"
                min="0"
                step="0.01"
                onChange={(event) => updateLocalItem(item.id, { price: Number.parseFloat(event.target.value || '0') })}
                onBlur={() => persistItem(item.id)}
                className="w-28 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
              />

              <button
                onClick={() => removeItem(item.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                title="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {savingId === item.id && (
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Loader2 size={11} className="animate-spin" />
                Saving
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
