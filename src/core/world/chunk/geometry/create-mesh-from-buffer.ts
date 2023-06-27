import Chunk from '@/core/world/chunk/Chunk';
import ChunkPayload, { GeometryBuffer } from '@/core/world/generation/worker/ChunkPayload';
import { BufferAttribute, BufferGeometry, Mesh } from 'three';
import materials, { MaterialName } from '@/core/world/chunk/geometry/materials';

enum Attributes {
    POSITION = 'position',
    NORMAL = 'normal',
    COLOR = 'color',
    UV = 'uv',
}

export default function createMeshFromBuffer(chunk: Chunk, payload: ChunkPayload) {
    Object.entries(payload.geometries).forEach(([materialName, geometry]: [materialName: string, geometry: GeometryBuffer]) => {
        const bufferGeometry = new BufferGeometry();

        bufferGeometry.setAttribute(Attributes.POSITION, new BufferAttribute(new Float32Array(geometry[Attributes.POSITION]), 3));
        bufferGeometry.setAttribute(Attributes.NORMAL, new BufferAttribute(new Float32Array(geometry[Attributes.NORMAL]), 3));
        bufferGeometry.setAttribute(Attributes.UV, new BufferAttribute(new Float32Array(geometry[Attributes.UV]), 2));
        bufferGeometry.setAttribute(Attributes.COLOR, new BufferAttribute(new Float32Array(geometry[Attributes.COLOR]), 3));

        chunk.add(new Mesh(bufferGeometry, materials[materialName as MaterialName]));
    });
}