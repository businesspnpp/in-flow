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
      <div className="flex-1 bg-zinc-50 flex items-center justify-center min-h-screen w-full">
        <p className="text-sm text-zinc-500 animate-pulse font-medium">Loading workspace profile…</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex-1 bg-zinc-50 p-8 flex items-center justify-center min-h-screen w-full">
        <div className="bg-white border border-zinc-200 p-6 max-w-md text-center shadow-sm">
          <p className="text-sm font-semibold text-zinc-900 mb-1">No Profile Context Found</p>
          <p className="text-xs text-zinc-500">Please complete your base organization onboarding settings before configuring channel streams.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 flex flex-col min-w-0 w-full min-h-screen">
      {/* 
        The left side menu is removed entirely. 
        The component now renders full-bleed without max-width or nested card wrapping layouts.
      */}
      <main className="flex-1 min-w-0 w-full">
        <LinkAppsTool business={business} onUpdated={updated => setBusiness(updated)} />
      </main>
    </div>
  );
}
