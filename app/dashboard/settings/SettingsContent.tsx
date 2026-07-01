'use client';

import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDashboardHeader } from '@/components/dashboard/DashboardHeaderContext';
import { supabase } from '@/lib/supabase';

type SettingsProfile = {
  business_name: string;
  owner_name: string;
  logo_url: string;
  email: string;
  address: string;
  whatsapp_number: string;
  categories: string;
  timezone: string;
  currency: string;
  booking_buffer_minutes: number;
};

type NotificationSettings = {
  booking_reminders: boolean;
  payment_alerts: boolean;
  weekly_digest: boolean;
  outage_alerts: boolean;
};

type SecuritySettings = {
  two_factor_enabled: boolean;
  active_sessions: number;
  password_changed_at: string;
};

type TeamAccessSettings = {
  admins_count: number;
  operators_count: number;
  pending_invites_count: number;
};

const initialProfile: SettingsProfile = {
  business_name: '',
  owner_name: '',
  logo_url: '',
  email: '',
  address: '',
  whatsapp_number: '',
  categories: '',
  timezone: 'Africa/Johannesburg',
  currency: 'ZAR',
  booking_buffer_minutes: 15,
};

const initialNotifications: NotificationSettings = {
  booking_reminders: true,
  payment_alerts: true,
  weekly_digest: false,
  outage_alerts: true,
};

const initialSecurity: SecuritySettings = {
  two_factor_enabled: true,
  active_sessions: 1,
  password_changed_at: new Date().toISOString().slice(0, 10),
};

const initialTeamAccess: TeamAccessSettings = {
  admins_count: 1,
  operators_count: 0,
  pending_invites_count: 0,
};

