import { MAX_CHUNK_CACHE } from '@/configuration';

export default function keepCacheLimit(cache: Map<string, unknown>) {
    if (cache.size < MAX_CHUNK_CACHE) {
        return;
    }

    const keys = Array.from(cache.keys());

    const key = keys[Math.floor(Math.random() * keys.length)]; // todO: remove distant chunks first!
    cache.delete(key);
}