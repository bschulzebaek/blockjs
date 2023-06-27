import createMeshNaive from '@/core/world/chunk/geometry/create-mesh-naive';
import Chunk from '@/core/world/chunk/Chunk';

export default function updateMeshInstance(chunk: Chunk) {
    // TODO Performance: Find a way to apply changes without recreating all Meshes from scratch
    createMeshNaive(chunk);
}