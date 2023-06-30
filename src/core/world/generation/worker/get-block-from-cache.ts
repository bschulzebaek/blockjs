import Block from '@/core/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import { BlockCache } from '@/core/world/generation/worker/caches';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import strictModulo from '@/utility/strict-modulo';

export default function getBlockFromCache(x: number, y: number, z: number): Block | undefined {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkZ = Math.floor(z / CHUNK_SIZE);

    const blockMap = BlockCache.get(ChunkUtils.toId(chunkX, chunkZ));

    if (!blockMap) {
        return undefined;
    }

    return blockMap.get(`${strictModulo(x, CHUNK_SIZE)}:${y}:${strictModulo(z, CHUNK_SIZE)}`);
}