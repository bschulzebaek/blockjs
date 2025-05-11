import { type Mesh } from 'three';

type ChunkMesh = {
    transparent: Mesh;
    opaque: Mesh;
}

export {
    type ChunkMesh as default,
}