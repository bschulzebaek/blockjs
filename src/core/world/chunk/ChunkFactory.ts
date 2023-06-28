import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import createMeshFromBuffer from '@/core/world/chunk/geometry/create-mesh-from-buffer';

export default class ChunkFactory {
    static createFromPayload(payload: ChunkPayload) {
        const chunk = new Chunk(payload.x, payload.z, payload.blocks);

        createMeshFromBuffer(chunk, payload);

        return chunk;
    }

    static createWithoutMesh(x: number, z: number, blocks: BlockMap) {
        return new Chunk(x, z, blocks);
    }
}