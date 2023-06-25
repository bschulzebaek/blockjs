import Chunk from '@/core/world/Chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkPayload, { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';
import createGeometry from '@/core/world/generation/utility/create-geometry';

onmessage = async (event: MessageEvent<GeneratorMessagePayload>) => {
    const chunk = await generate(event.data);

    response(chunk);
};

function getBuffer(geometry: ChunkGeometryData): ArrayBuffer[] {
    return [
        geometry.transparent.color.buffer,
        geometry.transparent.normal.buffer,
        geometry.transparent.position.buffer,
        geometry.transparent.uv.buffer,
        geometry.opaque.color.buffer,
        geometry.opaque.normal.buffer,
        geometry.opaque.position.buffer,
        geometry.opaque.uv.buffer,
    ]
}

function response(chunk: Chunk) {
    const payload: ChunkPayload = {
        x: chunk.getX(),
        z: chunk.getZ(),
        blocks: chunk.getBlocks(),
        geometries: createGeometry(chunk),
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
        default:
            throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
    }

    return await generator;
}