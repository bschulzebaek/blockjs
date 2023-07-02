import Chunk from '@/framework/world/chunk/Chunk';
import ChunkGeometryAttributes from '@/framework/world/chunk/geometry/chunk-geometry-attributes';
import { GeometryBuffer, ChunkGeometryData } from '@/framework/world/generation/worker/ChunkPayload';
import { BufferAttribute, BufferGeometry, Mesh } from 'three';
import materials, { MaterialName } from '@/framework/world/chunk/geometry/materials';

export default function createMeshFromBuffer(chunk: Chunk, buffer: ChunkGeometryData) {
    Object.entries(buffer).forEach(([materialName, geometry]: [materialName: string, geometry: GeometryBuffer]) => {
        const bufferGeometry = new BufferGeometry();

        bufferGeometry.setAttribute(ChunkGeometryAttributes.POSITION, new BufferAttribute(new Float32Array(geometry[ChunkGeometryAttributes.POSITION]), 3));
        bufferGeometry.setAttribute(ChunkGeometryAttributes.NORMAL, new BufferAttribute(new Float32Array(geometry[ChunkGeometryAttributes.NORMAL]), 3));
        bufferGeometry.setAttribute(ChunkGeometryAttributes.UV, new BufferAttribute(new Float32Array(geometry[ChunkGeometryAttributes.UV]), 2));
        bufferGeometry.setAttribute(ChunkGeometryAttributes.COLOR, new BufferAttribute(new Float32Array(geometry[ChunkGeometryAttributes.COLOR]), 3));

        chunk.add(new Mesh(bufferGeometry, materials[materialName as MaterialName]));
    });
}