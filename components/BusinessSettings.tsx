'use client';

import { useEffect, useState } from 'react';
import { supabase, Business } from '@/lib/supabase';

interface Props {
  business: Business;
  onUpdated: (b: Business) => void;
}

function normalizeWhatsAppNumber(value: string) {
  const cleaned = value.replace(/[^^\d+]/g, '').replace(/\D/g, '');
  if (!cleaned) return '';
  return `+${cleaned}`;
}

export default function BusinessSettings({ business, onUpdated }: Props) {
  const [number, setNumber] = useState(business.whatsapp_number ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [apiErrorDetails, setApiErrorDetails] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    business.whatsapp_verified ? 'Connected' : business.whatsapp_number ? 'Pending authorization' : 'Not linked'
  );

  useEffect(() => {
    setNumber(business.whatsapp_number ?? '');
    setConnectionStatus(
      business.whatsapp_verified ? 'Connected' : business.whatsapp_number ? 'Pending authorization' : 'Not linked'
    );
  }, [business.whatsapp_number, business.whatsapp_verified]);

  async function handleLink() {
    setError('');
    setSuccess('');
    const normalized = normalizeWhatsAppNumber(number);
    if (!normalized) {
      setError('Enter a phone number');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .update({ whatsapp_number: normalized, updated_at: new Date().toISOString() })
      .eq('id', business.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError('Failed to link number.');
      console.error(error);
      return;
    }
    setSuccess('Number linked');
    setConnectionStatus('Pending authorization');
    onUpdated(data as Business);
  }

  async function handleVerify() {
    setError('');
    setSuccess('');
    if (!business.whatsapp_number) {
      setError('Link your WhatsApp number first.');
      return;
    }

    const normalized = normalizeWhatsAppNumber(business.whatsapp_number);
    if (!normalized) {
      setError('Enter a valid phone number');
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_number: normalized, business_id: business.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        const detailMessage = json?.details?.error?.message || json?.details?.message || json?.error;
        const isNotAllowed = detailMessage?.toString().includes('allowed list') || detailMessage?.toString().includes('Recipient phone number not in allowed list');
        if (isNotAllowed) {
          setError(
            'This number is not yet authorized for WhatsApp API messaging. Please make sure the business number is connected to WhatsApp API or approved by Meta before retrying.'
          );
        } else {
          setError(json?.error || 'Authorization failed');
        }
        setApiErrorDetails(json?.details ? JSON.stringify(json.details, null, 2) : null);
        return;
      }
      setSuccess('Authorization code sent — check WhatsApp for the message.');
      setApiErrorDetails(null);
    } catch (e) {
      console.error(e);
      setError('Authorization request failed.');
      setApiErrorDetails(String(e));
    } finally {
      setVerifying(false);
    }
  }

  async function handleConfirm() {
    setError('');
    setSuccess('');
    if (!codeInput) {
      setError('Enter the verification code');
      return;
    }
    setConfirming(true);
    try {
      const res = await fetch('/api/whatsapp/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: business.id, code: codeInput }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Confirmation failed');
      } else {
        setSuccess('Number verified and linked.');
        setConnectionStatus('Connected');
        onUpdated(json.business as Business);
      }
    } catch (e) {
      console.error(e);
      setError('Confirmation request failed.');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">WhatsApp connection</h3>
      <p className="text-sm text-[#9090a8]">
        Enter your WhatsApp Business number below to link your account to inFlow. Once linked, we can receive messages and send replies from your business profile.
      </p>

      <label className="text-sm text-[#e8e8f0] block">
        WhatsApp Business number
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+15551234567" className="w-full mt-2 rounded-lg px-3 py-2 bg-[#12121b] text-white outline-none" />
      </label>
      {business.whatsapp_number && (
        <div className="space-y-1">
          <p className="text-xs text-[#9090a8]">Currently linked: {business.whatsapp_number}</p>
          <p className="text-xs text-[#7be495]">Status: {connectionStatus}</p>
        </div>
      )}
      {error && <p className="text-sm text-[#ff6b6b]">{error}</p>}
      {success && <p className="text-sm text-[#7be495]">{success}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={handleLink} disabled={loading} className="rounded-2xl bg-[#6c63ff] px-4 py-2 text-white">Link WhatsApp number</button>
          <button onClick={handleVerify} disabled={verifying || !business.whatsapp_number} className="rounded-2xl border border-[#2a2a3a] px-4 py-2 text-white">Send authorization code</button>
      </div>

      <div className="rounded-xl border border-[#1f1f2e] bg-[#0f0f16] p-4">
        <p className="text-xs text-[#9090a8]">How this works</p>
        <ul className="mt-2 space-y-2 text-sm text-[#e8e8f0] list-disc list-inside">
          <li>Enter your WhatsApp Business number.</li>
          <li>Click “Link WhatsApp number” to save it to your platform profile.</li>
          <li>Click “Send authorization code” to confirm the connection.</li>
        </ul>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm text-[#e8e8f0] block">
          Authorization code
          <input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="123456" className="w-full mt-2 rounded-lg px-3 py-2 bg-[#12121b] text-white outline-none" />
        </label>
        <div className="flex gap-2">
          <button onClick={handleConfirm} disabled={confirming} className="rounded-2xl bg-[#4ade80] px-4 py-2 text-black">Confirm code</button>
        </div>
      </div>
      {apiErrorDetails && (
        <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-[#0b0b0f] p-3 text-xs text-[#ffb4b4]">
          {apiErrorDetails}
        </pre>
      )}
    </div>
  );
}
