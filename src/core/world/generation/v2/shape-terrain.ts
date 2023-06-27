import { createNoise2D } from 'simplex-noise';
import Chunk, { BlockMap } from '../../Chunk/Chunk';
import Alea from 'alea';
import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import { BEDROCK_LEVEL, NOISE_FACTOR, SPLINE_POINTS } from './parameters';

import Spline from './Spline';
import BlockId from '@/core/world/Block/BlockId';
import { iterateChunk3D } from '@/core/world/iterate-coordinates';

const spContinentalness = new Spline(SPLINE_POINTS.CONTINENTALNESS.x, SPLINE_POINTS.CONTINENTALNESS.y);
const spErosion = new Spline(SPLINE_POINTS.EROSION.x, SPLINE_POINTS.EROSION.y);
// const spPeaksValleys = new Spline(SPLINE_POINTS.PEAKS_VALLEYS.x, SPLINE_POINTS.PEAKS_VALLEYS.y);

function getTerrainHeight(continentalness: number, erosion: number, peaksValleys: number) {
    let th = WORLD_HEIGHT;

    th += Math.floor(th * spContinentalness.at(continentalness));
    th = Math.floor(th * spErosion.at(erosion));
    // th += Math.floor(th * spPeaksValleys.at(peaksValleys));

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

    const noise2dContinentalness = createNoise2D(Alea(seed + '-c')),
        noise2dErosion = createNoise2D(Alea(seed + '-e')),
        noise2dPeaksValleys = createNoise2D(Alea(seed + '-pv')),
        noise2dHumidity = createNoise2D(Alea(seed + '-h')),
        noise2dTemperature = createNoise2D(Alea(seed + 't'));

    const blockNoise = createNoise2D(Alea(seed));

    iterateChunk3D((x: number, y: number, z: number) => {
        const blockPosition = Chunk.getBlockPosition(x, y, z);
        const block = blocks.get(blockPosition);

        if (block) {
            return;
        }

        const blockX = (absoluteX + x) * NOISE_FACTOR,
            blockZ = (absoluteZ + z) * NOISE_FACTOR,
            noise2d = blockNoise(blockX, blockZ),
            continentalness = (noise2dContinentalness(blockX, blockZ) + 1) / 2,
            erosion = noise2dErosion(blockX, blockZ),
            peaksValleys = noise2dPeaksValleys(blockX, blockZ);

        const terrainHeight = getTerrainHeight(
            continentalness,
            erosion,
            peaksValleys,
        );

        const surfaceY = terrainHeight + noise2d * 4;

        const blockId = getBlockForY(y, surfaceY);

        if (blockId === BlockId.AIR) {
            return;
        }

        blocks.set(blockPosition, {
            id: blockId,
            biomeData: {
                continentalness,
                humidity: Math.round(noise2dHumidity(blockX, blockZ) * 100) / 100,
                temperature: Math.round(noise2dTemperature(x, z) * 100) / 100,
            },
        });
    });
}
