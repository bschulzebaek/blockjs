import type ChunkGeometryBuffer from './ChunkGeometryBuffer.ts';

type ChunkGeometry = {
    opaque: ChunkGeometryBuffer;
    transparent: ChunkGeometryBuffer;
}

export {
    type ChunkGeometry as default
}