import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkPayload, { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';
import createBuffer from '@/core/world/chunk/geometry/create-buffer';
import WorldAccessor from '@/core/world/generation/WorldAccessor';
import generate from '@/core/world/generation/worker/generate';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';

onmessage = async (event: MessageEvent<GeneratorMessagePayload>) => {
    const accessor = new WorldAccessor(event.data);
    await accessor.createMap();

    const blockMaps = accessor.getChunkMap();

    blockMaps.forEach((blocks, chunkId) => {
        generate(blocks, chunkId, event.data.seed);
    });

    const mainChunk = accessor.getMainChunk();
    const chunk = ChunkFactory.createWithoutMesh(parseInt(event.data.x), parseInt(event.data.z), mainChunk);

    const payload: ChunkPayload = {
        x: chunk.getX(),
        z: chunk.getZ(),
        blocks: chunk.getBlocks(),
        geometries: createBuffer(chunk, accessor),
    };

    // @ts-ignore
    postMessage(payload, getTransferable(payload.geometries));

    close();
};

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