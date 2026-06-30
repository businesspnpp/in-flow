'use client';

import { useEffect, useState } from 'react';
import { useDashboardHeader } from '@/components/dashboard/DashboardHeaderContext';

export default function DashboardSettingsPage() {
  const { setHeaderConfig, clearHeaderConfig } = useDashboardHeader();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHeaderConfig({
      title: 'Settings',
      subtitle: 'Manage profile, team, and workspace preferences.',
      showSearch: false,
      actions: (
        <button
          type="button"
          onClick={() => setHasUnsavedChanges(false)}
          disabled={!hasUnsavedChanges}
          className="h-10 border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Changes
        </button>
      ),
    });

    return () => clearHeaderConfig();
  }, [clearHeaderConfig, hasUnsavedChanges, setHeaderConfig]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
      <div className="if-card-soft p-5">
      <p className="text-base font-semibold text-zinc-900">Account and profile configurations</p>
      <p className="text-sm text-zinc-500 mt-2">
        Manage profile details, password, notification preferences, and team access from this settings page.
      </p>

      <div className="mt-4 flex items-center gap-2">
        <input
          id="settings-notification-toggle"
          type="checkbox"
          checked={hasUnsavedChanges}
          onChange={(event) => setHasUnsavedChanges(event.target.checked)}
          className="h-4 w-4 border-zinc-300 text-[#FB5801] focus:ring-[#FB5801]"
        />
        <label htmlFor="settings-notification-toggle" className="text-sm text-zinc-700">
          Mark notification preference as changed (demo for global Save Changes action)
        </label>
      </div>
      </div>
    </div>
  );
}
