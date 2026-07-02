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

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1v5.3a4.7 4.7 0 11-4-4.6v2.4a2.3 2.3 0 102 2.3V4.5h2.2z" fill="white"/>
      <path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1" stroke="#25F4EE" strokeWidth="0.4"/>
    </svg>
  );
}

function TelegramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path d="M17.7 6.8 6.8 11.1c-.7.3-.7 1.3 0 1.6l2.7 1 1 3c.1.4.6.5.9.2l1.6-1.5 2.9 2.1c.3.2.7.1.8-.3l2.1-9.8c.2-.7-.4-1.3-1.1-1z" fill="white" />
    </svg>
  );
}

function SmsIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#71717a"/>
      <path d="M4 6h16v10a2 2 0 01-2 2H6l-3 2V8a2 2 0 012-2z" fill="white" fillOpacity="0.95"/>
      <circle cx="8" cy="11" r="1.3" fill="#71717a"/>
      <circle cx="12" cy="11" r="1.3" fill="#71717a"/>
      <circle cx="16" cy="11" r="1.3" fill="#71717a"/>
    </svg>
  );
}

function GoogleBusinessProfileIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#ffffff"/>
      <path d="M11.9 12.5h4.7c-.1 1.2-.5 2.1-1.1 2.7-.7.7-1.7 1-3.1 1-2.7 0-4.8-2.2-4.8-4.9s2.1-4.9 4.8-4.9c1.5 0 2.6.6 3.4 1.4l1.8-1.8C16 4.9 14.2 4 11.9 4 8 4 5 7 5 11s3 7 6.9 7c2.1 0 3.7-.7 4.9-1.9 1.3-1.3 1.7-3.2 1.7-5.1 0-.4 0-.8-.1-1.2h-6.5v2.7z" fill="#4285F4"/>
      <path d="M18.9 9.1h-1.8V7.3h-1.6v1.8h-1.8v1.6h1.8v1.8h1.6v-1.8h1.8V9.1z" fill="#34A853"/>
      <circle cx="7" cy="8" r="1" fill="#EA4335"/>
      <circle cx="7" cy="16" r="1" fill="#FBBC05"/>
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
  telegram: boolean;
  tiktok: boolean;
};

type IntegrationCard = {
  id: string;
  name: string;
  Icon: (props: { size?: number }) => JSX.Element;
  description: string;
  isConnected: boolean;
  hasIssue?: boolean;
  mappedFields?: number;
  syncFrequency?: string;
  onConnect?: (() => void) | null;
  isReal?: boolean; // backed by actual OAuth logic, vs. mock display-only card
};

type ChannelConfigDetails = {
  status: string;
  metadata?: Record<string, unknown> | null;
};

type ZernioPlatform = 'facebook' | 'instagram' | 'whatsapp' | 'telegram' | 'tiktok';

