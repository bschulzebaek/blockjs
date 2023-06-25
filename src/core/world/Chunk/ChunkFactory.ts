import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import ChunkGeometry from '@/core/world/Chunk/ChunkGeometry';
import Chunk, { BlockMap } from '@/core/world/Chunk/Chunk';

export default class ChunkFactory {
    static create(x: number, z: number, blocks: BlockMap) {
        const chunk = new Chunk(x, z, blocks);
        ChunkGeometry.build(chunk);

        return chunk;
    }

    static createFromPayload(payload: ChunkPayload) {
        const chunk = new Chunk(payload.x, payload.z, payload.blocks);
        ChunkGeometry.buildFromPayload(chunk, payload);

        return chunk;
    }
}