'use client';

import { useState } from 'react';
import { supabase, Business } from '@/lib/supabase';

const CATEGORY_OPTIONS = [
  'Retail', 'Food', 'Services', 'Beauty',
  'Health', 'Education', 'Wellness', 'Other',
] as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface BusinessOnboardingProps {
  onCompleted: (business: Business) => void;
}

export default function BusinessOnboarding({ onCompleted }: BusinessOnboardingProps) {
  const [businessName, setBusinessName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(i => i !== category));
      setError('');
      return;
    }
    if (selectedCategories.length >= 2) {
      setError('You can choose up to 2 categories.');
      return;
    }
    setSelectedCategories(prev => [...prev, category]);
    setError('');
  }

  function validate() {
    if (!businessName.trim()) { setError('Business name is required.'); return false; }
    if (selectedCategories.length === 0) { setError('Select at least one category.'); return false; }
    if (!address.trim()) { setError('Address is required.'); return false; }
    if (!emailRegex.test(email)) { setError('Enter a valid email address.'); return false; }
    setError('');
    return true;
  }

  async function handleCreateAccount() {
    if (!validate()) return;
    setSaving(true);
    setError('');

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Authentication session missing. Please log in again.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('businesses')
        .insert([{
          id: user.id,
          business_name: businessName.trim(),
          categories: selectedCategories,
          address: address.trim(),
          email: email.trim(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError || !data) {
        if (insertError?.code === '23505') {
          setError('A business profile already exists for this account.');
        } else {
          setError('Unable to save profile right now. Please try again.');
        }
        return;
      }

      // Seed channel_configs rows for all channels
      const channels = ['whatsapp', 'instagram', 'facebook', 'sms'];
      await supabase.from('channel_configs').insert(
        channels.map(channel => ({
          business_id: user.id,
          channel,
          status: 'not_connected',
        }))
      );

      onCompleted(data as Business);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold">Welcome to inFlow</p>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900">Set up your business account</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Create your business profile. You will link your communication channels inside the main dashboard.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-700 font-medium">
              <span>Business name</span>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Sunrise Salon"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-700 font-medium">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@business.com"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-zinc-700 font-medium">
            <span>Address</span>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Business Avenue, City"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900">Categories</p>
                <p className="text-xs text-zinc-500">Select up to 2 categories that match your business.</p>
              </div>
              <span className="text-xs text-amber-600 font-medium">{selectedCategories.length}/2 selected</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORY_OPTIONS.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200 ${
                    selectedCategories.includes(category)
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={handleCreateAccount}
              disabled={saving}
              className="rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
            >
              {saving ? 'Creating profile...' : 'Finish setup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