export default function LinkAppsTool({ business, onUpdated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelDetails, setChannelDetails] = useState<Record<string, ChannelConfigDetails>>({});
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>({
    whatsapp: false,
    instagram: false,
    facebook: false,
    telegram: false,
    tiktok: false,
  });

  useEffect(() => {
    async function fetchChannelConfigs() {
      const { data } = await supabase
        .from('channel_configs')
        .select('channel, status, metadata')
        .eq('business_id', business.id);

      if (data) {
        const updated: Partial<ChannelStatus> = {};
        const details: Record<string, ChannelConfigDetails> = {};
        data.forEach((row: { channel: string; status: string; metadata?: Record<string, unknown> | null }) => {
          if (row.channel === 'whatsapp') updated.whatsapp = row.status === 'connected';
          if (row.channel === 'instagram') updated.instagram = row.status === 'connected';
          if (row.channel === 'facebook') updated.facebook = row.status === 'connected';
          if (row.channel === 'telegram') updated.telegram = row.status === 'connected';
          if (row.channel === 'tiktok') updated.tiktok = row.status === 'connected';
          details[row.channel] = {
            status: row.status,
            metadata: row.metadata ?? null,
          };
        });
        setChannelStatus(prev => ({ ...prev, ...updated }));
        setChannelDetails(details);
      }
    }
    fetchChannelConfigs();
  }, [business.id]);

  const tiktokMetadata = channelDetails.tiktok?.metadata ?? null;
  const tiktokCreator =
    typeof tiktokMetadata?.creator === 'object' && tiktokMetadata.creator !== null
      ? (tiktokMetadata.creator as Record<string, unknown>)
      : null;
  const tiktokDisplayName =
    (typeof tiktokMetadata?.display_name === 'string' && tiktokMetadata.display_name) ||
    (typeof tiktokCreator?.nickname === 'string' && tiktokCreator.nickname) ||
    '';
  const tiktokUsername = typeof tiktokMetadata?.username === 'string' ? tiktokMetadata.username.replace(/^@/, '') : '';
  const tiktokVerified = tiktokCreator?.isVerified === true;

  const startZernioConnect = (platform: ZernioPlatform) => {
    setError('');
    setSuccess('');
    setLoading(platform);
    window.location.href = `/api/zernio/connect?business_id=${encodeURIComponent(business.id)}&platform=${encodeURIComponent(platform)}`;
  };

  const handleZernioDisconnect = async (platform: ZernioPlatform) => {
    setError('');
    setSuccess('');
    setLoading(platform);

    try {
      const res = await fetch(
        `/api/zernio/disconnect?business_id=${encodeURIComponent(business.id)}&platform=${encodeURIComponent(platform)}`,
        { method: 'POST' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Disconnect failed with status ${res.status}`);

      if (data.business) {
        onUpdated(data.business);
      }

      setChannelStatus(prev => ({ ...prev, [platform]: false }));
      setSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected.`);
    } catch (err: any) {
      setError(err?.message || 'Failed to disconnect channel.');
    } finally {
      setLoading(null);
    }
  };

  const handleFacebookConnect = () => startZernioConnect('facebook');
  const handleInstagramConnect = () => startZernioConnect('instagram');
  const handleWhatsAppConnect = () => startZernioConnect('whatsapp');
  const handleTelegramConnect = () => startZernioConnect('telegram');

  const handleTikTokConnect = () => {
    setError('');
    setSuccess('');
    setLoading('tiktok');
    window.location.href = `/api/tiktok/connect?business_id=${encodeURIComponent(business.id)}`;
  };

  /* ---------------- CONNECTED GRID ----------------
    Real channels (Facebook, WhatsApp, Instagram, Telegram, TikTok) use the actual connection handlers above.
    Gmail remains display-only and Google Business Profile is still display-only for now. */
  const connectedCards: IntegrationCard[] = [
    {
      id: 'facebook',
      name: 'Facebook Pages',
      Icon: FacebookIcon,
      description: 'Sync direct messages, page comments, and community interactions into your unified workspace.',
      isConnected: channelStatus.facebook,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: handleFacebookConnect,
      isReal: true,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      Icon: TikTokIcon,
      description: 'Connected for creator identity and comment workflows, but not inbox sync.',
      isConnected: channelStatus.tiktok,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: handleTikTokConnect,
      isReal: true,
    },
    {
      id: 'google-business-profile',
      name: 'Google Business Profile',
      Icon: GoogleBusinessProfileIcon,
      description: 'Monitor regional local search visibility, read incoming customer messages, and respond directly to user reviews.',
      isConnected: false,
      onConnect: null,
      isReal: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      Icon: WhatsAppIcon,
      description: 'Route direct customer chats, automated replies, and interactive workflows through your business number.',
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
      description: 'Manage your customer DMs, story mentions, and message automations directly from one central inbox.',
      isConnected: channelStatus.instagram,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: handleInstagramConnect,
      isReal: true,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      Icon: TelegramIcon,
      description: 'Sync Telegram chats into the inbox so replies and live updates stay in one place.',
      isConnected: channelStatus.telegram,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: handleTelegramConnect,
      isReal: true,
    },
    {
      id: 'gmail',
      name: 'Gmail',
      Icon: GmailIcon,
      description: 'Connect your corporate mailbox to track customer support tickets and send official email threads seamlessly.',
      isConnected: true,
      mappedFields: 45,
      syncFrequency: '20m',
      onConnect: null,
      isReal: false,
    },
  ];

  const workflowItems = [
    { id: 'wf1', Icon: FacebookIcon, name: 'Facebook to WhatsApp Sync', sub: 'Facebook to WhatsApp Sync' },
    { id: 'wf2', Icon: TikTokIcon, name: 'TikTok to Gmail Sync', sub: 'TikTok to Gmail Sync' },
    { id: 'wf3', Icon: GmailIcon, name: 'Gmail to Instagram Sync', sub: 'Gmail to Instagram Sync' },
  ];

  const filteredConnected = connectedCards.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const issueCard = connectedCards.find(c => c.hasIssue);

  const getManageHighlights = (card: IntegrationCard) => {
    switch (card.id) {
      case 'facebook':
        return [
          'Zernio holds the connected Facebook account details and auth state.',
          'Use this panel to reconnect, review health, or disconnect the channel.',
          'Facebook supports page selection, inbox, comments, and review workflows.',
        ];
      case 'instagram':
        return [
          'Zernio manages the Instagram connection and profile identity.',
          'Reconnect here if permissions change or the token needs refreshing.',
          'Instagram supports inbox, comments, ice breakers, and profile actions.',
        ];
      case 'whatsapp':
        return [
          'This connection is now Zernio-backed instead of the old Meta SDK flow.',
          'Use this panel to reconnect or disconnect the business number binding.',
          'WhatsApp keeps inbox and automation workflows under one business profile.',
        ];
      case 'tiktok':
        return [
          'TikTok is connected through Zernio and stores creator metadata here.',
          'Reconnect from this panel if the account changes or permissions expire.',
          'TikTok inbox sync is not supported, so this connection is identity-only.',
        ];
      case 'telegram':
        return [
          'Telegram messages are routed through Zernio inbox webhooks.',
          'Use this panel to reconnect if the bot token or permissions change.',
          'Telegram supports live inbox sync and reply workflows.',
        ];
      case 'gmail':
        return [
          'This is currently display-only and does not run through Zernio.',
          'Use it as a placeholder for future mailbox automation and routing.',
          'No direct connection or disconnect action is available yet.',
        ];
      case 'google-business-profile':
        return [
          'Google Business Profile support is still coming soon.',
          'The future manage view will cover locations, reviews, and messaging.',
          'Connect is disabled until the provider flow is built out.',
        ];
      default:
        return ['Use this panel to review the channel connection and available options.'];
    }
  };

  return (
    <div className="w-full min-w-0 h-full overflow-y-auto bg-zinc-50">
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
        <div className="bg-white border border-zinc-200 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-6">Integrations Overview</h2>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-0">
            <div className="md:flex-1">
              <p className="text-sm text-zinc-500 mb-2">Active Connections:</p>
              <p className="text-3xl font-bold text-zinc-900">{connectedCards.filter(c => c.isConnected).length}</p>
            </div>
            <div className="hidden md:block h-9 w-px bg-zinc-200/70 mx-8 shrink-0" aria-hidden="true" />
            <div className="md:flex-1">
              <p className="text-sm text-zinc-500 mb-2">Integrations with Issues:</p>
              <p className="text-3xl font-bold text-red-600">
                {issueCard ? `1 (${issueCard.name})` : '0'}
              </p>
            </div>
            <div className="hidden md:block h-9 w-px bg-zinc-200/70 mx-8 shrink-0" aria-hidden="true" />
            <div className="md:flex-1">
              <p className="text-sm text-zinc-500 mb-2">New suggested integrations</p>
              <p className="text-3xl font-bold text-zinc-300">-</p>
            </div>
          </div>
        </div>

        {/* ALL INTEGRATIONS PANEL */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-lg font-bold text-zinc-900">All Integrations</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2.5 hover:bg-zinc-50"
              >
                Filter <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-zinc-900 mb-4">Connected</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredConnected.map((card) => {
              const isLoading = loading === card.id;
              const isExpanded = expandedCardId === card.id;
              const isGoogleBusinessProfile = card.id === 'google-business-profile';
              const canDisconnect = card.isReal && card.id !== 'google-business-profile' && card.id !== 'gmail';

              return (
                <div
                  key={card.id}
                  className={`border rounded-xl p-5 flex flex-col justify-between ${
                    card.hasIssue ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 flex items-center justify-center shrink-0 rounded-xl overflow-hidden border border-zinc-200">
                          <card.Icon size={56} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-zinc-900 leading-tight">{card.name}</h4>
                          <p className="text-sm text-zinc-500 leading-snug mt-0.5 max-w-[200px]">{card.description}</p>
                          {card.id === 'tiktok' && channelStatus.tiktok && (tiktokDisplayName || tiktokUsername) && (
                            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2">
                              <p className="text-[11px] font-semibold text-zinc-900">
                                {tiktokDisplayName || 'Connected creator'}
                                {tiktokVerified && <span className="ml-1 text-[#2ea66f]">Verified</span>}
                              </p>
                              {tiktokUsername && <p className="text-[11px] text-zinc-500">@{tiktokUsername}</p>}
                              <p className="mt-1 text-[10px] text-zinc-400">Connected through Zernio. TikTok inbox sync is not exposed by the provider.</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {card.hasIssue && <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />}
                    </div>

                    {card.hasIssue && (
                      <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Issue Detected
                      </p>
                    )}

                    {!isGoogleBusinessProfile && (
                      <div className="border-t border-zinc-200 mt-3 mb-4">
                        <div className="grid grid-cols-2 divide-x divide-zinc-200">
                          <div className="pt-3 pr-4">
                            <p className="text-xl font-bold text-zinc-900">{card.mappedFields}</p>
                            <p className="text-sm text-zinc-500">Mapped fields</p>
                          </div>
                          <div className="pt-3 pl-4">
                            <p className="text-xl font-bold text-zinc-900">{card.syncFrequency}</p>
                            <p className="text-sm text-zinc-500">Sync Frequency</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isGoogleBusinessProfile && (
                      <p className="text-sm text-zinc-400 italic mt-3 mb-4">Connect your Google Business Profile to manage listings and messages.</p>
                    )}
                  </div>

                  {isGoogleBusinessProfile ? (
                    <button
                      type="button"
                      disabled
                      className="text-sm font-semibold text-zinc-400 bg-zinc-100 rounded-lg px-3 py-3.5 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedCardId(prev => (prev === card.id ? null : card.id))}
                          className="text-sm font-semibold text-white bg-zinc-900 rounded-lg px-3 py-3.5 hover:bg-zinc-800 transition-colors"
                        >
                          {isExpanded ? 'Hide details' : 'Manage'}
                        </button>
                        <button
                          type="button"
                          onClick={() => canDisconnect ? handleZernioDisconnect(card.id as ZernioPlatform) : undefined}
                          disabled={!canDisconnect || !card.isConnected || isLoading}
                          className="text-sm font-semibold text-zinc-500 border border-zinc-200 rounded-lg px-3 py-3.5 hover:text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                        >
                          {isLoading ? 'Working…' : card.isConnected ? 'Disconnect' : 'Disconnected'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Manage connection</p>
                              <p className="text-sm font-semibold text-zinc-900 mt-1">
                                {card.isReal ? 'Connect and manage this channel through Zernio.' : 'This card is informational only for now.'}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                card.isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'
                              }`}
                            >
                              {card.isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {getManageHighlights(card).map((item) => (
                              <div key={item} className="flex items-start gap-2 text-xs text-zinc-600 leading-5">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>

                          {card.id === 'tiktok' && tiktokDisplayName && (
                            <div className="mt-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-500">
                              <p className="font-semibold text-zinc-900">
                                {tiktokDisplayName}
                                {tiktokVerified ? ' • Verified' : ''}
                              </p>
                              {tiktokUsername && <p>@{tiktokUsername}</p>}
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {card.isReal && card.onConnect && (
                              <button
                                type="button"
                                onClick={card.onConnect}
                                disabled={isLoading}
                                className="text-sm font-semibold text-white bg-[#795bf4] rounded-lg px-3 py-2.5 hover:bg-[#6a4de0] disabled:opacity-80 transition-colors"
                              >
                                {isLoading ? 'Connecting…' : card.isConnected ? 'Reconnect' : 'Connect'}
                              </button>
                            )}
                            {canDisconnect && (
                              <button
                                type="button"
                                onClick={() => handleZernioDisconnect(card.id as ZernioPlatform)}
                                disabled={!card.isConnected || isLoading}
                                className="text-sm font-semibold text-zinc-600 border border-zinc-200 rounded-lg px-3 py-2.5 hover:text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                              >
                                {isLoading ? 'Working…' : 'Disconnect'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {card.id === 'whatsapp' && (
                    <button
                      type="button"
                      onClick={() => setShowTroubleshoot(true)}
                      className="text-xs text-zinc-400 hover:text-zinc-700 mt-2 text-left"
                    >
                      Troubleshoot connection
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* INTEGRATION LOG */}
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Integration Log</h3>
              <div className="border border-zinc-200 rounded-xl p-5 h-full">
                <p className="text-sm text-zinc-500 mb-4">Recent Last API events</p>
                <p className="text-base text-red-600 font-semibold">Issues: {issueCard ? 1 : 0}</p>
                <p className="text-sm text-zinc-400 mt-1">events ali event sent ago</p>
              </div>
            </div>

            {/* WORKFLOW-ACTIVATED */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-900">Workflow-Activated</h3>
                <button type="button" className="text-sm font-semibold text-[#795bf4] hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {workflowItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-zinc-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-lg border border-zinc-200 overflow-hidden">
                        <item.Icon size={44} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-400">{item.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 whitespace-nowrap">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sync Status
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
