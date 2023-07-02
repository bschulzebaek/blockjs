import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { BlockCache, GenerationCache } from '@/framework/world/generation/worker/caches';
import { BlockMap } from '@/framework/world/chunk/Chunk';
import generate from '@/framework/world/generation/worker/generate';

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