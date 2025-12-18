import { BlockIds } from '../../../data/block-ids.ts';
import { BlockUV } from '../../../data/block-uv.ts';
import { Faces } from '../../../data/faces.ts';
import type WorkerChunk from './WorkerChunk.ts';
import type WorkerWorld from './WorkerWorld.ts';
import type ChunkGeometry from '../../framework/chunk/ChunkGeometry.ts';
import CoordinatesHelper from '../../lib/CoordinatesHelper.ts';
import { CHUNK } from '../../defaults.const.ts';

const TRANSPARENT_BLOCKS = new Set([
    BlockIds.WATER,
    BlockIds.ICE,
    BlockIds.GLASS,
    BlockIds.LEAVES,
    BlockIds.SAPLING,
    BlockIds.WEB,
    BlockIds.CACTUS,
    BlockIds.WOODEN_DOOR_A,
    BlockIds.WOODEN_DOOR_B,
    BlockIds.BED_A,
    BlockIds.BED_B,
    BlockIds.SNOW,
]);

const VISIBILITY_CHECK_BLOCKS = new Set([
    ...TRANSPARENT_BLOCKS,
    BlockIds.AIR,
]);


export type BlockAccessor = (x: number, y: number, z: number) => number;

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

    const localCoords = [x, y, z];

    for (let i = 0; i < faces.length; i++) {
        if (!faces[i]) continue;

        const faceOffset = i * 6;
        for (let j = 0; j < 6; j++) {
            const vertex = Faces[faceOffset + j];

            positions.push(
                vertex.pos[0] / 2 + localCoords[0],
                vertex.pos[1] / 2 + localCoords[1],
                vertex.pos[2] / 2 + localCoords[2]
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
    const blocks = chunk.blocks;

    const neighbors = {
        px: world.get(chunk.x + 1, chunk.y, chunk.z),
        nx: world.get(chunk.x - 1, chunk.y, chunk.z),
        py: world.get(chunk.x, chunk.y + 1, chunk.z),
        ny: world.get(chunk.x, chunk.y - 1, chunk.z),
        pz: world.get(chunk.x, chunk.y, chunk.z + 1),
        nz: world.get(chunk.x, chunk.y, chunk.z - 1)
    };

    const width = CHUNK.WIDTH;
    const height = CHUNK.HEIGHT;

    for (let index = 0; index < CHUNK_SIZE; index++) {
        const block = blocks[index];

        if (!BlockUV[block]) continue;

        const x = index % width;
        const z = Math.floor(index / (width * width)); // Integer division
        const y = Math.floor((index / width) % height);

        const worldX = x + chunk.getOffsetX();
        const worldY = y + chunk.getOffsetY();
        const worldZ = z + chunk.getOffsetZ();

        const isTransparent = TRANSPARENT_BLOCKS.has(block);
        const isNonOpaque = isTransparent;

        // Check 6 faces
        // 0: North (Z+1), 1: East (X+1), 2: South (Z-1), 3: West (X-1), 4: Up (Y+1), 5: Down (Y-1)

        let faces = [false, false, false, false, false, false];

        // North (Z + 1)
        if (z < width - 1) {
            const neighborIndex = index + width * height; // + Z stride
            const neighborBlock = blocks[neighborIndex];
            faces[0] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            // Boundary check Z+1
            faces[0] = checkBoundary(neighbors.pz, x, y, 0, block, isNonOpaque, blockAccessor, worldX, worldY, worldZ + 1);
        }

        // East (X + 1)
        if (x < width - 1) {
            const neighborIndex = index + 1;
            const neighborBlock = blocks[neighborIndex];
            faces[1] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            faces[1] = checkBoundary(neighbors.px, 0, y, z, block, isNonOpaque, blockAccessor, worldX + 1, worldY, worldZ);
        }

        // South (Z - 1)
        if (z > 0) {
            const neighborIndex = index - width * height;
            const neighborBlock = blocks[neighborIndex];
            faces[2] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            faces[2] = checkBoundary(neighbors.nz, x, y, width - 1, block, isNonOpaque, blockAccessor, worldX, worldY, worldZ - 1);
        }

        // West (X - 1)
        if (x > 0) {
            const neighborIndex = index - 1;
            const neighborBlock = blocks[neighborIndex];
            faces[3] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            faces[3] = checkBoundary(neighbors.nx, width - 1, y, z, block, isNonOpaque, blockAccessor, worldX - 1, worldY, worldZ);
        }

        // Up (Y + 1)
        if (y < height - 1) {
            // Stride for Y is WIDTH (x + y*WIDTH + ...)
            const neighborIndex = index + width;
            const neighborBlock = blocks[neighborIndex];
            faces[4] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            faces[4] = checkBoundary(neighbors.py, x, 0, z, block, isNonOpaque, blockAccessor, worldX, worldY + 1, worldZ);
        }

        // Down (Y - 1)
        if (y > 0) {
            const neighborIndex = index - width;
            const neighborBlock = blocks[neighborIndex];
            faces[5] = shouldRenderFace(block, neighborBlock, isNonOpaque);
        } else {
            faces[5] = checkBoundary(neighbors.ny, x, height - 1, z, block, isNonOpaque, blockAccessor, worldX, worldY - 1, worldZ);
        }

        if (!faces[0] && !faces[1] && !faces[2] && !faces[3] && !faces[4] && !faces[5]) continue;

        const geometry = getGeometryData(x, y, z, faces, block, isNonOpaque);
        const vertexCount = geometry.positions.length / 3;

        // Bucket selection
        let target;
        let targetIndex;

        if (isTransparent) {
            target = transparent;
            targetIndex = transparentVertexCount;
            transparentVertexCount += vertexCount;
        } else {
            target = opaque;
            targetIndex = opaqueVertexCount;
            opaqueVertexCount += vertexCount;
        }

        target.positions.set(geometry.positions, targetIndex * 3);
        target.normals.set(geometry.normals, targetIndex * 3);
        target.uvs.set(geometry.uvs, targetIndex * 2);
        target.colors.set(geometry.colors, targetIndex * 3);
    }

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

function shouldRenderFace(currentBlock: number, neighborBlock: number, isCurrentNonOpaque: boolean): boolean {
    if (neighborBlock === BlockIds.AIR) return true;

    const isNeighborNonOpaque = VISIBILITY_CHECK_BLOCKS.has(neighborBlock);

    if (isCurrentNonOpaque) {
        if (currentBlock === neighborBlock) {
            if (currentBlock === BlockIds.LEAVES) return true; // Keep volume for leaves
            return false;
        }
        return true;
    }

    return isNeighborNonOpaque;
}

function checkBoundary(
    neighborChunk: WorkerChunk | undefined,
    nx: number, ny: number, nz: number,
    currentBlock: number, isCurrentNonOpaque: boolean,
    fallbackAccessor: BlockAccessor,
    wx: number, wy: number, wz: number
): boolean {
    if (neighborChunk) {
        const index = CoordinatesHelper.ChunkCoordsToIndex(nx, ny, nz);
        const neighborBlock = neighborChunk.blocks[index];
        return shouldRenderFace(currentBlock, neighborBlock, isCurrentNonOpaque);
    }

    const neighborBlock = fallbackAccessor(wx, wy, wz);
    return shouldRenderFace(currentBlock, neighborBlock, isCurrentNonOpaque);
}