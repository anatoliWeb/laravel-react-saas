/**
 * Simple cache helper (memory + localStorage).
 *
 * WHY:
 * Memory cache gives instant access during SPA navigation,
 * while localStorage preserves data across reloads.
 */

const CACHE_PREFIX = 'app_cache_';
const memoryCache = new Map();

/**
 * Save data with TTL
 */
export function setCache(key, data, ttlMs = 60000) {
    const payload = {
        data,
        expiry: Date.now() + ttlMs,
    };

    memoryCache.set(key, payload);

    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
    } catch {
        // Ignore storage quota / privacy mode failures.
    }
}

/**
 * Get cached data
 */
export function getCache(key) {
    const inMemory = memoryCache.get(key);
    if (inMemory) {
        if (Date.now() <= inMemory.expiry) {
            return inMemory.data;
        }

        memoryCache.delete(key);
    }

    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);

        if (Date.now() > parsed.expiry) {
            // WHY:
            // Expired entries are removed eagerly to prevent stale reads
            // and keep localStorage footprint bounded over time.
            localStorage.removeItem(CACHE_PREFIX + key);
            memoryCache.delete(key);
            return null;
        }

        memoryCache.set(key, parsed);
        return parsed.data;
    } catch {
        return null;
    }
}

/**
 * Compare previous and next payload to avoid unnecessary state updates.
 */
export function isDataDifferent(previous, next) {
    return JSON.stringify(previous ?? null) !== JSON.stringify(next ?? null);
}
