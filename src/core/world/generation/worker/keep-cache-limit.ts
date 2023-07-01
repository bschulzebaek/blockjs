import { CHUNK_CACHE_LIMIT } from '@/configuration';

export default function keepCacheLimit(cache: Map<string, unknown>) {
    while (cache.size >= CHUNK_CACHE_LIMIT) {
        deleteChunkFromCache(cache);
    }
}

function deleteChunkFromCache(cache: Map<string, unknown>) {
    cache.delete(getRandomKey(cache));
}

function getRandomKey(cache: Map<string, unknown>): string {
    const keys = Array.from(cache.keys());

    return keys[Math.floor(Math.random() * keys.length)];
}