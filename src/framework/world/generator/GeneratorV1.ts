import type GeneratorInterface from './GeneratorInterface.ts';
import { CHUNK, WORLD_MAX_CHUNK_Y } from '../../../config.ts';
import { BlockIds } from '../../../../data/block-ids.ts';
import CoordinatesHelper from '../../../lib/CoordinatesHelper.ts';
import PerlinNoise from '../../../lib/PerlinNoise.ts';

// Biome definitions
const BiomeType = {
    OCEAN: 0,
    BEACH: 1,
    PLAINS: 2,
    FOREST: 3,
    DESERT: 4,
    MOUNTAINS: 5,
    SNOWY_PLAINS: 6,
    SNOWY_MOUNTAINS: 7,
    JUNGLE: 8
} as const;

type BiomeType = typeof BiomeType[keyof typeof BiomeType];

export default class GeneratorV1 implements GeneratorInterface {
    private elevationNoise: PerlinNoise;
    private temperatureNoise: PerlinNoise;
    private humidityNoise: PerlinNoise;
    private erosionNoise: PerlinNoise;
    private caveNoise: PerlinNoise;

    private readonly SEA_LEVEL = 40;
    private readonly WORLD_HEIGHT = (WORLD_MAX_CHUNK_Y + 1) * CHUNK.HEIGHT;

    constructor() {
        this.elevationNoise = new PerlinNoise(12345);
        this.temperatureNoise = new PerlinNoise(67890);
        this.humidityNoise = new PerlinNoise(54321);
        this.erosionNoise = new PerlinNoise(98765);
        this.caveNoise = new PerlinNoise(13579);
    }

    public generate(chunkX: number, chunkY: number, chunkZ: number): Uint8Array {
        const blocks = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH);

        if (chunkY > WORLD_MAX_CHUNK_Y) {
            return blocks;
        }

        const heightMap = new Int16Array(20 * 20); // 16 + 2 + 2 = 20
        const biomeMap = new Uint8Array(20 * 20);

        for (let x = -2; x < CHUNK.WIDTH + 2; x++) {
            for (let z = -2; z < CHUNK.WIDTH + 2; z++) {
                const globalX = chunkX * CHUNK.WIDTH + x;
                const globalZ = chunkZ * CHUNK.WIDTH + z;

                const temperature = this.temperatureNoise.noise(globalX * 0.005, 0, globalZ * 0.005);
                const humidity = this.humidityNoise.noise(globalX * 0.005, 0, globalZ * 0.005);

                const baseHeightNoise = this.elevationNoise.noise(globalX * 0.01, 0, globalZ * 0.01);
                const erosion = this.erosionNoise.noise(globalX * 0.02, 0, globalZ * 0.02);

                let targetHeight = this.calculateHeight(baseHeightNoise, erosion, globalX, globalZ);
                const biome = this.getBiome(temperature, humidity, targetHeight);

                const idx = (x + 2) + (z + 2) * 20;
                heightMap[idx] = targetHeight;
                biomeMap[idx] = biome;
            }
        }

        for (let x = 0; x < CHUNK.WIDTH; x++) {
            for (let z = 0; z < CHUNK.WIDTH; z++) {
                const globalX = chunkX * CHUNK.WIDTH + x;
                const globalZ = chunkZ * CHUNK.WIDTH + z;

                const idx = (x + 2) + (z + 2) * 20;
                const targetHeight = heightMap[idx];
                const biome = biomeMap[idx] as BiomeType;

                const minY = chunkY * CHUNK.HEIGHT;

                if (minY <= targetHeight || (minY <= this.SEA_LEVEL)) {
                    for (let y = 0; y < CHUNK.HEIGHT; y++) {
                        const globalY = minY + y;
                        const blockIndex = CoordinatesHelper.ChunkCoordsToIndex(x, y, z);

                        if (globalY > targetHeight && globalY <= this.SEA_LEVEL) {
                            if (biome === BiomeType.SNOWY_PLAINS && globalY === this.SEA_LEVEL) {
                                blocks[blockIndex] = BlockIds.ICE;
                            } else {
                                blocks[blockIndex] = BlockIds.WATER;
                            }
                            continue;
                        }

                        if (globalY <= targetHeight) {
                            if (globalY > 5) {
                                const caveVal = this.caveNoise.noise(globalX * 0.05, globalY * 0.05, globalZ * 0.05);
                                if (caveVal > 0.4) {
                                    if (globalY < 10) blocks[blockIndex] = BlockIds.LAVA;
                                    continue;
                                }
                            }

                            if (globalY === 0) {
                                blocks[blockIndex] = BlockIds.BEDROCK;
                                continue;
                            }

                            let blockId = BlockIds.STONE;
                            if (globalY === targetHeight) {
                                blockId = this.getTopBlock(biome);
                            } else if (globalY > targetHeight - 4) {
                                blockId = this.getFillerBlock(biome);
                            }
                            blocks[blockIndex] = blockId;
                        }
                    }
                }
            }
        }

        for (let x = -2; x < CHUNK.WIDTH + 2; x++) {
            for (let z = -2; z < CHUNK.WIDTH + 2; z++) {
                const idx = (x + 2) + (z + 2) * 20;
                const globalX = chunkX * CHUNK.WIDTH + x;
                const globalZ = chunkZ * CHUNK.WIDTH + z;

                const surfaceHeight = heightMap[idx];
                const biome = biomeMap[idx] as BiomeType;

                if (this.hasTree(globalX, globalZ, biome, surfaceHeight)) {
                    this.placeTree(blocks, x, surfaceHeight, z, chunkY);
                }
            }
        }

