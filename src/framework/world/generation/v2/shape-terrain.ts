import { createNoise2D } from 'simplex-noise';
import { BlockMap } from '@/framework/world/chunk/Chunk';
import Alea from 'alea';
import { CHUNK_SIZE } from '@/configuration';
import { BEDROCK_LEVEL, NOISE_FACTOR, SEA_LEVEL, SPLINE_POINTS } from './parameters';

import Spline from '../shared/Spline';
import BlockId from '@/framework/world/block/BlockId';
import { iterateChunk3D } from '@/framework/world/iterate-coordinates';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { Vector3 } from 'three';

const spContinentalness = new Spline(SPLINE_POINTS.CONTINENTALNESS.x, SPLINE_POINTS.CONTINENTALNESS.y);

function getTerrainHeight(continentalness: number) {
    let th = SEA_LEVEL + 2;

    th += Math.floor(3 * spContinentalness.at(continentalness));

    return Math.floor(th);
}

function getBlockForY(y: number, surfaceY: number) {
    if (y > surfaceY) {
        return BlockId.AIR;
    } else if (y === 0) {
        return BlockId.BEDROCK;
    } else if (y <= BEDROCK_LEVEL) {
        return Math.round(Math.random()) ? BlockId.STONE : BlockId.BEDROCK;
    } else {
        return BlockId.STONE;
    }
}

export default function shapeTerrain(seed: string, chunkX: number, chunkZ: number, blocks: BlockMap): void {
    const absoluteX = chunkX * CHUNK_SIZE,
        absoluteZ = chunkZ * CHUNK_SIZE;

    const noise2dContinentalness = createNoise2D(Alea(seed + '-c'));

    const blockNoise = createNoise2D(Alea(seed));

    iterateChunk3D((x: number, y: number, z: number) => {
        const blockPosition = ChunkUtils.localCoordinatesToBlockId(x, y, z);
        const block = blocks.get(blockPosition);

        if (block) {
            return;
        }

        const blockX = (absoluteX + x) * NOISE_FACTOR,
            blockZ = (absoluteZ + z) * NOISE_FACTOR,
            noise2d = blockNoise(blockX, blockZ),
            continentalness = (noise2dContinentalness(blockX, blockZ) + 1) / 2;

        const terrainHeight = getTerrainHeight(continentalness);
        const surfaceY = terrainHeight + noise2d * 4;
        const blockId = getBlockForY(y, surfaceY);

        if (blockId === BlockId.AIR) {
            return;
        }

        blocks.set(blockPosition, {
            id: blockId,
        });
    });
}
