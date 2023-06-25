import Chunk from '@/core/world/Chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkPayload, { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';
import createGeometry from '@/core/world/generation/utility/create-geometry';

onmessage = (event: MessageEvent<GeneratorMessagePayload>) => {
    generate(event.data);
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

    self.close();
}

function generate({ seed, x, z }: GeneratorMessagePayload) {
    switch (WORLD_GENERATION_VERSION) {
        case 1:
            return response(generationV1(x, z, seed)!);
        case 2:
            return response(generationV2(x, z, seed)!);
        default:
            throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
    }
}