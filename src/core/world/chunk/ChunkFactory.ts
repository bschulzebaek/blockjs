import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import createMeshFromBuffer from '@/core/world/chunk/geometry/create-mesh-from-buffer';
import createMeshNaive from '@/core/world/chunk/geometry/create-mesh-naive';

export default class ChunkFactory {
    static create(x: number, z: number, blocks: BlockMap) {
        const chunk = new Chunk(x, z, blocks);

        createMeshNaive(chunk);

        return chunk;
    }

    static createFromPayload(payload: ChunkPayload) {
        const chunk = new Chunk(payload.x, payload.z, payload.blocks);

        createMeshFromBuffer(chunk, payload);

        return chunk;
    }
}