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
    'https://dock.to';

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function ensureChatExists(
  chatId: string,
  options?: {
    name?: string | null;
    lastMessage?: string | null;
  }
): Promise<void> {
  const { error } = await supabase.from('chats').upsert(
    {
      id: chatId,
      name: options?.name ?? chatId,
      last_message: options?.lastMessage ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw new Error(`Failed to ensure chat exists: ${error.message}`);
  }
}

export function isMissingTableError(error: unknown, tableName: string): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as { code?: string; message?: string; details?: string; hint?: string };
  const blob = `${err.code ?? ''} ${err.message ?? ''} ${err.details ?? ''} ${err.hint ?? ''}`.toLowerCase();
  const table = tableName.toLowerCase();

  return (
    blob.includes(table) &&
    (blob.includes('404') ||
      blob.includes('not found') ||
      blob.includes('does not exist') ||
      blob.includes('could not find the table') ||
      blob.includes('schema cache') ||
      blob.includes('pgrst'))
  );
}
