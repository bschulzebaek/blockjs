import Chunk from '@/core/world/chunk/Chunk';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import BlockId from '@/core/world/block/BlockId';
import { TRANSPARENT_BLOCKS } from '@/core/world/block/block-data';
import getGeometryData from '@/core/world/chunk/geometry/get-geometry-data';
import { BufferAttribute, BufferGeometry, Mesh } from 'three';
import materials from '@/core/world/chunk/geometry/materials';
import getFaceVisibility from '@/core/world/chunk/geometry/get-face-visibility';
import World from '@/core/world/World';

export default function createMeshNaive(chunk: Chunk, world: World) {
    chunk.children = [];

    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const uvs: number[] = [];

    const positions2: number[] = [];
    const normals2: number[] = [];
    const colors2: number[] = [];
    const uvs2: number[] = []

    ChunkUtils.iterateBlocks(chunk, (x, y, z, block) => {
        if (!block || block.id === BlockId.AIR) {
            return;
        }

        const transparent = TRANSPARENT_BLOCKS.includes(block.id);
        const worldX = x + chunk.getOffsetX();
        const worldZ = z + chunk.getOffsetZ();

        const faces = [
            getFaceVisibility(world, worldX, y, worldZ + 1, transparent),
            getFaceVisibility(world, worldX + 1, y, worldZ, transparent),

            getFaceVisibility(world, worldX, y, worldZ - 1, transparent),
            getFaceVisibility(world, worldX - 1, y, worldZ, transparent),

            getFaceVisibility(world, worldX, y + 1, worldZ, transparent),
            getFaceVisibility(world, worldX, y - 1, worldZ, transparent),
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