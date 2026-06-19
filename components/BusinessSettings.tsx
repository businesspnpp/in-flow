'use client';

import { useEffect, useState } from 'react';
import { supabase, Business } from '@/lib/supabase';

interface Props {
  business: Business;
  onUpdated: (b: Business) => void;
}

function normalizeWhatsAppNumber(value: string) {
  const cleaned = value.replace(/[^\d+]/g, '').replace(/\D/g, '');
  if (!cleaned) return '';
  return `+${cleaned}`;
}

export default function BusinessSettings({ business, onUpdated }: Props) {
  const [number, setNumber] = useState(business.whatsapp_number ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setNumber(business.whatsapp_number ?? '');
  }, [business.whatsapp_number]);

  async function handleSave() {
    setError('');
    setSuccess('');
    const normalized = normalizeWhatsAppNumber(number);
    if (!normalized) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading(true);
    const { data, error: updateError } = await supabase
      .from('businesses')
      .update({ whatsapp_number: normalized, updated_at: new Date().toISOString() })
      .eq('id', business.id)
      .select()
      .single();
    setLoading(false);
    if (updateError) {
      setError('Failed to save number.');
      console.error(updateError);
      return;
    }
    setSuccess('WhatsApp number saved. Messages from this number will be managed through inFlow.');
    onUpdated(data as Business);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">WhatsApp connection</h3>
      <p className="text-sm text-[#9090a8]">
        Enter your WhatsApp Business number. We'll manage incoming messages and auto-replies through inFlow using your business profile.
      </p>

      <label className="text-sm text-[#e8e8f0] block">
        WhatsApp Business number
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+15551234567" className="w-full mt-2 rounded-lg px-3 py-2 bg-[#12121b] text-white outline-none" />
      </label>

      {business.whatsapp_number && (
        <p className="text-xs text-[#9090a8]">Currently saved: {business.whatsapp_number}</p>
      )}

      {error && <p className="text-sm text-[#ff6b6b]">{error}</p>}
      {success && <p className="text-sm text-[#7be495]">{success}</p>}

      <button onClick={handleSave} disabled={loading} className="rounded-2xl bg-[#6c63ff] px-4 py-2 text-white hover:bg-[#7c73ff] disabled:opacity-50">
        {loading ? 'Saving...' : 'Save WhatsApp number'}
      </button>

      <div className="rounded-xl border border-[#1f1f2e] bg-[#0f0f16] p-4">
        <p className="text-xs font-medium text-white">How it works</p>
        <ul className="mt-2 space-y-2 text-sm text-[#e8e8f0] list-disc list-inside">
          <li>Enter your WhatsApp Business phone number.</li>
          <li>Customers can message you on that number.</li>
          <li>All conversations appear here and you can manage them from inFlow.</li>
        </ul>
      </div>
    </div>
  );
}