export default function SettingsContent() {
  const { setHeaderConfig, clearHeaderConfig } = useDashboardHeader();

  const [profile, setProfile] = useState<SettingsProfile>(initialProfile);
  const [originalProfile, setOriginalProfile] = useState<SettingsProfile>(initialProfile);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [originalNotifications, setOriginalNotifications] = useState<NotificationSettings>(initialNotifications);
  const [security, setSecurity] = useState<SecuritySettings>(initialSecurity);
  const [originalSecurity, setOriginalSecurity] = useState<SecuritySettings>(initialSecurity);
  const [teamAccess, setTeamAccess] = useState<TeamAccessSettings>(initialTeamAccess);
  const [originalTeamAccess, setOriginalTeamAccess] = useState<TeamAccessSettings>(initialTeamAccess);

  const hasUnsavedChanges = useMemo(
    () =>
      JSON.stringify(profile) !== JSON.stringify(originalProfile) ||
      JSON.stringify(notifications) !== JSON.stringify(originalNotifications) ||
      JSON.stringify(security) !== JSON.stringify(originalSecurity) ||
      JSON.stringify(teamAccess) !== JSON.stringify(originalTeamAccess),
    [
      notifications,
      originalNotifications,
      originalProfile,
      originalSecurity,
      originalTeamAccess,
      profile,
      security,
      teamAccess,
    ]
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

      let businessRow: any = null;

      const { data: byId, error: byIdError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!byIdError && byId) {
        businessRow = byId;
      }

      // Backward compatibility: older rows may not have used auth.user.id as businesses.id.
      if (!businessRow && user.email) {
        const { data: byEmail, error: byEmailError } = await supabase
          .from('businesses')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!byEmailError && byEmail) {
          businessRow = byEmail;
        }
      }

      // First-time bootstrap: create a minimal business profile so settings can be edited immediately.
      if (!businessRow) {
        const fallbackName = user.email
          ? `${user.email.split('@')[0]} Business`
          : 'My Business';

        const { data: inserted, error: insertError } = await supabase
          .from('businesses')
          .insert({
            id: user.id,
            business_name: fallbackName,
            categories: ['Other'],
            address: 'Not set',
            email: user.email ?? 'unknown@local.invalid',
            whatsapp_number: '',
            updated_at: new Date().toISOString(),
          })
          .select('*')
          .single();

        if (insertError || !inserted) {
          setError(`Unable to create business profile automatically: ${insertError?.message ?? 'unknown error'}`);
          return;
        }

        businessRow = inserted;
      }

      const mapped: SettingsProfile = {
        business_name: businessRow.business_name ?? '',
        owner_name: businessRow.owner_name ?? '',
        logo_url: businessRow.logo_url ?? '',
        email: businessRow.email ?? '',
        address: businessRow.address ?? '',
        whatsapp_number: businessRow.whatsapp_number ?? '',
        categories: Array.isArray(businessRow.categories) ? businessRow.categories.join(', ') : '',
        timezone: businessRow.timezone ?? 'Africa/Johannesburg',
        currency: businessRow.currency ?? 'ZAR',
        booking_buffer_minutes: Number(businessRow.booking_buffer_minutes ?? 15),
      };

      setBusinessId(businessRow.id);
      setProfile(mapped);
      setOriginalProfile(mapped);

      const [{ data: notificationRow }, { data: securityRow }, { data: teamRow }] = await Promise.all([
        supabase
          .from('business_notification_settings')
          .select('*')
          .eq('business_id', businessRow.id)
          .maybeSingle(),
        supabase
          .from('business_security_settings')
          .select('*')
          .eq('business_id', businessRow.id)
          .maybeSingle(),
        supabase
          .from('business_team_access_settings')
          .select('*')
          .eq('business_id', businessRow.id)
          .maybeSingle(),
      ]);

      const loadedNotifications: NotificationSettings = {
        booking_reminders: notificationRow?.booking_reminders ?? initialNotifications.booking_reminders,
        payment_alerts: notificationRow?.payment_alerts ?? initialNotifications.payment_alerts,
        weekly_digest: notificationRow?.weekly_digest ?? initialNotifications.weekly_digest,
        outage_alerts: notificationRow?.outage_alerts ?? initialNotifications.outage_alerts,
      };
      setNotifications(loadedNotifications);
      setOriginalNotifications(loadedNotifications);

      const loadedSecurity: SecuritySettings = {
        two_factor_enabled: securityRow?.two_factor_enabled ?? initialSecurity.two_factor_enabled,
        active_sessions: Number(securityRow?.active_sessions ?? initialSecurity.active_sessions),
        password_changed_at:
          typeof securityRow?.password_changed_at === 'string'
            ? securityRow.password_changed_at.slice(0, 10)
            : initialSecurity.password_changed_at,
      };
      setSecurity(loadedSecurity);
      setOriginalSecurity(loadedSecurity);

      const loadedTeam: TeamAccessSettings = {
        admins_count: Number(teamRow?.admins_count ?? initialTeamAccess.admins_count),
        operators_count: Number(teamRow?.operators_count ?? initialTeamAccess.operators_count),
        pending_invites_count: Number(teamRow?.pending_invites_count ?? initialTeamAccess.pending_invites_count),
      };
      setTeamAccess(loadedTeam);
      setOriginalTeamAccess(loadedTeam);
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
      logo_url: profile.logo_url.trim() || null,
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

      const [notificationWrite, securityWrite, teamWrite] = await Promise.all([
        supabase.from('business_notification_settings').upsert(
          {
            business_id: businessId,
            booking_reminders: notifications.booking_reminders,
            payment_alerts: notifications.payment_alerts,
            weekly_digest: notifications.weekly_digest,
            outage_alerts: notifications.outage_alerts,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'business_id' }
        ),
        supabase.from('business_security_settings').upsert(
          {
            business_id: businessId,
            two_factor_enabled: security.two_factor_enabled,
            active_sessions: Number(security.active_sessions || 0),
            password_changed_at: security.password_changed_at,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'business_id' }
        ),
        supabase.from('business_team_access_settings').upsert(
          {
            business_id: businessId,
            admins_count: Number(teamAccess.admins_count || 0),
            operators_count: Number(teamAccess.operators_count || 0),
            pending_invites_count: Number(teamAccess.pending_invites_count || 0),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'business_id' }
        ),
      ]);

      if (notificationWrite.error) {
        setError(`Unable to save notification settings: ${notificationWrite.error.message}`);
        return;
      }
      if (securityWrite.error) {
        setError(`Unable to save security settings: ${securityWrite.error.message}`);
        return;
      }
      if (teamWrite.error) {
        setError(`Unable to save team access settings: ${teamWrite.error.message}`);
        return;
      }

      const next = {
        ...profile,
        categories: categoriesArray.join(', '),
      };
      setProfile(next);
      setOriginalProfile(next);
      setOriginalNotifications(notifications);
      setOriginalSecurity(security);
      setOriginalTeamAccess(teamAccess);
      setStatusMessage('Settings saved successfully.');
    } catch {
      setError('Unexpected error while saving settings.');
    } finally {
      setSaving(false);
    }
  }, [businessId, notifications, profile, security, teamAccess]);

  const handleLogoUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !businessId) return;

      setLogoUploading(true);
      setError('');
      setStatusMessage('');

      try {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const normalizedExt = ext === 'jpeg' ? 'jpg' : ext;
        const filePath = `${businessId}/logo.${normalizedExt}`;

        const { error: uploadError } = await supabase
          .storage
          .from('businesses')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type || 'image/png',
            cacheControl: '3600',
          });

        if (uploadError) {
          setError(`Unable to upload logo: ${uploadError.message}`);
          return;
        }

        const { data: publicData } = supabase.storage.from('businesses').getPublicUrl(filePath);
        const logoUrl = `${publicData.publicUrl}?v=${Date.now()}`;

        const { error: updateError } = await supabase
          .from('businesses')
          .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
          .eq('id', businessId);

        if (updateError) {
          setError(`Logo uploaded but could not save URL: ${updateError.message}`);
          return;
        }

        setProfile((prev) => ({ ...prev, logo_url: logoUrl }));
        setOriginalProfile((prev) => ({ ...prev, logo_url: logoUrl }));
        setStatusMessage('Logo updated successfully.');
      } catch {
        setError('Unexpected error while uploading logo.');
      } finally {
        setLogoUploading(false);
        event.target.value = '';
      }
    },
    [businessId]
  );

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
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Profile logo</span>
              <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-white">
                  {profile.logo_url ? (
                    <img src={profile.logo_url} alt="Business logo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">No logo</div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-lg bg-[#795bf4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6847ef]">
                    {logoUploading ? 'Uploading...' : 'Upload logo'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={logoUploading}
                    />
                  </label>
                  {profile.logo_url && (
                    <button
                      type="button"
                      onClick={() => setProfile((prev) => ({ ...prev, logo_url: '' }))}
                      className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Remove (save to apply)
                    </button>
                  )}
                </div>
              </div>
            </div>

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

        {!loading && (
          <>
            <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="text-base font-semibold text-zinc-900">Notifications</h3>
              <p className="mt-1 text-sm text-zinc-500">Choose which operational events should notify your team.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  {
                    key: 'booking_reminders',
                    title: 'Booking reminders',
                    description: 'Send reminders 2 hours before appointments.',
                  },
                  {
                    key: 'payment_alerts',
                    title: 'Payment alerts',
                    description: 'Notify when invoices are paid or overdue.',
                  },
                  {
                    key: 'weekly_digest',
                    title: 'Weekly digest',
                    description: 'Summary of performance every Monday morning.',
                  },
                  {
                    key: 'outage_alerts',
                    title: 'Integration outage alerts',
                    description: 'Notify when channels disconnect.',
                  },
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof NotificationSettings]}
                      onChange={(event) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: event.target.checked,
                        }))
                      }
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#795bf4] focus:ring-[#795bf4]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-zinc-900">{item.title}</span>
                      <span className="block text-xs text-zinc-500">{item.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-semibold text-zinc-900">Security</h3>
                <p className="mt-1 text-sm text-zinc-500">Manage authentication and session policies.</p>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={security.two_factor_enabled}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, two_factor_enabled: event.target.checked }))}
                      className="h-4 w-4 rounded border-zinc-300 text-[#795bf4] focus:ring-[#795bf4]"
                    />
                    Two-factor auth enabled
                  </label>
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Active sessions</span>
                    <input
                      type="number"
                      min={0}
                      value={security.active_sessions}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, active_sessions: Number(event.target.value || 0) }))}
                      className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
                    />
                  </label>
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Password last changed</span>
                    <input
                      type="date"
                      value={security.password_changed_at}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, password_changed_at: event.target.value }))}
                      className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-semibold text-zinc-900">Team Access</h3>
                <p className="mt-1 text-sm text-zinc-500">Current roles and workspace permissions.</p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Admins</span>
                    <input
                      type="number"
                      min={0}
                      value={teamAccess.admins_count}
                      onChange={(event) => setTeamAccess((prev) => ({ ...prev, admins_count: Number(event.target.value || 0) }))}
                      className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Operators</span>
                    <input
                      type="number"
                      min={0}
                      value={teamAccess.operators_count}
                      onChange={(event) => setTeamAccess((prev) => ({ ...prev, operators_count: Number(event.target.value || 0) }))}
                      className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Pending invites</span>
                    <input
                      type="number"
                      min={0}
                      value={teamAccess.pending_invites_count}
                      onChange={(event) => setTeamAccess((prev) => ({ ...prev, pending_invites_count: Number(event.target.value || 0) }))}
                      className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition focus:border-[#795bf4]"
                    />
                  </label>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