        return blocks;
    }

    private calculateHeight(baseHeightNoise: number, erosion: number, globalX: number, globalZ: number): number {
        let targetHeight = 0;
        let roughness = 0;

        if (baseHeightNoise < -0.3) {
            targetHeight = this.map(baseHeightNoise, -1, -0.3, 10, 30);
            roughness = 2;
        } else if (baseHeightNoise < 0.1) {
            targetHeight = this.map(baseHeightNoise, -0.3, 0.1, 30, 50);
            roughness = 4 + (erosion * 2);
        } else if (baseHeightNoise < 0.6) {
            targetHeight = this.map(baseHeightNoise, 0.1, 0.6, 50, 80);
            roughness = 10 + (erosion * 5);
        } else {
            targetHeight = this.map(baseHeightNoise, 0.6, 1, 80, 110);
            roughness = 20 + (erosion * 10);
        }

        const detailNoise = this.elevationNoise.noise(globalX * 0.05, 0, globalZ * 0.05);
        targetHeight += detailNoise * roughness;

        targetHeight = Math.floor(targetHeight);
        return Math.max(1, Math.min(targetHeight, this.WORLD_HEIGHT - 1));
    }

    private hasTree(x: number, z: number, biome: BiomeType, height: number): boolean {
        if (height <= this.SEA_LEVEL) return false;
        if (height > 80) return false;

        let threshold = 0;
        switch (biome) {
            case BiomeType.FOREST: threshold = 0.02; break;
            case BiomeType.JUNGLE: threshold = 0.08; break;
            case BiomeType.PLAINS: threshold = 0.001; break;
            case BiomeType.SNOWY_PLAINS: threshold = 0.001; break;
            case BiomeType.MOUNTAINS: threshold = 0.005; break;
            default: return false;
        }

        const val = Math.abs((Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1);

        return val < threshold;
    }

    private placeTree(blocks: Uint8Array, localX: number, groundY: number, localZ: number, chunkY: number) {
        const trunkHeight = 5;
        const leavesStart = 2;

        const chunkMinY = chunkY * CHUNK.HEIGHT;
        const chunkMaxY = (chunkY + 1) * CHUNK.HEIGHT;

        for (let y = 0; y < trunkHeight; y++) {
            const worldY = groundY + 1 + y;
            if (worldY >= chunkMinY && worldY < chunkMaxY) {
                this.setBlockCheckBounds(blocks, localX, worldY - chunkMinY, localZ, BlockIds.LOG);
            }
        }

        for (let y = groundY + leavesStart; y <= groundY + trunkHeight + 1; y++) {
            let radius = 2;
            if (y > groundY + trunkHeight - 1) radius = 1;
            if (y === groundY + trunkHeight + 1) radius = 1;

            for (let lx = -radius; lx <= radius; lx++) {
                for (let lz = -radius; lz <= radius; lz++) {
                    if (Math.abs(lx) === radius && Math.abs(lz) === radius) {
                        if (Math.random() > 0.5) continue;
                        if (y === groundY + trunkHeight + 1) continue;
                    }

                    const worldY = y + 1;
                    if (worldY >= chunkMinY && worldY < chunkMaxY) {
                        const targetX = localX + lx;
                        const targetZ = localZ + lz;

                        if (lx === 0 && lz === 0 && y < groundY + trunkHeight + 1) continue;

                        this.setBlockCheckBounds(blocks, targetX, worldY - chunkMinY, targetZ, BlockIds.LEAVES);
                    }
                }
            }
        }
    }

    private setBlockCheckBounds(blocks: Uint8Array, x: number, y: number, z: number, id: number) {
        if (x >= 0 && x < CHUNK.WIDTH && y >= 0 && y < CHUNK.HEIGHT && z >= 0 && z < CHUNK.WIDTH) {
            const idx = CoordinatesHelper.ChunkCoordsToIndex(x, y, z);

            if (blocks[idx] === BlockIds.AIR || blocks[idx] === BlockIds.WATER || blocks[idx] === BlockIds.SNOW) {
                blocks[idx] = id;
            }
        }
    }

    private map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    private getBiome(temp: number, humidity: number, height: number): BiomeType {
        if (height > 90) return BiomeType.SNOWY_MOUNTAINS;
        if (height > 75 && temp < 0) return BiomeType.SNOWY_MOUNTAINS;
        if (height > 75) return BiomeType.MOUNTAINS;

        if (temp < -0.2) {
            return BiomeType.SNOWY_PLAINS;
        } else if (temp < 0.2) {
            if (humidity < -0.2) return BiomeType.PLAINS;
            if (humidity > 0.2) return BiomeType.FOREST;
            return BiomeType.PLAINS;
        } else {
            if (humidity < 0) return BiomeType.DESERT;
            if (humidity > 0.3) return BiomeType.JUNGLE;
            return BiomeType.FOREST;
        }
    }

    private getTopBlock(biome: BiomeType): number {
        switch (biome) {
            case BiomeType.DESERT: return BlockIds.SAND;
            case BiomeType.SNOWY_PLAINS:
            case BiomeType.SNOWY_MOUNTAINS:
                return BlockIds.SNOW;
            case BiomeType.MOUNTAINS: return BlockIds.STONE;
            default: return BlockIds.GRASS;
        }
    }

    private getFillerBlock(biome: BiomeType): number {
        switch (biome) {
            case BiomeType.DESERT: return BlockIds.SAND;
            case BiomeType.SNOWY_PLAINS:
            case BiomeType.SNOWY_MOUNTAINS:
                return BlockIds.DIRT;
            case BiomeType.MOUNTAINS: return BlockIds.STONE;
            default: return BlockIds.DIRT;
        }
    }
}
