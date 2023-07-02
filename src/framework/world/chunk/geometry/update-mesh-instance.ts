import Chunk from '@/framework/world/chunk/Chunk';
import GlobalState from '@/engine/worker/states/GlobalState';
import createBuffer from '@/framework/world/chunk/geometry/create-buffer';
import createMeshFromBuffer from '@/framework/world/chunk/geometry/create-mesh-from-buffer';
import ProcessingQueue from '@/shared/utility/ProcessingQueue';

const queue = new ProcessingQueue<Chunk>(_updateMeshInstance);

export default function updateMeshInstance(chunk: Chunk) {
    GlobalState.getGenerator().invalidate(chunk.getChunkId());
    queue.addData(chunk);

    // TODO: Update local LightMap by using "propagateNeighbours" function from src\framework\light\create-light-map.ts
}

function _updateMeshInstance(chunk: Chunk) {
    return new Promise((resolve) => {
        setTimeout(() => {
            chunk.children = [];

            const buffer = createBuffer(chunk, GlobalState.getWorld().getBlockByCoordinates);

            createMeshFromBuffer(chunk, buffer);

            resolve(null);
        });
    });
}