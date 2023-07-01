import Block from '@/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import { BlockCache, GenerationCache } from '@/world/generation/worker/caches';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import strictModulo from '@/shared/math/strict-modulo';

export default function getBlockFromCache(x: number, y: number, z: number): Block | undefined {
    if (y === 0) {
        return undefined;
    }

    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkZ = Math.floor(z / CHUNK_SIZE);

    const _x = strictModulo(x, CHUNK_SIZE);
    const _z = strictModulo(z, CHUNK_SIZE);

    const id = `${_x}:${y}:${_z}`;

    const blockMap = BlockCache.get(ChunkUtils.toId(chunkX, chunkZ));

    if (blockMap && blockMap.has(id)) {
        return blockMap.get(id);
    }

    const generatedMap = GenerationCache.get(ChunkUtils.toId(chunkX, chunkZ));

    if (generatedMap && generatedMap.has(id)) {
        return generatedMap.get(id);
    }

    return undefined;
}