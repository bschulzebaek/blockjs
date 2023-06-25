import Chunk from '@/core/world/Chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkPayload, { ChunkGeometryData, GeometryData } from '@/core/world/generation/worker/ChunkPayload';
import { Mesh } from 'three';
import ChunkGeometry from '@/core/world/Chunk/ChunkGeometry';

onmessage = (event: MessageEvent<GeneratorMessagePayload>) => {
    generate(event.data);
}

function extractGeometry(mesh: Mesh): GeometryData {
    return {
        position: mesh.geometry.getAttribute('position').array as Float32Array,
        normal: mesh.geometry.getAttribute('normal').array as Float32Array,
        color: mesh.geometry.getAttribute('color').array as Float32Array,
        uv: mesh.geometry.getAttribute('uv').array as Float32Array,
    }
}

function getTransferables(geometry: ChunkGeometryData): Transferable[] {
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
    ChunkGeometry.build(chunk);

    const geometries: ChunkGeometryData = {
        opaque: extractGeometry(chunk.children[0] as Mesh),
        transparent: extractGeometry(chunk.children[1] as Mesh),
    };

    const payload: ChunkPayload = {
        x: chunk.getX(),
        z: chunk.getZ(),
        blocks: chunk.getBlocks(),
        geometries,
    };

    // @ts-ignore
    postMessage(payload, getTransferables(geometries));
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