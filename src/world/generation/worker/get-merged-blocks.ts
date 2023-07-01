import ChunkUtils from '@/world/chunk/ChunkUtils';
import { BlockCache, GenerationCache } from '@/world/generation/worker/caches';
import { BlockMap } from '@/world/chunk/Chunk';
import generate from '@/world/generation/worker/generate';

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