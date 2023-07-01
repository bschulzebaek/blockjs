import ChunkPayload from '@/world/generation/worker/ChunkPayload';
import Chunk, { BlockMap } from '@/world/chunk/Chunk';
import createMeshFromBuffer from '@/world/chunk/geometry/create-mesh-from-buffer';

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