import Chunk from '@/framework/world/chunk/Chunk';

/**
 * Since the World is referencing this cache indirectly, they will always be in sync. No need to invalidate Chunks after updating them.
 */
export const LocalChunkCache = new Map<string, Chunk>();