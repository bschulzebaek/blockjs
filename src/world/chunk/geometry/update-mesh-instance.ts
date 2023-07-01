import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import Chunk from '@/world/chunk/Chunk';
import GlobalState from '@/engine/worker/states/GlobalState';
import createBuffer from '@/world/chunk/geometry/create-buffer';
import { BufferAttribute, BufferGeometry, Mesh } from 'three';
import materials from '@/world/chunk/geometry/materials';
import ProcessingQueue from '@/shared/utility/ProcessingQueue';

const queue = new ProcessingQueue<Chunk>(_updateMeshInstance);

function setAttribute(name: string, geometry: BufferGeometry, buffer: ArrayBufferLike, size: number) {
    geometry.setAttribute(name, new BufferAttribute(new Float32Array(buffer), size));
}

export default function updateMeshInstance(chunk: Chunk) {
    queue.addData(chunk);
}

function _updateMeshInstance(chunk: Chunk) {
    return new Promise((resolve) => {
        setTimeout(() => {
            ServiceRegistry.getWorldService().invalidate(chunk.getChunkId());

            chunk.children = [];

            const buffer = createBuffer(chunk, GlobalState.getWorld().getBlock);

            const geometryOpaque = new BufferGeometry();
            geometryOpaque.name = 'opaque';
            setAttribute('position', geometryOpaque, buffer.opaque.position, 3);
            setAttribute('normal', geometryOpaque, buffer.opaque.normal, 3);
            setAttribute('uv', geometryOpaque, buffer.opaque.uv, 2);
            setAttribute('color', geometryOpaque, buffer.opaque.color, 3);

            chunk.add(new Mesh(geometryOpaque, materials.opaque));

            const geometryTransparent = new BufferGeometry();
            geometryOpaque.name = 'transparent';
            setAttribute('position', geometryTransparent, buffer.transparent.position, 3);
            setAttribute('normal', geometryTransparent, buffer.transparent.normal, 3);
            setAttribute('uv', geometryTransparent, buffer.transparent.uv, 2);
            setAttribute('color', geometryTransparent, buffer.transparent.color, 3);

            chunk.add(new Mesh(geometryTransparent, materials.transparent));

            resolve(null);
        });
    });
}