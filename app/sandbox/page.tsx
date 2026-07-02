'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SandboxPage() {
  const router = useRouter();

  useEffect(() => {
    // Sandbox can provide lightweight walkthrough; allow quick jump to dashboard
    // noop for now
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="if-card max-w-2xl p-6">
        <h1 className="text-xl font-semibold mb-2">Meta Review Sandbox</h1>
        <p className="text-sm text-zinc-600 mb-4">This sandbox bypasses verification for Meta reviewers when NEXT_PUBLIC_META_REVIEW_MODE is true.</p>
        <div className="flex gap-2">
          <button
            className="if-btn-primary px-4 py-2 text-sm font-semibold"
            onClick={() => router.push('/dashboard')}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
