'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { supabase, Business } from '@/lib/supabase';

/* ---------------- ICONS ---------------- */

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/>
      <path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white"/>
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
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
      <rect width="24" height="24" rx="5" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#1877F2"/>
      <path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white"/>
    </svg>
  );
}

function HubSpotIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#FF7A59"/>
      <circle cx="9" cy="15" r="3" fill="white"/>
      <circle cx="15" cy="8" r="2.2" fill="white"/>
      <path d="M10.8 13.5L13.5 9.8" stroke="white" strokeWidth="1.6"/>
    </svg>
  );
}

function SlackIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="white"/>
      <rect x="7" y="3" width="3.2" height="9" rx="1.6" fill="#36C5F0"/>
      <rect x="12" y="3" width="3.2" height="9" rx="1.6" fill="#2EB67D" transform="rotate(90 12 3)" />
      <circle cx="8.6" cy="7.5" r="1.6" fill="#36C5F0"/>
      <circle cx="16.5" cy="15.4" r="1.6" fill="#ECB22E"/>
      <rect x="13.8" y="12" width="3.2" height="9" rx="1.6" fill="#ECB22E"/>
      <rect x="8" y="12" width="3.2" height="9" rx="1.6" fill="#E01E5A" transform="rotate(90 8 12)"/>
    </svg>
  );
}

function WebflowIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#4353FF"/>
      <path d="M5 8l3 8 2.5-5.5L13 16l3-8h-2l-1.7 4.6L10.7 8H9l-1.6 4.6L5.8 8H5z" fill="white"/>
    </svg>
  );
}

function GmailIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="white"/>
      <path d="M4 7.5v9A1.5 1.5 0 005.5 18H7V9.2l5 3.8 5-3.8V18h1.5A1.5 1.5 0 0020 16.5v-9A1.5 1.5 0 0018.5 6h-.3L12 10.8 5.8 6H5.5A1.5 1.5 0 004 7.5z" fill="#EA4335"/>
      <path d="M7 9.2V18H5.5A1.5 1.5 0 014 16.5v-9c0-.4.1-.7.3-1L7 9.2z" fill="#34A853"/>
      <path d="M17 9.2V18h1.5a1.5 1.5 0 001.5-1.5v-9c0-.4-.1-.7-.3-1L17 9.2z" fill="#4285F4"/>
      <path d="M5.8 6h.2L12 10.8 17.5 6h.2c.5 0 .9.1 1.3.4L12 12.3 4.5 6.4c.4-.3.8-.4 1.3-.4z" fill="#FBBC05"/>
    </svg>
  );
}

function NewAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#F4F4F5"/>
      <rect x="5" y="5" width="6" height="6" rx="1.4" fill="#A1A1AA"/>
      <rect x="13" y="5" width="6" height="6" rx="1.4" fill="#D4D4D8"/>
      <rect x="5" y="13" width="6" height="6" rx="1.4" fill="#D4D4D8"/>
      <rect x="13" y="13" width="6" height="6" rx="1.4" fill="#A1A1AA"/>
    </svg>
  );
}

/* ---------------- TYPES ---------------- */

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

type IntegrationCard = {
  id: string;
  name: string;
  Icon: (props: { size?: number }) => JSX.Element;
  description: string;
  isConnected: boolean;
  hasIssue?: boolean;
  mappedFields: number;
  syncFrequency: string;
  onConnect?: (() => void) | null;
  isReal?: boolean; // backed by actual OAuth logic, vs. mock display-only card
};

