import ChunkPayload from '@/framework/world/generation/worker/ChunkPayload';
import Chunk, { BlockMap } from '@/framework/world/chunk/Chunk';
import createMeshFromBuffer from '@/framework/world/chunk/geometry/create-mesh-from-buffer';

export default class ChunkFactory {
    static createFromPayload(payload: ChunkPayload) {
        const chunk = new Chunk(payload.x, payload.z, payload.blocks);

        createMeshFromBuffer(chunk, payload.geometries);

        return chunk;
    }

    static createWithoutMesh(x: number, z: number, blocks: BlockMap) {
        return new Chunk(x, z, blocks);
    }
}