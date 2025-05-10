import type ChunkGeometry from './ChunkGeometry.ts';
import type ChunkMesh from './ChunkMesh.ts';
import { BufferGeometry, Float32BufferAttribute, Mesh } from 'three';
import getMaterials, { type MaterialName } from './materials.ts';

export default function createMesh(chunkGeometry: ChunkGeometry): ChunkMesh {
    let meshes: { [x: string]: Mesh } = {};

    Object.entries(chunkGeometry).forEach(([type, geometry]) => {
        const bufferGeometry = new BufferGeometry();

        bufferGeometry.setAttribute('position', new Float32BufferAttribute(geometry.positions, 3));
        bufferGeometry.setAttribute('normal', new Float32BufferAttribute(geometry.normals, 3));
        bufferGeometry.setAttribute('uv', new Float32BufferAttribute(geometry.uvs, 2));
        bufferGeometry.setAttribute('color', new Float32BufferAttribute(geometry.colors, 3));

        meshes[type] = new Mesh(bufferGeometry, getMaterials()[type as MaterialName]);
        meshes[type].name = type;
    });

    return meshes as ChunkMesh;
}