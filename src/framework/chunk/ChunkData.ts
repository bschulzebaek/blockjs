import type ChunkGeometryBuffer from './ChunkGeometryBuffer.ts';

type ChunkData = {
    x: number;
    y: number;
    z: number;
    blocks: Uint8Array;
    transparent: ChunkGeometryBuffer;
    opaque: ChunkGeometryBuffer;
}

export {
    type ChunkData as default,
}
