'use client';

import { useEffect, useState } from 'react';
import { useDashboardHeader } from '@/components/dashboard/DashboardHeaderContext';

export default function SettingsContent() {
  const { setHeaderConfig, clearHeaderConfig } = useDashboardHeader();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'Dock Studio HQ',
    ownerName: 'Lindiwe Khumalo',
    email: 'ops@dock.app',
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
    bookingBuffer: '15 min',
  });
  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    paymentAlerts: true,
    weeklyDigest: false,
    outageAlerts: true,
  });

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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="text-base font-semibold text-zinc-900">Business Profile</h2>
          <p className="mt-1 text-sm text-zinc-500">Update workspace identity and default operational settings.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Business name</span>
              <input
                value={profile.businessName}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, businessName: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Owner name</span>
              <input
                value={profile.ownerName}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, ownerName: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Support email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, email: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timezone</span>
              <select
                value={profile.timezone}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, timezone: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              >
                <option>Africa/Johannesburg</option>
                <option>UTC</option>
                <option>Europe/London</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Currency</span>
              <select
                value={profile.currency}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, currency: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              >
                <option>ZAR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Booking buffer</span>
              <select
                value={profile.bookingBuffer}
                onChange={(event) => {
                  setProfile((prev) => ({ ...prev, bookingBuffer: event.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
              >
                <option>10 min</option>
                <option>15 min</option>
                <option>30 min</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="text-base font-semibold text-zinc-900">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500">Choose which operational events should notify your team.</p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { key: 'bookingReminders', label: 'Booking reminders', note: 'Send reminders 2 hours before appointments.' },
              { key: 'paymentAlerts', label: 'Payment alerts', note: 'Notify when invoices are paid or overdue.' },
              { key: 'weeklyDigest', label: 'Weekly digest', note: 'Summary of performance every Monday morning.' },
              { key: 'outageAlerts', label: 'Integration outage alerts', note: 'Notify when channels disconnect.' },
            ].map((item) => {
              const isChecked = notifications[item.key as keyof typeof notifications];
              return (
                <label key={item.key} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      setNotifications((prev) => ({ ...prev, [item.key]: event.target.checked }));
                      setHasUnsavedChanges(true);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#795bf4] focus:ring-[#795bf4]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-zinc-800">{item.label}</span>
                    <span className="block text-xs text-zinc-500">{item.note}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-base font-semibold text-zinc-900">Security</h2>
            <p className="mt-1 text-sm text-zinc-500">Manage authentication and session policies.</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Two-factor auth: <span className="font-semibold text-zinc-900">Enabled</span></p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Active sessions: <span className="font-semibold text-zinc-900">3 devices</span></p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Password last changed: <span className="font-semibold text-zinc-900">24 days ago</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-base font-semibold text-zinc-900">Team Access</h2>
            <p className="mt-1 text-sm text-zinc-500">Current roles and workspace permissions.</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Admins: <span className="font-semibold text-zinc-900">2</span></p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Operators: <span className="font-semibold text-zinc-900">5</span></p>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">Pending invites: <span className="font-semibold text-zinc-900">1</span></p>
            </div>
          </div>
        </section>

        <div className="rounded-lg border border-[#795bf4]/20 bg-[#795bf4]/8 px-4 py-3 text-xs text-[#5a3fe0]">
          {hasUnsavedChanges ? 'You have unsaved settings changes.' : 'All settings are up to date.'}
        </div>
      </div>
    </div>
  );
}
