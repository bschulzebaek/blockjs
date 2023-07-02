import Chunk from '@/framework/world/chunk/Chunk';
import BlockId from '@/framework/world/block/BlockId';
import { TRANSPARENT_BLOCKS } from '@/framework/world/block/block-data';
import getGeometryData from '@/framework/world/chunk/geometry/get-geometry-data';
import { ChunkGeometryData } from '@/framework/world/generation/worker/ChunkPayload';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import getFaceVisibility from '@/framework/world/chunk/geometry/get-face-visibility';
import WorldAccessor from '@/framework/world/WorldAccessor';

export default function createBuffer(chunk: Chunk, accessor: WorldAccessor): ChunkGeometryData {
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const uvs: number[] = [];

    const positions2: number[] = [];
    const normals2: number[] = [];
    const colors2: number[] = [];
    const uvs2: number[] = [];

    ChunkUtils.iterateBlocks(chunk, (x, y, z, block) => {
        if (!block || block.id === BlockId.AIR) {
            return;
        }

        const transparent = TRANSPARENT_BLOCKS.includes(block.id);
        const worldX = x + chunk.getOffsetX();
        const worldZ = z + chunk.getOffsetZ();

        const faces = [
            getFaceVisibility(accessor, worldX, y, worldZ + 1, transparent),
            getFaceVisibility(accessor, worldX + 1, y, worldZ, transparent),

            getFaceVisibility(accessor, worldX, y, worldZ - 1, transparent),
            getFaceVisibility(accessor, worldX - 1, y, worldZ, transparent),

            getFaceVisibility(accessor, worldX, y + 1, worldZ, transparent),
            getFaceVisibility(accessor, worldX, y - 1, worldZ, transparent),
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

    return {
        opaque: {
            position: new Float32Array(positions).buffer,
            normal: new Float32Array(normals).buffer,
            color: new Float32Array(colors).buffer,
            uv: new Float32Array(uvs).buffer,
        },
        transparent: {
            position: new Float32Array(positions2).buffer,
            normal: new Float32Array(normals2).buffer,
            color: new Float32Array(colors2).buffer,
            uv: new Float32Array(uvs2).buffer,
        }
    }
}