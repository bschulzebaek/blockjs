import { BlockIds } from '../../../data/block-ids.ts';
import { BlockUV } from '../../../data/block-uv.ts';
import { Faces } from '../../../data/faces.ts';
import type WorkerChunk from './WorkerChunk.ts';
import type WorkerWorld from './WorkerWorld.ts';
import type ChunkGeometry from '../../framework/chunk/ChunkGeometry.ts';
import CoordinatesHelper from '../../lib/CoordinatesHelper.ts';
import { CHUNK } from '../../defaults.const.ts';

const TRANSPARENT_BLOCKS = new Set([
    BlockIds.AIR,
    BlockIds.GLASS,
    BlockIds.SAPLING,
    BlockIds.LEAVES,
    BlockIds.WOODEN_DOOR_A,
    BlockIds.WOODEN_DOOR_B,
    BlockIds.WEB,
    BlockIds.BED_A,
    BlockIds.BED_B,
]);

export type BlockAccessor = (x: number, y: number, z: number) => number;

function getFaceVisibility(
    accessor: BlockAccessor,
    x: number,
    y: number,
    z: number,
    face: number,
    block: number,
    chunkX: number,
    chunkY: number,
    chunkZ: number
): boolean {
    // Calculate the position of the facing block
    let facingX = x;
    let facingY = y;
    let facingZ = z;

    // Adjust coordinates based on face direction
    switch (face) {
        case 0: // North
            facingZ += 1;
            break;
        case 1: // East
            facingX += 1;
            break;
        case 2: // South
            facingZ -= 1;
            break;
        case 3: // West
            facingX -= 1;
            break;
        case 4: // Up
            facingY += 1;
            break;
        case 5: // Down
            facingY -= 1;
            break;
    }

    // Check if the facing block is in a different chunk
    const facingChunkX = Math.floor(facingX / CHUNK.WIDTH);
    const facingChunkY = Math.floor(facingY / CHUNK.HEIGHT);
    const facingChunkZ = Math.floor(facingZ / CHUNK.WIDTH);

    // If the facing block is in a different chunk, we need to check if that chunk exists
    if (facingChunkX !== chunkX || facingChunkY !== chunkY || facingChunkZ !== chunkZ) {
        // If the chunk doesn't exist, show the face
        const facingBlock = accessor(facingX, facingY, facingZ);
        if (facingBlock === BlockIds.AIR) {
            return true;
        }
    }

    const facingBlock = accessor(facingX, facingY, facingZ);
    
    if (!facingBlock) {
        return true;
    }

    const isTransparent = TRANSPARENT_BLOCKS.has(block);
    const isFacingTransparent = TRANSPARENT_BLOCKS.has(facingBlock);

    if (isTransparent) {
        return facingBlock !== block || !facingBlock;
    }
    
    return !facingBlock || (facingBlock !== block && isFacingTransparent);
}

const UV_CACHE = new Map<number, Map<number, [number, number, number, number]>>();

function getUVs(block: number, face: number): [number, number, number, number] {
    let blockCache = UV_CACHE.get(block);
    if (!blockCache) {
        blockCache = new Map();
        UV_CACHE.set(block, blockCache);
    }

    let faceUVs = blockCache.get(face);
    if (!faceUVs) {
        const [u, v] = [
            BlockUV[block][face * 2],
            BlockUV[block][face * 2 + 1],
        ];
        faceUVs = [u, v, u + 1, v + 1];
        blockCache.set(face, faceUVs);
    }

    return faceUVs;
}

function getGeometryData(
    x: number,
    y: number,
    z: number,
    faces: boolean[],
    block: number,
    _isTransparent: boolean
) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const colors: number[] = [];

    const worldCoords = [x, y, z];

    for (let i = 0; i < faces.length; i++) {
        if (!faces[i]) continue;

        const faceOffset = i * 6;
        for (let j = 0; j < 6; j++) {
            const vertex = Faces[faceOffset + j];
            
            // Optimize position calculation
            positions.push(
                vertex.pos[0] / 2 + worldCoords[0],
                vertex.pos[1] / 2 + worldCoords[1],
                vertex.pos[2] / 2 + worldCoords[2]
            );
            
            normals.push(...vertex.norm);

            const [u1, v1, u2, v2] = getUVs(block, i);
            const [u, v] = vertex.uv;
            uvs.push(
                (u ? u2 : u1) / 16,
                (v ? v2 : v1) / 16
            );

            const shade = [1, 1, 1, 1][vertex.shade];
            colors.push(shade, shade, shade);
        }
    }

    return {
        positions,
        normals,
        uvs,
        colors,
    };
}

