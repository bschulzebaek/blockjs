import ChunkRepository from '@/core/world/chunk/ChunkRepository';
import { BlockCache, GenerationCache } from '@/core/world/generation/worker/caches';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import generate from '@/core/world/generation/worker/generate';

const promises = new Map<string, Promise<any>>();

export default async function loadChunksIntoCache(repository: ChunkRepository, x: number, z: number, seed: string) {
    const id = ChunkUtils.toId(x, z);

    const chunkIds = [
        id,
        `${x + 1}:${z}`,
        `${x - 1}:${z}`,
        `${x}:${z + 1}`,
        `${x}:${z - 1}`,
    ];

    await Promise.all(chunkIds.map((chunkId) => {
        return new Promise(async (resolve) => {
            if (BlockCache.has(chunkId)) {
                resolve(null);
            }

            if (promises.has(chunkId)) {
                await promises.get(chunkId);

                resolve(null);
            }

            const promise = repository.read(chunkId);

            promises.set(chunkId, promise);

            const blocks = (await promise)?.blocks ?? ChunkUtils.getEmptyBlockMap();

            BlockCache.set(chunkId, blocks);

            resolve(null);
        });
    }));

    chunkIds.forEach((chunkId) => {
        if (GenerationCache.has(chunkId)) {
            return;
        }

        GenerationCache.set(chunkId, generate(new Map(BlockCache.get(chunkId)), chunkId, seed));
    });
}