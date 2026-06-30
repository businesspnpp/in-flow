'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/supabase';
import LinkAppsTool from '@/components/LinkAppsTool';

export default function LinkAppsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('businesses').select('*').single()
      .then(({ data }) => {
        if (data) setBusiness(data as Business);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50">
        <div className="px-4 py-6 md:py-8 md:px-6 max-w-6xl mx-auto w-full">
          <p className="text-sm text-zinc-500 animate-pulse">Loading business profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50">
      <div className="px-4 py-6 md:py-8 md:px-6 max-w-6xl mx-auto w-full">
        <div className="md:flex md:gap-8 w-full">
          <aside className="md:w-64 flex flex-col gap-2 text-zinc-500 mb-5 md:mb-0">
            {['Business Info', 'Connected Channels', 'Billing', 'Team Security'].map((item, index) => (
              <button
                key={item}
                className={`w-full text-left px-3 py-2.5 text-sm border transition ${
                  index === 1
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-900'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
                }`}
              >
                {item}
              </button>
            ))}
          </aside>
          <section className="flex-1 bg-white border border-zinc-200 p-4 md:p-8 min-w-0">
            {business ? (
              <LinkAppsTool business={business} onUpdated={updated => setBusiness(updated)} />
            ) : (
              <p className="text-sm text-zinc-500">No business profile found. Complete onboarding to connect your channels.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
