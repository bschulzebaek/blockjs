import Chunk from './Chunk';
import {
    BufferAttribute,
    BufferGeometry,
    Mesh,
    MeshBasicMaterial,
} from 'three';
import getGeometryData from '@/core/world/Chunk/get-geometry-data';
import BlockId from '@/core/world/Block/BlockId';
import CustomTextureLoader from '@/utility/TextureLoader';
import { TRANSPARENT_BLOCKS } from '@/core/world/Block/block-data';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';

const textureLoader = new CustomTextureLoader();
const texture = textureLoader.load('/engine/textures.png');

const materialOptions = {
    map: texture,
    vertexColors: true,
};

const materials = {
    opaque: new MeshBasicMaterial(materialOptions),
    transparent: new MeshBasicMaterial({
        ...materialOptions,
        transparent: true,
        opacity: 1.0,
    }),
};

export default class ChunkGeometry {
    static build(chunk: Chunk) {
        const positions: number[] = [];
        const normals: number[] = [];
        const colors: number[] = [];
        const uvs: number[] = [];

        const positions2: number[] = [];
        const normals2: number[] = [];
        const colors2: number[] = [];
        const uvs2: number[] = [];

        chunk.iterateBlocksLocal((x, y, z, block) => {
            const transparent = TRANSPARENT_BLOCKS.includes(block.id);

            const addFace = (_x: number, _y: number, _z: number) => {
                const _block = chunk.getBlockLocal(_x, _y, _z);

                if (!_block || _block.id === BlockId.AIR) {
                    return true;
                }

                return !transparent;
            };

            const faces = [
                addFace(x, y, z + 1),
                addFace(x + 1, y, z),
                addFace(x, y, z - 1),
                addFace(x - 1, y, z),
                addFace(x, y + 1, z),
                addFace(x, y - 1, z),
            ];

            const data = getGeometryData(x, y, z, faces, block.id);

            if (transparent) {
                positions2.push(...data.positions);
                normals2.push(...data.normals);
                colors2.push(...data.colors);
                uvs2.push(...data.uvs);
            } else {
                positions.push(...data.positions);
                normals.push(...data.normals);
                colors.push(...data.colors);
                uvs.push(...data.uvs);
            }
        });

        const setAttribute = (
            geometry: BufferGeometry,
            name: string,
            arr: number[],
            size: number,
        ) => {
            geometry.setAttribute(name, new BufferAttribute(new Float32Array(arr), size));
        };

        const geometryOpaque = new BufferGeometry();
        geometryOpaque.name = 'opaque';
        setAttribute(geometryOpaque, 'position', positions, 3);
        setAttribute(geometryOpaque, 'normal', normals, 3);
        setAttribute(geometryOpaque, 'uv', uvs, 2);
        setAttribute(geometryOpaque, 'color', colors, 3);

        chunk.add(new Mesh(geometryOpaque, materials.opaque));

        const geometryTransparent = new BufferGeometry();
        geometryOpaque.name = 'transparent';
        setAttribute(geometryTransparent, 'position', positions2, 3);
        setAttribute(geometryTransparent, 'normal', normals2, 3);
        setAttribute(geometryTransparent, 'uv', uvs2, 2);
        setAttribute(geometryTransparent, 'color', colors2, 3);

        chunk.add(new Mesh(geometryTransparent, materials.transparent));
    }

    static buildFromPayload(chunk: Chunk, payload: ChunkPayload) {
        const setAttribute = (
            geometry: BufferGeometry,
            name: string,
            arr: Float32Array,
            size: number,
        ) => {
            geometry.setAttribute(name, new BufferAttribute(new Float32Array(arr), size));
        };

        const { opaque, transparent } = payload.geometries;

        const geometryOpaque = new BufferGeometry();
        setAttribute(geometryOpaque, 'position', opaque.position, 3);
        setAttribute(geometryOpaque, 'normal', opaque.normal, 3);
        setAttribute(geometryOpaque, 'uv', opaque.uv, 2);
        setAttribute(geometryOpaque, 'color', opaque.color, 3);

        chunk.add(new Mesh(geometryOpaque, materials.opaque));

        const geometryTransparent = new BufferGeometry();
        setAttribute(geometryTransparent, 'position', transparent.position, 3);
        setAttribute(geometryTransparent, 'normal', transparent.normal, 3);
        setAttribute(geometryTransparent, 'uv', transparent.uv, 2);
        setAttribute(geometryTransparent, 'color', transparent.color, 3);

        chunk.add(new Mesh(geometryTransparent, materials.transparent));
    }
}