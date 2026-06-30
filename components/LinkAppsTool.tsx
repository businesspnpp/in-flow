'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const CHANNELS = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      Icon: WhatsAppIcon,
      description: 'Receive and reply to WhatsApp messages directly within Dock.',
      isConnected: channelStatus.whatsapp,
      onConnect: handleWhatsAppConnect,
      connectLabel: channelStatus.whatsapp ? 'Connected' : 'Connect',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      Icon: InstagramIcon,
      description: 'Sync your Instagram Direct Messages and story mentions.',
      isConnected: channelStatus.instagram,
      onConnect: handleInstagramConnect,
      connectLabel: channelStatus.instagram ? 'Connected' : 'Connect',
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      Icon: FacebookIcon,
      description: 'Manage messages sent to your Facebook business pages.',
      isConnected: channelStatus.facebook,
      onConnect: handleFacebookConnect,
      connectLabel: channelStatus.facebook ? 'Connected' : 'Connect',
    },
    {
      id: 'sms',
      name: 'SMS',
      Icon: SmsIcon,
      description: 'Send and receive text messages natively with a dedicated phone number.',
      isConnected: false,
      onConnect: null,
      connectLabel: 'Coming Soon',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <div id="fb-root" />

      {/* FIXED BASE LABELS WORKSPACE WRAPPER */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-zinc-900 tracking-tight">Connected Apps</h1>
          <p className="text-sm text-zinc-500 mt-1">Integrate third-party channels directly into your unified dashboard inbox pipeline.</p>
        </div>

        {/* ALERTS SCHEDULER CANVASES */}
        {(success || error) && (
          <div className="mb-6 space-y-2">
            {success && (
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 px-4 py-3 text-zinc-900 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" />
                <span className="break-words">{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}
          </div>
        )}

        {/* EXACT COMPONENT LIST ROW DESIGN LAYOUT CLONE */}
        <div className="border border-zinc-200 divide-y divide-zinc-200 bg-white">
          {CHANNELS.map(({ id, name, Icon, description, isConnected, onConnect, connectLabel }) => {
            const isSms = id === 'sms';
            const isLoading = loading === id;

            return (
              <div 
                key={id} 
                className="p-5 flex items-start justify-between gap-6 transition-colors hover:bg-zinc-50/50"
              >
                {/* LEFT BLOCK: ICON AND METRICS TEXT CONTENT */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-white border border-zinc-200 rounded-lg shadow-2xs">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-zinc-900 tracking-tight">{name}</h3>
                      {isConnected && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed max-w-xl">{description}</p>
                  </div>
                </div>

                {/* RIGHT BLOCK: EXACT BUTTON TRIGGER ELEMENTS */}
                <div className="shrink-0 flex items-center gap-2">
                  {id === 'whatsapp' && isConnected && (
                    <button
                      type="button"
                      onClick={() => setShowTroubleshoot(true)}
                      className="text-xs text-zinc-500 font-medium px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors rounded-md"
                    >
                      Troubleshoot
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={onConnect || undefined}
                    disabled={isSms || isLoading || isConnected}
                    className={`text-xs font-medium px-4 py-1.5 transition-all rounded-md shadow-2xs ${
                      isSms
                        ? 'bg-zinc-50 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none'
                        : isConnected
                        ? 'bg-zinc-50 text-zinc-600 border border-zinc-200 font-normal shadow-none cursor-default'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-transparent'
                    }`}
                  >
                    {isLoading ? 'Connecting…' : connectLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TROUBLESHOOT MODAL WINDOW CANVAS */}
      {showTroubleshoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs px-4">
          <div className="bg-white border border-zinc-200 w-full max-w-md p-6 relative shadow-lg rounded-lg">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <h4 className="text-sm font-medium text-zinc-900 tracking-tight">WhatsApp Setup Check</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Follow these debug rules if authentication pops fail.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="text-zinc-400 hover:text-zinc-500 p-1 transition-colors shrink-0"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            
            <ul className="space-y-2.5 my-4">
              {[
                'Allow site-wide layout popups inside your browser bar.',
                'Verify that cookies match third-party authorization profiles.',
                'Double check your local .env configuration flags.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                  <span className="text-zinc-400 font-medium shrink-0 mt-0.5">•</span>
                  <span className="leading-normal">{step}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-3.5 border-t border-zinc-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="px-3.5 py-1.5 text-xs font-medium border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-colors rounded-md shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
