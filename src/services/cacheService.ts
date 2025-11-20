import type { CacheEntry } from '@/types/lesson'

/**
 * Simple in-memory cache service with TTL support
 */
class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 1000 * 60 * 30 // 30 minutes

  /**
   * Get cached value if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set cache value with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = ttl || this.defaultTTL
      ? Date.now() + (ttl || this.defaultTTL)
      : undefined

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    })
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Remove specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const entry of this.cache.values()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService()

// Run cleanup every 5 minutes
setInterval(() => cacheService.cleanup(), 1000 * 60 * 5)
