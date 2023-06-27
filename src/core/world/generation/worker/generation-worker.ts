import Chunk from '@/core/world/chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';
import generationV3 from '@/core/world/generation/v3';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkPayload, { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';
import createBuffer from '@/core/world/chunk/geometry/create-buffer';

onmessage = async (event: MessageEvent<GeneratorMessagePayload>) => {
    const chunk = await generate(event.data);

    response(chunk);
};

function getBuffer(geometry: ChunkGeometryData): ArrayBuffer[] {
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

function response(chunk: Chunk) {
    const payload: ChunkPayload = {
        x: chunk.getX(),
        z: chunk.getZ(),
        blocks: chunk.getBlocks(),
        geometries: createBuffer(chunk),
    };

    // @ts-ignore
    postMessage(payload, getBuffer(payload.geometries));

    close();
}

async function generate({ seed, x, z, uuid }: GeneratorMessagePayload): Promise<Chunk> {
    let generator = null;

    switch (WORLD_GENERATION_VERSION) {
        case 1:
            generator = generationV1(x, z, seed, uuid);
            break;
        case 2:
            generator = generationV2(x, z, seed, uuid);
            break;
        case 3:
            generator = generationV3(x, z, seed, uuid);
            break;
        default:
            throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
    }

    return await generator;
}