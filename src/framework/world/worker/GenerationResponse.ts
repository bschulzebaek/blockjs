import type { ChunkGeometryBuffer } from '../geometry/ChunkGeometryBuffer.ts';

type GenerationResponse = {
    x: number;
    y: number;
    z: number;
    blocks: Uint8Array;
    transparent: ChunkGeometryBuffer;
    opaque: ChunkGeometryBuffer;
}

export default GenerationResponse;