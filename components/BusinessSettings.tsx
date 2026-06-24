'use client';

import { useEffect, useState } from 'react';
import { Instagram, Facebook, MessageSquare, MessageCircle, X } from 'lucide-react';
import { supabase, Business } from '@/lib/supabase';

interface Props {
  business: Business;
  onUpdated: (b: Business) => void;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const META_CONFIG_ID = '2301977283876651';

type ChannelStatus = {
  whatsapp: boolean;
  instagram: boolean;
  facebook: boolean;
};

export default function BusinessSettings({ business, onUpdated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>('whatsapp');
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>({
    whatsapp: Boolean(business.whatsapp_phone_number_id),
    instagram: false,
    facebook: false,
  });

  // Load channel_configs on mount
  useEffect(() => {
    async function fetchChannelConfigs() {
      const { data } = await supabase
        .from('channel_configs')
        .select('channel, status')
        .eq('business_id', business.id);

      if (data) {
        const updated: Partial<ChannelStatus> = {};
        data.forEach((row: { channel: string; status: string }) => {
          if (row.channel === 'instagram') updated.instagram = row.status === 'connected';
          if (row.channel === 'facebook') updated.facebook = row.status === 'connected';
        });
        setChannelStatus(prev => ({ ...prev, ...updated }));
      }
    }
    fetchChannelConfigs();
  }, [business.id]);

  // Load FB SDK once
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v20.0',
      });
    };
    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(js);
    }

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.endsWith('facebook.com')) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'WA_EMBEDDED_SIGNUP') return;
        if (data.event === 'FINISH') {
          const { phone_number_id, waba_id } = data.data || {};
          if (phone_number_id && waba_id) {
            window.sessionStorage.setItem('wa_embedded_signup', JSON.stringify({ phone_number_id, waba_id }));
          }
        }
      } catch (e) {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // WhatsApp — embedded signup
  const handleWhatsAppConnect = () => {
    setError('');
    setSuccess('');
    setLoading('whatsapp');

    if (!window.FB) {
      setError('Facebook SDK failed to load. Please refresh the page.');
      setLoading(null);
      return;
    }

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      setLoading(null);
      setError('Login timed out — popups might be blocked. Please allow popups and try again.');
    }, 30000);

    try {
      window.FB.login(
        (response: any) => {
          clearTimeout(timer);
          if (timedOut) return;

          if (response?.authResponse?.code) {
            const authCode = response.authResponse.code;
            let signupMeta: { phone_number_id?: string; waba_id?: string } = {};
            try {
              const raw = window.sessionStorage.getItem('wa_embedded_signup');
              if (raw) signupMeta = JSON.parse(raw);
            } catch (e) {}

            fetch('/api/whatsapp/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                business_id: business.id,
                code: authCode,
                waba_id: signupMeta.waba_id,
                phone_number_id: signupMeta.phone_number_id,
              }),
            })
              .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
                setSuccess('WhatsApp Business channel connected to inFlow!');
                if (data.business) onUpdated(data.business);
                setChannelStatus(prev => ({ ...prev, whatsapp: true }));
                window.sessionStorage.removeItem('wa_embedded_signup');
              })
              .catch((err: any) => setError(err?.message || 'Error during onboarding.'))
              .finally(() => setLoading(null));
          } else {
            setError('Onboarding cancelled or permissions not granted.');
            setLoading(null);
          }
        },
        {
          config_id: META_CONFIG_ID,
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: {}, featureType: '', sessionInfoVersion: '3' },
        }
      );
    } catch (err: any) {
      clearTimeout(timer);
      setLoading(null);
      setError(err?.message || 'Facebook login failed to start.');
    }
  };

  // Instagram — standard FB Login OAuth
  const handleInstagramConnect = () => {
    setError('');
    setSuccess('');
    setLoading('instagram');

    if (!window.FB) {
      setError('Facebook SDK failed to load. Please refresh the page.');
      setLoading(null);
      return;
    }

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      setLoading(null);
      setError('Login timed out — popups might be blocked. Please allow popups and try again.');
    }, 30000);

    try {
      window.FB.login(
        (response: any) => {
          clearTimeout(timer);
          if (timedOut) return;

          if (response?.authResponse?.accessToken) {
            fetch('/api/instagram/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                business_id: business.id,
                access_token: response.authResponse.accessToken,
              }),
            })
              .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
                setSuccess('Instagram DM channel connected to inFlow!');
                setChannelStatus(prev => ({ ...prev, instagram: true }));
              })
              .catch((err: any) => setError(err?.message || 'Error connecting Instagram.'))
              .finally(() => setLoading(null));
          } else {
            setError('Instagram login cancelled or permissions not granted.');
            setLoading(null);
          }
        },
        { scope: 'instagram_basic,instagram_manage_messages,pages_show_list' }
      );
    } catch (err: any) {
      clearTimeout(timer);
      setLoading(null);
      setError(err?.message || 'Facebook login failed to start.');
    }
  };

  // Facebook — standard FB Login OAuth
  const handleFacebookConnect = () => {
    setError('');
    setSuccess('');
    setLoading('facebook');

    if (!window.FB) {
      setError('Facebook SDK failed to load. Please refresh the page.');
      setLoading(null);
      return;
    }

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      setLoading(null);
      setError('Login timed out — popups might be blocked. Please allow popups and try again.');
    }, 30000);

    try {
      window.FB.login(
        (response: any) => {
          clearTimeout(timer);
          if (timedOut) return;

          if (response?.authResponse?.accessToken) {
            fetch('/api/facebook/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                business_id: business.id,
                access_token: response.authResponse.accessToken,
              }),
            })
              .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
                setSuccess('Facebook Business channel connected to inFlow!');
                setChannelStatus(prev => ({ ...prev, facebook: true }));
              })
              .catch((err: any) => setError(err?.message || 'Error connecting Facebook.'))
              .finally(() => setLoading(null));
          } else {
            setError('Facebook login cancelled or permissions not granted.');
            setLoading(null);
          }
        },
        { scope: 'pages_messaging,pages_show_list,pages_read_engagement' }
      );
    } catch (err: any) {
      clearTimeout(timer);
      setLoading(null);
      setError(err?.message || 'Facebook login failed to start.');
    }
  };

  const handleCardClick = (id: string) => {
    setError('');
    setSuccess('');
    setActiveChannel(prev => (prev === id ? null : id));
  };

  const CHANNELS = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      Icon: MessageSquare,
      description: 'Link your WhatsApp Business profile via Meta Secure OAuth.',
      isConnected: channelStatus.whatsapp,
      onConnect: handleWhatsAppConnect,
      connectLabel: channelStatus.whatsapp ? 'Reconnect Channel' : 'Connect WhatsApp',
      showRetry: true,
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      Icon: Instagram,
      description: 'Manage your professional Instagram direct messages and automations.',
      isConnected: channelStatus.instagram,
      onConnect: handleInstagramConnect,
      connectLabel: channelStatus.instagram ? 'Reconnect Instagram' : 'Connect Instagram',
      showRetry: false,
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      Icon: Facebook,
      description: 'Sync your company Facebook Page conversations directly into your inbox.',
      isConnected: channelStatus.facebook,
      onConnect: handleFacebookConnect,
      connectLabel: channelStatus.facebook ? 'Reconnect Facebook' : 'Connect Facebook',
      showRetry: false,
    },
    {
      id: 'sms',
      name: 'SMS Gateway',
      Icon: MessageCircle,
      description: 'Connect your local SMS integration to send native text notifications.',
      isConnected: false,
      onConnect: null,
      connectLabel: '',
      showRetry: false,
    },
  ];

  return (
    <>
      <div id="fb-root" />
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Connected Channels</h3>
          <p className="text-sm text-zinc-600 mt-1">
            Manage platform channels connected to your inFlow account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHANNELS.map(({ id, name, Icon, description, isConnected, onConnect, connectLabel, showRetry }) => {
            const isSms = id === 'sms';
            const isOpen = activeChannel === id;
            const isLoading = loading === id;

            return (
              <div key={id} className="flex flex-col gap-0">
                <button
                  type="button"
                  onClick={() => handleCardClick(id)}
                  className={`w-full text-left bg-white border rounded-lg p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                    isOpen ? 'border-amber-400 rounded-b-none' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isConnected ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-500'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{name}</p>
                      {isSms ? (
                        <span className="text-[10px] px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-400 shrink-0">
                          Coming Soon
                        </span>
                      ) : (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                          isConnected
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 font-semibold'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                        }`}>
                          {isConnected ? 'Connected' : 'Not Integrated'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
                  </div>
                  <span className="text-zinc-300 text-xs mt-1 shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && !isSms && onConnect && (
                  <div className="border border-t-0 border-amber-200 rounded-b-lg bg-white divide-y divide-zinc-100">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">Status</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {isConnected ? 'Channel is active and receiving messages' : 'Not integrated'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <button
                            type="button"
                            onClick={onConnect}
                            disabled={isLoading}
                            className="rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors min-h-[36px]"
                          >
                            {isLoading ? 'Connecting...' : connectLabel}
                          </button>
                          {showRetry && (
                            <button
                              type="button"
                              onClick={onConnect}
                              disabled={isLoading}
                              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 min-h-[36px]"
                            >
                              Retry
                            </button>
                          )}
                          {id === 'whatsapp' && (
                            <button
                              type="button"
                              onClick={() => setShowTroubleshoot(true)}
                              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 min-h-[36px]"
                            >
                              Troubleshoot
                            </button>
                          )}
                        </div>
                      </div>
                      {error && (
                        <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">{error}</p>
                      )}
                      {success && (
                        <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-medium">{success}</p>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-zinc-50 rounded-b-lg">
                      <p className="text-xs font-semibold text-zinc-900">How it works</p>
                      <ul className="mt-2 space-y-1 text-xs text-zinc-600 list-disc list-inside">
                        {id === 'whatsapp' && <>
                          <li>Authenticate your official business account via Meta's dialog.</li>
                          <li>Select the WhatsApp phone number you want to track.</li>
                          <li>Inbound messages will stream into your inFlow inbox.</li>
                        </>}
                        {id === 'instagram' && <>
                          <li>Log in with Facebook and grant Instagram messaging permissions.</li>
                          <li>Your Instagram Professional account will be linked.</li>
                          <li>DMs from followers will appear in your inFlow inbox.</li>
                        </>}
                        {id === 'facebook' && <>
                          <li>Log in with Facebook and select your Business Page.</li>
                          <li>Grant messaging permissions for that Page.</li>
                          <li>Page messages will route into your inFlow inbox.</li>
                        </>}
                      </ul>
                    </div>
                  </div>
                )}

                {isOpen && isSms && (
                  <div className="border border-t-0 border-zinc-200 rounded-b-lg bg-zinc-50/50 p-4 text-xs text-zinc-500 italic">
                    SMS integration is currently being provisioned. Full connection support is coming soon.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showTroubleshoot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
            <div className="w-[90%] max-w-lg rounded-lg bg-white border border-zinc-200 p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">WhatsApp Troubleshooting</h4>
                  <p className="text-xs text-zinc-500 mt-1">Steps to resolve common connection issues.</p>
                </div>
                <button type="button" onClick={() => setShowTroubleshoot(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                  <X size={16} />
                </button>
              </div>
              <ol className="mt-4 space-y-2 text-xs text-zinc-700 list-decimal list-inside">
                <li>Allow popups and redirects for this site in your browser.</li>
                <li>Make sure third-party cookies are enabled or try in a private window.</li>
                <li>Check that your Meta app ID (NEXT_PUBLIC_META_APP_ID) is configured correctly.</li>
                <li>Temporarily disable browser extensions that may interfere.</li>
                <li>Try again with the Retry button after applying the above steps.</li>
              </ol>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTroubleshoot(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold border border-zinc-300 text-zinc-700 hover:bg-zinc-50 min-h-[36px]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