const CHUNK_SIZE = CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH;
const ESTIMATED_FACES = CHUNK_SIZE * 3;
const VERTICES_PER_FACE = 6;
const TOTAL_POSITIONS = ESTIMATED_FACES * VERTICES_PER_FACE * 3;
const TOTAL_NORMALS = ESTIMATED_FACES * VERTICES_PER_FACE * 3;
const TOTAL_UVS = ESTIMATED_FACES * VERTICES_PER_FACE * 2;
const TOTAL_COLORS = ESTIMATED_FACES * VERTICES_PER_FACE * 3;

export default function createGeometry(chunk: WorkerChunk, world: WorkerWorld): ChunkGeometry {
    const opaque = {
        positions: new Float32Array(TOTAL_POSITIONS),
        normals: new Float32Array(TOTAL_NORMALS),
        uvs: new Float32Array(TOTAL_UVS),
        colors: new Float32Array(TOTAL_COLORS),
    };

    const transparent = {
        positions: new Float32Array(TOTAL_POSITIONS),
        normals: new Float32Array(TOTAL_NORMALS),
        uvs: new Float32Array(TOTAL_UVS),
        colors: new Float32Array(TOTAL_COLORS),
    };

    let opaqueVertexCount = 0;
    let transparentVertexCount = 0;

    const blockAccessor = world.getBlock;

    chunk.blocks.forEach((block: number, index: number) => {
        if (!BlockUV[block]) return;

        const { x, y, z } = CoordinatesHelper.IndexToCoords(index);
        const worldX = x + chunk.getOffsetX();
        const worldY = y + chunk.getOffsetY();
        const worldZ = z + chunk.getOffsetZ();

        const isTransparent = TRANSPARENT_BLOCKS.has(block);

        const faces = [
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 0, block, chunk.x, chunk.y, chunk.z),
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 1, block, chunk.x, chunk.y, chunk.z),
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 2, block, chunk.x, chunk.y, chunk.z),
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 3, block, chunk.x, chunk.y, chunk.z),
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 4, block, chunk.x, chunk.y, chunk.z),
            getFaceVisibility(blockAccessor, worldX, worldY, worldZ, 5, block, chunk.x, chunk.y, chunk.z),
        ];

        const geometry = getGeometryData(x, y, z, faces, block, isTransparent);
        const vertexCount = geometry.positions.length / 3;

        const target = isTransparent ? transparent : opaque;
        const targetIndex = isTransparent ? transparentVertexCount : opaqueVertexCount;

        target.positions.set(geometry.positions, targetIndex * 3);
        target.normals.set(geometry.normals, targetIndex * 3);
        target.uvs.set(geometry.uvs, targetIndex * 2);
        target.colors.set(geometry.colors, targetIndex * 3);

        if (isTransparent) {
            transparentVertexCount += vertexCount;
        } else {
            opaqueVertexCount += vertexCount;
        }
    });

    return {
        opaque: {
            positions: opaque.positions.slice(0, opaqueVertexCount * 3).buffer,
            normals: opaque.normals.slice(0, opaqueVertexCount * 3).buffer,
            uvs: opaque.uvs.slice(0, opaqueVertexCount * 2).buffer,
            colors: opaque.colors.slice(0, opaqueVertexCount * 3).buffer,
        },
        transparent: {
            positions: transparent.positions.slice(0, transparentVertexCount * 3).buffer,
            normals: transparent.normals.slice(0, transparentVertexCount * 3).buffer,
            uvs: transparent.uvs.slice(0, transparentVertexCount * 2).buffer,
            colors: transparent.colors.slice(0, transparentVertexCount * 3).buffer,
        },
    };
}