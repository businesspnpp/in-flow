const ZERNIO_API_BASE_URL = process.env.ZERNIO_API_BASE_URL ?? 'https://zernio.com/api/v1';

type ZernioRequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: Record<string, unknown>;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

type ZernioProfile = {
  _id: string;
  name?: string;
};

type ZernioAccount = {
  _id: string;
  platform?: string;
  username?: string;
  displayName?: string;
  profileUrl?: string;
  isActive?: boolean;
};

type ZernioConnectUrlResponse = {
  authUrl: string;
  state?: string;
};

type ZernioWebhook = {
  _id: string;
  name?: string;
  url?: string;
  events?: string[];
  isActive?: boolean;
};

type ZernioCreateWebhookResponse = {
  success?: boolean;
  webhook?: ZernioWebhook;
};

type ZernioTikTokCreatorInfo = {
  creator?: {
    nickname?: string;
    avatarUrl?: string;
    isVerified?: boolean;
    canPostMore?: boolean;
  };
};

function getZernioApiKey() {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error('ZERNIO_API_KEY is not configured.');
  }

  return apiKey;
}

async function zernioRequest<T>(path: string, options: ZernioRequestOptions = {}): Promise<T> {
  const apiKey = getZernioApiKey();
  const url = new URL(path, ZERNIO_API_BASE_URL.endsWith('/') ? ZERNIO_API_BASE_URL : `${ZERNIO_API_BASE_URL}/`);

  Object.entries(options.searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      (typeof json?.error === 'string' && json.error) ||
      (typeof json?.message === 'string' && json.message) ||
      `Zernio request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json as T;
}

export async function listZernioProfiles() {
  const response = await zernioRequest<{ profiles?: ZernioProfile[] }>('profiles');
  return response.profiles ?? [];
}

export async function createZernioProfile(name: string, description?: string) {
  try {
    const response = await zernioRequest<{ profile?: ZernioProfile; message?: string }>('profiles', {
      method: 'POST',
      body: {
        name,
        description,
      },
    });

    if (!response.profile?._id) {
      throw new Error('Zernio did not return a profile id.');
    }

    return response.profile;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (!/already exists/i.test(message)) {
      throw error;
    }

    const existingProfiles = await listZernioProfiles();
    const existingProfile = existingProfiles.find((profile) => profile.name === name);

    if (!existingProfile?._id) {
      throw error;
    }

    return existingProfile;
  }
}

export async function getZernioConnectUrl(platform: string, profileId: string, redirectUrl: string) {
  const response = await zernioRequest<ZernioConnectUrlResponse>(`connect/${platform}`, {
    searchParams: {
      profileId,
      redirect_url: redirectUrl,
    },
  });

  if (!response.authUrl) {
    throw new Error('Zernio did not return an auth URL.');
  }

  return response;
}

export async function listZernioAccounts(profileId: string, platform?: string) {
  const response = await zernioRequest<{ accounts?: ZernioAccount[] }>('accounts', {
    searchParams: {
      profileId,
      platform,
    },
  });

  return response.accounts ?? [];
}

export async function getZernioTikTokCreatorInfo(accountId: string) {
  return zernioRequest<ZernioTikTokCreatorInfo>(`accounts/${accountId}/tiktok/creator-info`);
}

export async function deleteZernioAccount(accountId: string) {
  return zernioRequest<void>(`accounts/${accountId}`, {
    method: 'DELETE',
  });
}

export async function listZernioWebhooks() {
  const response = await zernioRequest<{ webhooks?: ZernioWebhook[] }>('webhooks/settings');
  return response.webhooks ?? [];
}

export async function createZernioWebhookSettings(options: {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive?: boolean;
}) {
  const response = await zernioRequest<ZernioCreateWebhookResponse>('webhooks/settings', {
    method: 'POST',
    body: {
      name: options.name,
      url: options.url,
      events: options.events,
      secret: options.secret,
      isActive: options.isActive ?? true,
    },
  });

  if (!response.webhook?._id) {
    throw new Error('Zernio did not return a webhook id.');
  }

  return response.webhook;
}

export async function ensureZernioInboxWebhook(options: { name: string; url: string; secret?: string }) {
  const events = ['message.received', 'conversation.started'];
  const existing = await listZernioWebhooks();

  if (existing.some((webhook) => webhook.url === options.url)) {
    return existing.find((webhook) => webhook.url === options.url) ?? null;
  }

  return createZernioWebhookSettings({
    name: options.name,
    url: options.url,
    events,
    secret: options.secret,
    isActive: true,
  });
}