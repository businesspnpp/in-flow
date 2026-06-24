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
      setSuccess(`${channel.charAt(0).toUpperCase() + channel.slice(1)} channel connected to inFlow!`);
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
            window.sessionStorage.setItem(
              'wa_embedded_signup',
              JSON.stringify({ phone_number_id, waba_id })
            );
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
      Icon: MessageSquare,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      description: 'Link your WhatsApp Business profile via Meta Secure OAuth.',
      isConnected: channelStatus.whatsapp,
      onConnect: handleWhatsAppConnect,
      connectLabel: channelStatus.whatsapp ? 'Reconnect Channel' : 'Connect WhatsApp',
      showRetry: true,
      howItWorks: [
        "Authenticate your official business account via Meta's dialog securely.",
        'Select the specific active WhatsApp phone number you want to track.',
        'Inbound client messages will stream natively into your inFlow smart inbox.',
      ],
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      Icon: Instagram,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10',
      description: 'Manage your professional Instagram direct messages and automations.',
      isConnected: channelStatus.instagram,
      onConnect: handleInstagramConnect,
      connectLabel: channelStatus.instagram ? 'Reconnect Instagram' : 'Connect Instagram',
      showRetry: false,
      howItWorks: [
        'You will be redirected to Facebook to grant Instagram messaging permissions.',
        'Your Instagram Professional account will be linked automatically.',
        'DMs from followers will appear directly in your inFlow inbox.',
      ],
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      Icon: Facebook,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      description: 'Sync your company Facebook Page conversations directly into your inbox.',
      isConnected: channelStatus.facebook,
      onConnect: handleFacebookConnect,
      connectLabel: channelStatus.facebook ? 'Reconnect Facebook' : 'Connect Facebook',
      showRetry: false,
      howItWorks: [
        'You will be redirected to Facebook to select your Business Page.',
        'Grant messaging permissions for the selected Page.',
        'Page conversations will route directly into your inFlow inbox.',
      ],
    },
    {
      id: 'sms',
      name: 'SMS Gateway',
      Icon: MessageCircle,
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-500/10',
      description: 'Connect your local SMS integration to send native text notifications.',
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
      <div className="space-y-6">

        {/* Section label */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-1">Connected Channels</p>
          <p className="text-xs text-slate-500">
            Manage platform channels connected to your inFlow account.
          </p>
        </div>

        {/* Channel list */}
        <div className="flex flex-col gap-3">
          {CHANNELS.map(({ id, name, Icon, iconColor, iconBg, description, isConnected, onConnect, connectLabel, showRetry, howItWorks }) => {
            const isSms = id === 'sms';
            const isOpen = activeChannel === id;
            const isLoading = loading === id;

            return (
              <div key={id} className="flex flex-col">
                {/* Card row */}
                <button
                  type="button"
                  onClick={() => handleCardClick(id)}
                  className={`w-full text-left rounded-2xl px-4 py-4 flex items-center gap-4 transition-all ${
                    isOpen
                      ? 'bg-[#1a1d27] rounded-b-none border border-amber-500/30 border-b-0'
                      : 'bg-[#13161e] border border-white/5 hover:border-white/10 hover:bg-[#1a1d27]'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
                    <Icon size={18} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-200">{name}</p>
                      {isSms ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-600 border border-white/5">
                          Coming Soon
                        </span>
                      ) : (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                          isConnected
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 border-white/8 text-slate-500'
                        }`}>
                          {isConnected ? 'Connected' : 'Not Integrated'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{description}</p>
                  </div>

                  {/* Chevron */}
                  <span className="text-slate-700 text-[10px] shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expanded panel */}
                {isOpen && !isSms && onConnect && (
                  <div className="rounded-2xl rounded-t-none border border-amber-500/20 border-t-0 bg-[#1a1d27] divide-y divide-white/[0.05]">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {isConnected ? 'Active and receiving messages' : 'Not integrated'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={onConnect}
                            disabled={isLoading}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-[#0f1117] hover:bg-amber-400 disabled:opacity-40 transition-colors"
                          >
                            {isLoading ? 'Connecting…' : connectLabel}
                          </button>
                          {showRetry && (
                            <button
                              type="button"
                              onClick={onConnect}
                              disabled={isLoading}
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 disabled:opacity-40 transition-colors"
                            >
                              Retry
                            </button>
                          )}
                          {id === 'whatsapp' && (
                            <button
                              type="button"
                              onClick={() => setShowTroubleshoot(true)}
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-white/5 transition-colors"
                            >
                              Troubleshoot
                            </button>
                          )}
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                          {error}
                        </p>
                      )}
                      {success && (
                        <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                          {success}
                        </p>
                      )}
                    </div>

                    {howItWorks.length > 0 && (
                      <div className="px-4 py-3">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">How it works</p>
                        <ul className="space-y-1.5">
                          {howItWorks.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="text-amber-500/60 mt-0.5 shrink-0">·</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {isOpen && isSms && (
                  <div className="rounded-2xl rounded-t-none border border-white/5 border-t-0 bg-[#1a1d27] px-4 py-3">
                    <p className="text-xs text-slate-600 italic">
                      SMS integration is currently being provisioned. Full connection support is coming soon.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Troubleshoot modal */}
      {showTroubleshoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[90%] max-w-lg rounded-2xl bg-[#13161e] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">WhatsApp Troubleshooting</h4>
                <p className="text-xs text-slate-600 mt-0.5">Steps to resolve common connection issues.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="text-slate-600 hover:text-slate-400 p-1 transition-colors"
              >
                <X size={16} />
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
                <li key={i} className="flex items-start gap-3 text-xs text-slate-500">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/5 text-slate-400 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
