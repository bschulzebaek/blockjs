import { Group, Vector3 } from 'three';
import Chunk from '../chunk/Chunk.ts';
import Grid2D from './Grid2D.ts';
import { CHUNK, RENDER_DISTANCE_VERTICAL, WORLD_MAX_CHUNK_Y } from '../../defaults.const.ts';
import { BlockIds, type BlockId } from '../../../data/block-ids.ts';
import OutOfBoundsError from './OutOfBoundsError.ts';
import type ChunkWorkerAdapter from '../../worker/chunk/ChunkWorkerAdapter.ts';

export default class World extends Group {
    public readonly type = 'World';
    public readonly name = 'World';
    public readonly grid = new Set<string>();

    public readonly castShadow = false;
    public readonly receiveShadow = false;

    public center = new Vector3(0, 0, 0);

    private initialized = false;

    private loadChunks = true;
    private unloadChunks = true;

    private readonly chunkWorker: ChunkWorkerAdapter;

    constructor(chunkWorker: ChunkWorkerAdapter) {
        super();

        this.chunkWorker = chunkWorker;
    }

    public init = async () => {
        await this.chunkWorker.init();
        this.refreshGrid();
        await this.hydrate();

        this.initialized = true;
    }

    public hydrate = async () => {
        const sortedGrid = Array.from(this.grid).sort((a, b) => {
            const [ax, ay, az] = a.split(':').map((n) => parseInt(n, 10));
            const [bx, by, bz] = b.split(':').map((n) => parseInt(n, 10));

            const aDistance = this.center.distanceTo(new Vector3(ax, ay, az));
            const bDistance = this.center.distanceTo(new Vector3(bx, by, bz));

            return aDistance - bDistance;
        });

        const chunksToGenerate = sortedGrid
            .filter(position => !this.getObjectByName(position))
            .map(position => {
                const [x, y, z] = position.split(':').map((n) => parseInt(n, 10));
                return { x, y, z };
            });

        if (chunksToGenerate.length > 0) {
            await this.chunkWorker.generateChunks(chunksToGenerate);
        }

        for (const { x, y, z } of chunksToGenerate) {
            const chunkData = await this.chunkWorker.getChunkData(x, y, z);
            if (chunkData) {
                const chunk = new Chunk(x, y, z);
                chunk.hydrate(chunkData);
                this.add(chunk);
            }
        }
    }

    public getBlock = (x: number, y: number, z: number) => {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const chunk = this.getObjectByName(`${chunkX}:${chunkY}:${chunkZ}`) as Chunk;

        if (!chunk) {
            return BlockIds.AIR;
        }

        return chunk.getBlockAbsolute(x, y, z);
    }

    public setBlock = async (x: number, y: number, z: number, block: BlockId) => {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const chunk = this.getObjectByName(`${chunkX}:${chunkY}:${chunkZ}`) as Chunk;

        if (!chunk) {
            throw new OutOfBoundsError(x, y, z);
        }

        await this.chunkWorker.setBlock(x, y, z, block);

        const localX = x - chunk.getOffsetX();
        const localY = y - chunk.getOffsetY();
        const localZ = z - chunk.getOffsetZ();

        const isOnBoundary =
            localX === 0 || localX === CHUNK.WIDTH - 1 ||
            localY === 0 || localY === CHUNK.HEIGHT - 1 ||
            localZ === 0 || localZ === CHUNK.WIDTH - 1;

        const chunkData = await this.chunkWorker.getChunkData(chunkX, chunkY, chunkZ);
        if (chunkData) {
            chunk.hydrate(chunkData);
        }

        if (isOnBoundary) {
            const neighbors = [
                [chunkX - 1, chunkY, chunkZ],
                [chunkX + 1, chunkY, chunkZ],
                [chunkX, chunkY - 1, chunkZ],
                [chunkX, chunkY + 1, chunkZ],
                [chunkX, chunkY, chunkZ - 1],
                [chunkX, chunkY, chunkZ + 1],
            ];

            for (const [nx, ny, nz] of neighbors) {
                const neighborChunk = this.getObjectByName(`${nx}:${ny}:${nz}`) as Chunk;
                if (neighborChunk) {
                    const neighborData = await this.chunkWorker.getChunkData(nx, ny, nz);
                    if (neighborData) {
                        neighborChunk.hydrate(neighborData);
                    }
                }
            }
        }
    }

    private refreshGrid = () => {
        const { loadGrid, keepGrid } = this.calculateGrid();
        const chunksToRemove = new Set<string>();

        if (this.unloadChunks) {
            this.grid.forEach((chunkId) => {
                if (!keepGrid.has(chunkId)) {
                    chunksToRemove.add(chunkId);
                }
            });
        }

        if (this.loadChunks) {
            loadGrid.forEach((chunkId) => {
                if (!this.grid.has(chunkId)) {
                    this.grid.add(chunkId);
                }
            });
        }

        if (this.unloadChunks) {
            chunksToRemove.forEach((chunkId) => {
                this.grid.delete(chunkId);
                const chunk = this.getObjectByName(chunkId) as Chunk;

                if (chunk) {
                    chunk.destroy();
                    this.chunkWorker.unloadChunk(chunk.x, chunk.y, chunk.z);

                    const gc = (globalThis as any).gc;
                    if (typeof gc === 'function') {
                        gc();
                    }
                }
            });
        }
    }

    private calculateGrid(): { loadGrid: Set<string>, keepGrid: Set<string> } {
        const centerChunkX = Math.floor(this.center.x / CHUNK.WIDTH);
        const centerChunkZ = Math.floor(this.center.z / CHUNK.WIDTH);

        const renderDistance = BlockJS.settings?.renderDistance || 8;
        const UNLOAD_BIAS = 2;

        const loadGrid = new Set<string>();
        const keepGrid = new Set<string>();

        let yMin = Math.floor(this.center.y / CHUNK.HEIGHT) - RENDER_DISTANCE_VERTICAL;
        let yMax = Math.floor(this.center.y / CHUNK.HEIGHT) + RENDER_DISTANCE_VERTICAL;

        if (yMin < 0) yMin = 0;
        if (yMax > WORLD_MAX_CHUNK_Y) yMax = WORLD_MAX_CHUNK_Y;

        const grid2dLoad = Grid2D(renderDistance, centerChunkX, centerChunkZ);
        grid2dLoad.forEach(([x, z]) => {
            for (let y = yMin; y <= yMax; y++) {
                loadGrid.add(Chunk.getId(x, y, z));
                keepGrid.add(Chunk.getId(x, y, z));
            }
        });

        const grid2dKeep = Grid2D(renderDistance + UNLOAD_BIAS, centerChunkX, centerChunkZ);
        grid2dKeep.forEach(([x, z]) => {
            for (let y = yMin; y <= yMax; y++) {
                keepGrid.add(Chunk.getId(x, y, z));
            }
        });

        return { loadGrid, keepGrid };
    }

    public updateCenter = (newCenter: Vector3) => {
        this.center.copy(newCenter);

        if (!this.initialized) {
            return;
        }

        this.refreshGrid();
        void this.hydrate();
    }

    public findSpawnPosition(): [number, number, number] {
        const spawnPosition: [number, number, number] = [0, WORLD_MAX_CHUNK_Y * CHUNK.HEIGHT, 0];

        for (let y = spawnPosition[1]; y >= 0; y--) {
            const block = this.getBlock(spawnPosition[0], y, spawnPosition[2]);

            if (block !== BlockIds.AIR) {
                break;
            }

            spawnPosition[1] = y;
        }

        return spawnPosition;
    }
}