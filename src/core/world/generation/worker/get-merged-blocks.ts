import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import { BlockCache, GenerationCache } from '@/core/world/generation/worker/caches';
import { BlockMap } from '@/core/world/chunk/Chunk';
import generate from '@/core/world/generation/worker/generate';

export default function getMergedBlocks(id: string, seed: string) {
    const placed = BlockCache.get(id) ?? ChunkUtils.getEmptyBlockMap();
    const generated = GenerationCache.get(id) ?? generate(placed, id, seed);

    return new Map([
        // @ts-ignore
        ...placed,
        // @ts-ignore
        ...generated
    ]) as BlockMap
}