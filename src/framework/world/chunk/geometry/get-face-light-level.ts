import Chunk from '@/framework/world/chunk/Chunk';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';

export default function getFaceLightLevel(chunk: Chunk, x: number, y: number, z: number) {
    return chunk.getLightMap().get(ChunkUtils.localCoordinatesToBlockId(x, y, z)) ?? 0;
}