import { supabase } from '@/lib/supabase';

export async function resolveBusinessId(): Promise<string | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id')
    .limit(1)
    .single();

  if (error || !data?.id) {
    return null;
  }

  return data.id;
}

export function createShortToken(length = 10): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let token = '';

  for (let i = 0; i < length; i += 1) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return token;
}

export function buildPublicLink(pathname: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://inflow.to';

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
