import { LOG_CHUNK_GENERATION_TIME } from '@/configuration';
import GeneratorMessagePayload from '@/world/generation/worker/GeneratorMessagePayload';
import { BlockCache, GenerationCache } from '@/world/generation/worker/caches';
import ChunkRepository from '@/world/chunk/ChunkRepository';
import loadChunksIntoCache from '@/world/generation/worker/load-chunks-into-cache';
import Chunk from '@/world/chunk/Chunk';
import ChunkFactory from '@/world/chunk/ChunkFactory';
import getMergedBlocks from '@/world/generation/worker/get-merged-blocks';
import createBuffer from '@/world/chunk/geometry/create-buffer';
import getBlockFromCache from '@/world/generation/worker/get-block-from-cache';
import keepCacheLimit from '@/world/generation/worker/keep-cache-limit';
import { ChunkGeometryData } from '@/world/generation/worker/ChunkPayload';

let repository: ChunkRepository;

export default function processGeneration({ id, x, z, seed, uuid }: GeneratorMessagePayload) {
    const start = performance.now();

    if (!repository) {
        repository = new ChunkRepository(uuid);
    }

    return new Promise(async (resolve) => {

        const xInt = parseInt(x, 10);
        const zInt = parseInt(z, 10);

        await loadChunksIntoCache(repository, xInt, zInt, seed);

        let chunk: Chunk | undefined = undefined;

        try {
            chunk = ChunkFactory.createWithoutMesh(xInt, zInt, getMergedBlocks(id, seed));
        } catch (e) {
            postMessage({
                x,
                z,
                failed: true,
            });

            return resolve(null);
        }

        const response = {
            x,
            z,
            blocks: chunk.getBlocks(),
            geometries: createBuffer(chunk, getBlockFromCache),
        };

        // @ts-ignore
        postMessage(response, getTransferable(response.geometries));

        resolve(null);

        keepCacheLimit(BlockCache);
        keepCacheLimit(GenerationCache);

        if (LOG_CHUNK_GENERATION_TIME) {
            console.debug(`[Chunk ${id}] generated in ${((performance.now() - start) / 1000).toFixed(3)}s`);
        }
    });
}

function getTransferable(geometry: ChunkGeometryData): ArrayBuffer[] {
    return [
        geometry.transparent.color,
        geometry.transparent.normal,
        geometry.transparent.position,
        geometry.transparent.uv,
        geometry.opaque.color,
        geometry.opaque.normal,
        geometry.opaque.position,
        geometry.opaque.uv,
    ]
}