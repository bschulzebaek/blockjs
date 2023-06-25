import Chunk from '@/core/world/Chunk/Chunk';
import BlockId from '@/core/world/Block/BlockId';
import { TRANSPARENT_BLOCKS } from '@/core/world/Block/block-data';
import getGeometryData from '@/core/world/Chunk/get-geometry-data';
import { ChunkGeometryData } from '@/core/world/generation/worker/ChunkPayload';

export default function createGeometry(chunk: Chunk): ChunkGeometryData {
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const uvs: number[] = [];

    const positions2: number[] = [];
    const normals2: number[] = [];
    const colors2: number[] = [];
    const uvs2: number[] = [];

    chunk.iterateBlocksLocal((x, y, z, block) => {
        if (!block || block.id === BlockId.AIR) {
            return;
        }

        const transparent = TRANSPARENT_BLOCKS.includes(block.id);

        const addFace = (_x: number, _y: number, _z: number) => {
            const _block = chunk.getBlockLocal(_x, _y, _z);

            if (!_block || TRANSPARENT_BLOCKS.includes(_block.id)) {
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

    return {
        opaque: {
            position: new Float32Array(positions),
            normal: new Float32Array(normals),
            color: new Float32Array(colors),
            uv: new Float32Array(uvs),
        },
        transparent: {
            position: new Float32Array(positions2),
            normal: new Float32Array(normals2),
            color: new Float32Array(colors2),
            uv: new Float32Array(uvs2),
        }
    }
}