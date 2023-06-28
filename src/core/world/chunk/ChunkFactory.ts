import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import createMeshFromBuffer from '@/core/world/chunk/geometry/create-mesh-from-buffer';
import createMeshNaive from '@/core/world/chunk/geometry/create-mesh-naive';
import World from '@/core/world/World';

export default class ChunkFactory {
    static createLocal(x: number, z: number, blocks: BlockMap, world: World) {
        const chunk = new Chunk(x, z, blocks);

        createMeshNaive(chunk, world);

        return chunk;
    }

    static createFromPayload(payload: ChunkPayload) {
        const chunk = new Chunk(payload.x, payload.z, payload.blocks);

        createMeshFromBuffer(chunk, payload);

        return chunk;
    }

    static createInWorker(x: number, z: number, blocks: BlockMap) {
        return new Chunk(x, z, blocks);
    }
}