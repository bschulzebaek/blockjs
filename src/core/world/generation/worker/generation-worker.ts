import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkRepository from '@/core/world/chunk/ChunkRepository';
import getBlockFromCache from '@/core/world/generation/worker/get-block-from-cache';
import { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';
import MessagePayload from '@/core/messages/payloads/MessagePayload';
import { BlockCache, GenerationCache } from '@/core/world/generation/worker/caches';
import loadChunksIntoCache from '@/core/world/generation/worker/load-chunks-into-cache';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import { BlockMap } from '@/core/world/chunk/Chunk';
import createBuffer from '@/core/world/chunk/geometry/create-buffer';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

let repository: ChunkRepository;

onmessage = (event: MessageEvent<MessagePayload>) => {
    const payload = event.data.payload as GeneratorMessagePayload;

    switch (event.data.action) {
        case CoreWorkerMessages.CHUNK_INVALIDATE:
            BlockCache.delete(payload.id);
            break;
        case CoreWorkerMessages.CHUNK_GENERATE:
            processGeneration(payload as GeneratorMessagePayload);
            break;
        default:
            throw new Error(`Unknown action "${event.data.action}"`);
    }
};

function processGeneration({ id, x, z, seed, uuid }: GeneratorMessagePayload) {
    setTimeout(async () => {
        if (!repository) {
            repository = new ChunkRepository(uuid);
        }

        const xInt = parseInt(x, 10);
        const zInt = parseInt(z, 10);

        await loadChunksIntoCache(repository, xInt, zInt, seed);

        const chunk = ChunkFactory.createWithoutMesh(xInt, zInt, new Map([
            // @ts-ignore
            ...GenerationCache.get(id),
            // @ts-ignore
            ...BlockCache.get(id),
        ]) as BlockMap);

        const response = {
            x,
            z,
            blocks: chunk.getBlocks(),
            geometries: createBuffer(chunk, getBlockFromCache),
        };

        // @ts-ignore
        postMessage(response, getTransferable(response.geometries));
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