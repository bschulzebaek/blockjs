import Block from '@/framework/world/block/Block';
import { BlockCache, GenerationCache } from '@/framework/world/generation/worker/caches';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';

export default function getBlockFromCache(x: number, y: number, z: number): Block | undefined {
    if (y === 0) {
        return undefined;
    }

    const chunkId = ChunkUtils.worldCoordinatesToChunkId(x, z);
    const blockId = ChunkUtils.worldCoordinatesToBlockId(x, y, z);

    const blockMap = BlockCache.get(chunkId);

    if (blockMap && blockMap.has(blockId)) {
        return blockMap.get(blockId);
    }

    const generatedMap = GenerationCache.get(chunkId);

    if (generatedMap && generatedMap.has(blockId)) {
        return generatedMap.get(blockId);
    }

    return undefined;
}