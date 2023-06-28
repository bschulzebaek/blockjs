import createMeshNaive from '@/core/world/chunk/geometry/create-mesh-naive';
import Chunk from '@/core/world/chunk/Chunk';
import GlobalState from '@/core/GlobalState';
import World from '@/core/world/World';

export default function updateMeshInstance(chunk: Chunk) {
    // TODO Performance: Find a way to apply changes without recreating all Meshes from scratch
    createMeshNaive(chunk, GlobalState.getScene().getObjectByName('world') as World);
}