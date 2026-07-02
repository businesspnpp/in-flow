type CacheEnvelope<T> = {
  value: T;
  expiresAt: number;
};

function hasWindow() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function readClientCache<T>(key: string): T | null {
  if (!hasWindow()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed !== 'object') return null;

    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
}

export function writeClientCache<T>(key: string, value: T, ttlMs: number) {
  if (!hasWindow()) return;

  const envelope: CacheEnvelope<T> = {
    value,
    expiresAt: Date.now() + Math.max(1, ttlMs),
  };

  try {
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Storage is best-effort and should never break rendering.
  }
}
