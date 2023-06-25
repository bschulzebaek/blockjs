import { BlockMap } from '@/core/world/Chunk/Chunk';

export interface GeometryData {
    position: Float32Array;
    normal: Float32Array;
    uv: Float32Array;
    color: Float32Array;
}

export interface ChunkGeometryData {
    opaque: GeometryData;
    transparent: GeometryData;
}

export default interface ChunkPayload {
    x: number;
    z: number;
    blocks: BlockMap;
    geometries: ChunkGeometryData;
}