'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDashboardHeader } from '@/components/dashboard/DashboardHeaderContext';
import { supabase } from '@/lib/supabase';

type SettingsProfile = {
  business_name: string;
  owner_name: string;
  email: string;
  address: string;
  whatsapp_number: string;
  categories: string;
  timezone: string;
  currency: string;
  booking_buffer_minutes: number;
};

const initialProfile: SettingsProfile = {
  business_name: '',
  owner_name: '',
  email: '',
  address: '',
  whatsapp_number: '',
  categories: '',
  timezone: 'Africa/Johannesburg',
  currency: 'ZAR',
  booking_buffer_minutes: 15,
};

export default function SettingsContent() {
  const { setHeaderConfig, clearHeaderConfig } = useDashboardHeader();

  const [profile, setProfile] = useState<SettingsProfile>(initialProfile);
  const [originalProfile, setOriginalProfile] = useState<SettingsProfile>(initialProfile);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(originalProfile),
    [originalProfile, profile]
  );

  const loadBusinessProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Unable to load account session. Please sign in again.');
        return;
      }

      const { data, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();

      if (businessError || !data) {
        setError('No business profile was found for this account.');
        return;
      }

      const mapped: SettingsProfile = {
        business_name: data.business_name ?? '',
        owner_name: data.owner_name ?? '',
        email: data.email ?? '',
        address: data.address ?? '',
        whatsapp_number: data.whatsapp_number ?? '',
        categories: Array.isArray(data.categories) ? data.categories.join(', ') : '',
        timezone: data.timezone ?? 'Africa/Johannesburg',
        currency: data.currency ?? 'ZAR',
        booking_buffer_minutes: Number(data.booking_buffer_minutes ?? 15),
      };

      setBusinessId(data.id);
      setProfile(mapped);
      setOriginalProfile(mapped);
    } catch {
      setError('Unexpected error while loading business settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!businessId) {
      setError('Business profile is not loaded yet.');
      return;
    }

    setSaving(true);
    setError('');
    setStatusMessage('');

    const categoriesArray = profile.categories
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!profile.business_name.trim()) {
      setSaving(false);
      setError('Business name is required.');
      return;
    }

    if (!profile.email.trim()) {
      setSaving(false);
      setError('Email is required.');
      return;
    }

    if (categoriesArray.length === 0) {
      setSaving(false);
      setError('Please provide at least one category.');
      return;
    }

    const payload = {
      business_name: profile.business_name.trim(),
      owner_name: profile.owner_name.trim() || null,
      email: profile.email.trim(),
      address: profile.address.trim(),
      whatsapp_number: profile.whatsapp_number.trim(),
      categories: categoriesArray,
      timezone: profile.timezone,
      currency: profile.currency,
      booking_buffer_minutes: Number(profile.booking_buffer_minutes || 15),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateError } = await supabase
        .from('businesses')
        .update(payload)
        .eq('id', businessId);

      if (updateError) {
        setError(`Unable to save settings: ${updateError.message}`);
        return;
      }

      const next = {
        ...profile,
        categories: categoriesArray.join(', '),
      };
      setProfile(next);
      setOriginalProfile(next);
      setStatusMessage('Settings saved successfully.');
    } catch {
      setError('Unexpected error while saving settings.');
    } finally {
      setSaving(false);
    }
  }, [businessId, profile]);

  useEffect(() => {
    loadBusinessProfile();
  }, [loadBusinessProfile]);

  useEffect(() => {
    setHeaderConfig({
      title: 'Settings',
      subtitle: 'Manage profile, team, and workspace preferences.',
      showSearch: false,
      actions: (
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || saving || !hasUnsavedChanges}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      ),
    });

    return () => clearHeaderConfig();
  }, [clearHeaderConfig, handleSave, hasUnsavedChanges, loading, saving, setHeaderConfig]);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-6">
        <h2 className="text-base font-semibold text-zinc-900">Business Profile</h2>
        <p className="mt-1 text-sm text-zinc-500">These values are loaded from your Supabase businesses table.</p>

        {loading ? (
          <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">Loading business settings...</div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Business name</span>
              <input
                value={profile.business_name}
                onChange={(event) => setProfile((prev) => ({ ...prev, business_name: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Owner name</span>
              <input
                value={profile.owner_name}
                onChange={(event) => setProfile((prev) => ({ ...prev, owner_name: event.target.value }))}
                placeholder="e.g. Lindiwe Khumalo"
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">WhatsApp number</span>
              <input
                value={profile.whatsapp_number}
                onChange={(event) => setProfile((prev) => ({ ...prev, whatsapp_number: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Address</span>
              <input
                value={profile.address}
                onChange={(event) => setProfile((prev) => ({ ...prev, address: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categories (comma separated)</span>
              <input
                value={profile.categories}
                onChange={(event) => setProfile((prev) => ({ ...prev, categories: event.target.value }))}
                placeholder="Retail, Beauty"
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timezone</span>
              <select
                value={profile.timezone}
                onChange={(event) => setProfile((prev) => ({ ...prev, timezone: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              >
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Currency</span>
              <select
                value={profile.currency}
                onChange={(event) => setProfile((prev) => ({ ...prev, currency: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              >
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Booking buffer (minutes)</span>
              <input
                type="number"
                min={0}
                step={5}
                value={profile.booking_buffer_minutes}
                onChange={(event) => setProfile((prev) => ({ ...prev, booking_buffer_minutes: Number(event.target.value || 0) }))}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {statusMessage && <p className="mt-4 rounded-lg border border-[#66dba3]/30 bg-[#66dba3]/10 px-3 py-2 text-sm text-[#2ea66f]">{statusMessage}</p>}
      </div>
    </div>
  );
}
