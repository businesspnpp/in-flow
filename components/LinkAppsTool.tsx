'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase, Business } from '@/lib/supabase';

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/>
      <path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white"/>
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="4" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#1877F2"/>
      <path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white"/>
    </svg>
  );
}

function SmsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#71717a"/>
      <path d="M4 6h16v10a2 2 0 01-2 2H6l-3 2V8a2 2 0 012-2z" fill="white" fillOpacity="0.9"/>
      <circle cx="8" cy="11" r="1.2" fill="#71717a"/>
      <circle cx="12" cy="11" r="1.2" fill="#71717a"/>
      <circle cx="16" cy="11" r="1.2" fill="#71717a"/>
    </svg>
  );
}

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

export default function LinkAppsTool({ business, onUpdated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>({
    whatsapp: Boolean(business.whatsapp_phone_number_id),
    instagram: false,
    facebook: false,
  });

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthStatus = params.get('oauth');
    const channel = params.get('channel');
    const oauthError = params.get('error');

    if (oauthStatus === 'success' && channel) {
      setSuccess(`${channel.charAt(0).toUpperCase() + channel.slice(1)} connected to Dock.`);
      setActiveChannel(channel);
      setChannelStatus(prev => ({ ...prev, [channel]: true }));
      window.history.replaceState({}, '', window.location.pathname);
    } else if (oauthStatus === 'error' && oauthError) {
      setError(decodeURIComponent(oauthError));
      if (channel) setActiveChannel(channel);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
      setError('Login timed out — popups may be blocked. Allow popups and try again.');
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
                setSuccess('WhatsApp Business connected to Dock.');
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

  const handleInstagramConnect = () => {
    setError('');
    setSuccess('');
    const redirectUri = `${window.location.origin}/api/instagram/callback`;
    const state = encodeURIComponent(JSON.stringify({ business_id: business.id, channel: 'instagram' }));
    const url =
      `https://www.facebook.com/v20.0/dialog/oauth` +
      `?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&config_id=${META_CONFIG_ID}` +
      `&state=${state}` +
      `&response_type=code` +
      `&override_default_response_type=true`;
    window.location.href = url;
  };

  const handleFacebookConnect = () => {
    setError('');
    setSuccess('');
    const redirectUri = `${window.location.origin}/api/facebook/callback`;
    const state = encodeURIComponent(JSON.stringify({ business_id: business.id, channel: 'facebook' }));
    const url =
      `https://www.facebook.com/v20.0/dialog/oauth` +
      `?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&config_id=${META_CONFIG_ID}` +
      `&state=${state}` +
      `&response_type=code` +
      `&override_default_response_type=true`;
    window.location.href = url;
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
      Icon: WhatsAppIcon,
      description: 'Link your WhatsApp Business profile via Meta Secure OAuth.',
      isConnected: channelStatus.whatsapp,
      onConnect: handleWhatsAppConnect,
      connectLabel: channelStatus.whatsapp ? 'Reconnect Channel' : 'Connect WhatsApp',
      showRetry: true,
      howItWorks: [
        "Authenticate your official business account via Meta's dialog.",
        'Select the WhatsApp phone number you want to track.',
        'Inbound messages will stream into your Dock inbox.',
      ],
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      Icon: InstagramIcon,
      description: 'Manage Instagram direct messages and automations.',
      isConnected: channelStatus.instagram,
      onConnect: handleInstagramConnect,
      connectLabel: channelStatus.instagram ? 'Reconnect Instagram' : 'Connect Instagram',
      showRetry: false,
      howItWorks: [
        'You will be redirected to Facebook to grant Instagram messaging permissions.',
        'Your Instagram Professional account will be linked automatically.',
        'DMs from followers will appear in your Dock inbox.',
      ],
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      Icon: FacebookIcon,
      description: 'Sync Facebook Page conversations into your inbox.',
      isConnected: channelStatus.facebook,
      onConnect: handleFacebookConnect,
      connectLabel: channelStatus.facebook ? 'Reconnect Facebook' : 'Connect Facebook',
      showRetry: false,
      howItWorks: [
        'You will be redirected to Facebook to select your Business Page.',
        'Grant messaging permissions for the selected Page.',
        'Page conversations will route into your Dock inbox.',
      ],
    },
    {
      id: 'sms',
      name: 'SMS Gateway',
      Icon: SmsIcon,
      description: 'Connect your local SMS integration for native text notifications.',
      isConnected: false,
      onConnect: null,
      connectLabel: '',
      showRetry: false,
      howItWorks: [],
    },
  ];

  return (
    <>
      <div id="fb-root" />
      <div className="space-y-6 w-full min-w-0 bg-zinc-50 p-6 md:p-8">

        <div>
          <p className="text-xs font-bold uppercase tracking-tight text-zinc-500 mb-1">Connected Channels</p>
          <p className="text-xs text-zinc-500">
            Manage platform channels connected to your Dock account.
          </p>
        </div>

        <div className="space-y-4 w-full min-w-0">
          {CHANNELS.map(({ id, name, Icon, description, isConnected, onConnect, connectLabel, showRetry, howItWorks }) => {
            const isSms = id === 'sms';
            const isOpen = activeChannel === id;
            const isLoading = loading === id;

            return (
              <div key={id} className="flex flex-col w-full min-w-0 if-card-soft">
                <button
                  type="button"
                  onClick={() => handleCardClick(id)}
                  className={`w-full min-w-0 text-left px-4 py-3 flex items-center gap-3 transition-colors border ${
                    isOpen
                      ? 'border-zinc-300 border-b-0 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-zinc-100 border border-zinc-200 overflow-hidden">
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-900">{name}</p>
                      {isSms ? (
                        <span className="bg-zinc-100 text-zinc-500 border border-zinc-200 text-[10px] px-1.5 py-0.5 font-semibold">
                          Coming Soon
                        </span>
                      ) : (
                        <span className={`text-[10px] px-1.5 py-0.5 border font-semibold shrink-0 ${
                          isConnected
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                        }`}>
                          {isConnected ? 'Connected' : 'Not connected'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{description}</p>
                  </div>

                  <span className="text-zinc-500 text-[10px] shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && !isSms && onConnect && (
                  <div className="w-full min-w-0 border border-zinc-200 border-t-0 bg-zinc-50 divide-y divide-zinc-200 overflow-hidden">
                    <div className="p-4 space-y-3 min-w-0">
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Status</p>
                          <p className="text-xs text-zinc-600 mt-0.5">
                            {isConnected ? 'Active and receiving messages' : 'Not connected'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <button
                            type="button"
                            onClick={onConnect}
                            disabled={isLoading}
                            className="if-btn-primary disabled:opacity-40 px-3 py-2.5 text-xs font-semibold"
                          >
                            {isLoading ? 'Connecting…' : connectLabel}
                          </button>
                          {showRetry && (
                            <button
                              type="button"
                              onClick={onConnect}
                              disabled={isLoading}
                              className="border border-zinc-300 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                            >
                              Retry
                            </button>
                          )}
                          {id === 'whatsapp' && (
                            <button
                              type="button"
                              onClick={() => setShowTroubleshoot(true)}
                              className="border border-zinc-200 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors"
                            >
                              Troubleshoot
                            </button>
                          )}
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-red-700 bg-red-50 p-2.5 border border-red-200 break-words">
                          {error}
                        </p>
                      )}
                      {success && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 border border-emerald-200 break-words">
                          {success}
                        </p>
                      )}
                    </div>

                    {howItWorks.length > 0 && (
                      <div className="px-4 py-3 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 mb-2">How it works</p>
                        <ul className="space-y-1.5">
                          {howItWorks.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 min-w-0">
                              <span className="text-amber-600 mt-0.5 shrink-0 font-bold">·</span>
                              <span className="min-w-0 break-words">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {isOpen && isSms && (
                  <div className="w-full min-w-0 border border-zinc-200 border-t-0 bg-zinc-50 px-4 py-3 overflow-hidden">
                    <p className="text-xs text-zinc-500 italic break-words">
                      SMS integration is currently being provisioned. Full connection support is coming soon.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showTroubleshoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 px-4">
          <div className="if-card w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-zinc-900">WhatsApp Troubleshooting</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Steps to resolve common connection issues.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 transition-colors shrink-0"
              >
                <X size={18} strokeWidth={2.25} />
              </button>
            </div>
            <ol className="space-y-2.5">
              {[
                'Allow popups and redirects for this site in your browser.',
                'Make sure third-party cookies are enabled or try in a private window.',
                'Check that your Meta app ID (NEXT_PUBLIC_META_APP_ID) is configured correctly.',
                'Temporarily disable browser extensions that may interfere.',
                'Try again with the Retry button after applying the above steps.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zinc-600 min-w-0">
                  <span className="flex-shrink-0 h-5 w-5 bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="px-4 py-2 text-xs font-semibold border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}:can you please update this and edit the design and layoit and whatnon to be  exactly like in  thta image, then give me full coplete updated file. the only differecne will be that our title will be Link Aps ontead of intergrations.
