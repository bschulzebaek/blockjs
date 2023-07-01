import { BlockMap } from '@/core/world/chunk/Chunk';

export interface GeometryBuffer {
    position: ArrayBufferLike;
    normal: ArrayBufferLike;
    uv: ArrayBufferLike;
    color: ArrayBufferLike;
}

export interface ChunkGeometryData {
    opaque: GeometryBuffer;
    transparent: GeometryBuffer;
}

export default interface ChunkPayload {
    x: number;
    z: number;
    blocks: BlockMap;
    geometries: ChunkGeometryData;
    failed?: boolean;
}