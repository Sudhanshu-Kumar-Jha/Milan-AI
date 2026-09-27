interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  keysCount: number;
}

export class MemoryCache {
  private store: Map<string, CacheItem<any>> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private maxItems: number;

  constructor(maxItems: number = 500) {
    this.maxItems = maxItems;
    // Auto purge expired items every 2 minutes to maintain lean memory footprint
    setInterval(() => this.purgeExpired(), 120000).unref?.();
  }

  /**
   * Retrieve cached value if present and not expired
   */
  public get<T = any>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) {
      this.misses++;
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return item.value as T;
  }

  /**
   * Store value with Time-To-Live (seconds)
   */
  public set<T = any>(key: string, value: T, ttlSeconds: number = 60): void {
    if (this.store.size >= this.maxItems) {
      this.purgeOldest();
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Delete specific key
   */
  public del(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Invalidate all keys matching a given prefix (e.g. 'matches:feed:')
   */
  public delByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Flush entire cache
   */
  public flush(): void {
    this.store.clear();
  }

  /**
   * Purge expired items
   */
  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Evict earliest inserted key if maxItems threshold is reached
   */
  private purgeOldest(): void {
    const firstKey = this.store.keys().next().value;
    if (firstKey) {
      this.store.delete(firstKey);
    }
  }

  public getStats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.store.size,
    };
  }
}

// Global server memory cache singleton instance
export const serverCache = new MemoryCache(1000);
