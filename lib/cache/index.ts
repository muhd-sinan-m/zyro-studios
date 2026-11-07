/**
 * ZYRO STUDIOS // SERVER-SIDE IN-MEMORY DATA CACHE
 * 
 * Provides ultra-fast in-memory caching with Time-To-Live (TTL), HTTP 304 ETag
 * negotiation, and instant mutation invalidation.
 * 
 * Prevents redundant database queries while ensuring fresh data is delivered
 * immediately when changes occur.
 */

interface CacheEntry<T> {
  data: T;
  version: number;
  etag: string;
  expiresAt: number;
  createdAt: number;
}

interface CacheStore {
  entries: Map<string, CacheEntry<any>>;
  versions: Map<string, number>;
}

// Global cache store across serverless warm instances and hot-reloads
const globalForCache = globalThis as unknown as {
  zyroDataCacheStore?: CacheStore;
};

const store: CacheStore =
  globalForCache.zyroDataCacheStore ?? {
    entries: new Map(),
    versions: new Map(),
  };

if (process.env.NODE_ENV !== "production") {
  globalForCache.zyroDataCacheStore = store;
}

export interface CacheOptions {
  ttlMs?: number;
  ifNoneMatch?: string | null;
}

export interface CacheResult<T> {
  data?: T;
  notModified: boolean;
  etag: string;
  version: number;
  isCached: boolean;
}

const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds default TTL

/**
 * Get cached data or execute fetcher function and cache the result.
 * Automatically handles HTTP 304 Not-Modified ETag matching.
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<CacheResult<T>> {
  const ttl = options.ttlMs ?? DEFAULT_TTL_MS;
  const ifNoneMatch = options.ifNoneMatch?.trim();
  const now = Date.now();

  const currentVersion = store.versions.get(key) ?? 1;
  const existing = store.entries.get(key) as CacheEntry<T> | undefined;

  // Check if cache entry is valid and version matches
  if (existing && existing.version === currentVersion && now < existing.expiresAt) {
    // If client supplied If-None-Match that matches existing ETag, return 304 Not Modified
    if (ifNoneMatch && (ifNoneMatch === existing.etag || ifNoneMatch === `W/${existing.etag}` || ifNoneMatch === "*")) {
      return {
        notModified: true,
        etag: existing.etag,
        version: existing.version,
        isCached: true,
      };
    }

    return {
      data: existing.data,
      notModified: false,
      etag: existing.etag,
      version: existing.version,
      isCached: true,
    };
  }

  // Cache MISS or Expired: fetch fresh data from database
  const freshData = await fetcher();
  const etag = `"${key}-v${currentVersion}-${now}"`;

  const newEntry: CacheEntry<T> = {
    data: freshData,
    version: currentVersion,
    etag,
    expiresAt: now + ttl,
    createdAt: now,
  };

  store.entries.set(key, newEntry);
  store.versions.set(key, currentVersion);

  return {
    data: freshData,
    notModified: false,
    etag,
    version: currentVersion,
    isCached: false,
  };
}

/**
 * Instantly invalidate cache keys when a mutation happens (INSERT, UPDATE, DELETE).
 * Increments the version counter so any pending ETags will mismatch and trigger fresh fetch.
 */
export function invalidateCache(keys: string | string[]): void {
  const targetKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of targetKeys) {
    const nextVersion = (store.versions.get(key) ?? 1) + 1;
    store.versions.set(key, nextVersion);
    store.entries.delete(key);
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  store.entries.clear();
  store.versions.clear();
}