export default function LinkAppsTool({ business, onUpdated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  /* ---------------- CONNECTED GRID (matches screenshot: HubSpot, Slack, Webflow, WhatsApp, Instagram, Gmail) ---------------- */
  // Mock cards (HubSpot, Slack, Webflow, Gmail) are display-only — they are not wired to any backend.
  // Real cards (WhatsApp, Instagram) use the actual Meta OAuth handlers above.
  const connectedCards: IntegrationCard[] = [
    {
      id: 'hubspot',
      name: 'HubSpot',
      Icon: HubSpotIcon,
      description: 'Create and revers for HubSpot sebids.',
      isConnected: true,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: null,
      isReal: false,
    },
    {
      id: 'slack',
      name: 'Slack',
      Icon: SlackIcon,
      description: 'New automation side in Slack.',
      isConnected: true,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: null,
      isReal: false,
    },
    {
      id: 'webflow',
      name: 'Webflow',
      Icon: WebflowIcon,
      description: 'Your automation in Webflow.',
      isConnected: true,
      hasIssue: true,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: null,
      isReal: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      Icon: WhatsAppIcon,
      description: 'I fellow a your message in WhatsApp.',
      isConnected: channelStatus.whatsapp,
      mappedFields: 318,
      syncFrequency: '20m',
      onConnect: handleWhatsAppConnect,
      isReal: true,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      Icon: InstagramIcon,
      description: 'New automation side in Instagram.',
      isConnected: channelStatus.instagram,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: handleInstagramConnect,
      isReal: true,
    },
    {
      id: 'gmail',
      name: 'Gmail',
      Icon: GmailIcon,
      description: 'Gmail is operated to gmail and gmail.',
      isConnected: true,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: null,
      isReal: false,
    },
  ];

  const availableCards = [
    {
      id: 'newapp',
      name: 'New App',
      Icon: NewAppIcon,
      description: 'New automation side Slack.',
      mappedFields: 45,
      syncFrequency: '20m',
    },
  ];

  const workflowItems = [
    { id: 'wf1', Icon: WebflowIcon, name: 'Webflow to HubSpot Sync', sub: 'Webflow to HubSpot Sync' },
    { id: 'wf2', Icon: SlackIcon, name: 'Slack to HubSpot Sync', sub: 'Webflow to HubSpot Sync' },
    { id: 'wf3', Icon: GmailIcon, name: 'Gmail to Gmarl Sync', sub: 'Webflow to Instagram Sync' },
  ];

  const filteredConnected = connectedCards.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-w-0 bg-zinc-50">
      <div id="fb-root" />

      <div className="w-full p-6 space-y-6">

        {/* GLOBAL MESSAGES ALERT CONTAINER */}
        {(success || error) && (
          <div className="space-y-3">
            {success && (
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium break-words">{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium break-words">{error}</span>
              </div>
            )}
          </div>
        )}

        {/* OVERVIEW BAR */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-zinc-900 mb-4">Integrations Overview</h2>
          <div className="flex flex-wrap gap-16">
            <div>
              <p className="text-sm text-zinc-500 mb-1">Active Connections:</p>
              <p className="text-2xl font-bold text-zinc-900">{connectedCards.filter(c => c.isConnected).length}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-1">Integrations with Issues:</p>
              <p className="text-2xl font-bold text-red-600">
                1 ({connectedCards.find(c => c.hasIssue)?.name})
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-1">New suggested integrations</p>
              <p className="text-2xl font-bold text-zinc-300">-</p>
            </div>
          </div>
        </div>

        {/* ALL INTEGRATIONS PANEL */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h2 className="text-base font-bold text-zinc-900">All Integrations</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 hover:bg-zinc-50"
              >
                Filter <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-base font-bold text-zinc-900 mb-3">Connected</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredConnected.map((card) => {
              const isLoading = loading === card.id;
              return (
                <div
                  key={card.id}
                  className={`border rounded-xl p-4 flex flex-col justify-between ${
                    card.hasIssue ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg overflow-hidden border border-zinc-200">
                          <card.Icon size={22} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 leading-tight">{card.name}</h4>
                          <p className="text-xs text-zinc-500 leading-tight mt-0.5 max-w-[180px]">{card.description}</p>
                        </div>
                      </div>
                      {card.hasIssue && <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />}
                    </div>

                    {card.hasIssue && (
                      <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Issue Detected
                      </p>
                    )}

                    <div className="flex gap-8 mt-3 mb-4">
                      <div>
                        <p className="text-base font-bold text-zinc-900">{card.mappedFields}</p>
                        <p className="text-xs text-zinc-500">Mapped fields</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900">{card.syncFrequency}</p>
                        <p className="text-xs text-zinc-500">Sync Frequency</p>
                      </div>
                    </div>
                  </div>

                  {card.hasIssue ? (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-zinc-500 bg-zinc-100 rounded-lg px-3 py-2.5 hover:bg-zinc-200 transition-colors"
                      >
                        Re-authorize
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex-1 text-xs font-semibold text-white bg-zinc-900 rounded-lg px-3 py-2 hover:bg-zinc-800 transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold text-zinc-500 px-3 py-2 hover:text-zinc-800 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={card.onConnect || undefined}
                        disabled={isLoading || !card.isReal}
                        className="flex-1 text-xs font-semibold text-white bg-zinc-900 rounded-lg px-3 py-2 hover:bg-zinc-800 disabled:opacity-100 transition-colors"
                      >
                        {isLoading ? 'Connecting…' : 'Manage'}
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-zinc-500 px-3 py-2 hover:text-zinc-800 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}

                  {card.id === 'whatsapp' && (
                    <button
                      type="button"
                      onClick={() => setShowTroubleshoot(true)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-700 mt-2 text-left"
                    >
                      Troubleshoot connection
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AVAILABLE FOR CONNECTION */}
            <div>
              <h3 className="text-base font-bold text-zinc-900 mb-3">Available for Connection</h3>
              <div className="space-y-3">
                {availableCards.map((card) => (
                  <div
                    key={card.id}
                    className="border border-zinc-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg border border-zinc-200">
                        <card.Icon size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-400">{card.name}</p>
                        <p className="text-xs text-zinc-400 max-w-[160px]">{card.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-8 mb-3">
                      <div>
                        <p className="text-base font-bold text-zinc-300">{card.mappedFields}</p>
                        <p className="text-xs text-zinc-400">Mapped fields</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-300">{card.syncFrequency}</p>
                        <p className="text-xs text-zinc-400">Sync Frequency</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 text-xs font-semibold text-zinc-500 bg-zinc-100 rounded-lg px-3 py-2 hover:bg-zinc-200 transition-colors"
                      >
                        Connect
                      </button>
                      <button
                        type="button"
                        className="flex-1 text-xs font-semibold text-white bg-zinc-400 rounded-lg px-3 py-2 cursor-not-allowed"
                        disabled
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTEGRATION LOG */}
            <div>
              <h3 className="text-base font-bold text-zinc-900 mb-3">Integration Log</h3>
              <div className="border border-zinc-200 rounded-xl p-4 h-full">
                <p className="text-sm text-zinc-500 mb-3">Recent Last API events</p>
                <p className="text-sm text-red-600 font-semibold">Issues: 1</p>
                <p className="text-xs text-zinc-400 mt-1">events ali event sent ago</p>
              </div>
            </div>

            {/* WORKFLOW-ACTIVATED */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-zinc-900">Workflow-Activated</h3>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {workflowItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-zinc-200 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-lg border border-zinc-200 overflow-hidden">
                        <item.Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">{item.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sync Status
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIAGNOSTICS MODAL */}
      {showTroubleshoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs px-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">WhatsApp Diagnostics</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Resolve structural configuration blocks manually.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 transition-colors shrink-0"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <ol className="space-y-3 my-4">
              {[
                'Allow programmatic popups and redirects for this workspace environment.',
                'Ensure tracking and cross-site cookies are permitted or test from a clean context.',
                'Confirm target environmental tracking flags (NEXT_PUBLIC_META_APP_ID) align natively.',
                'Temporarily turn off blocking extensions that interfere with dialogue triggers.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zinc-600">
                  <span className="flex-shrink-0 h-5 w-5 bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-bold mt-0.5 rounded">
                    {i + 1}
                  </span>
                  <span className="leading-normal">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="px-4 py-2 text-xs font-bold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
