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
    
    private loadChunks = true;
    private unloadChunks = true;
    
    private readonly chunkWorker: ChunkWorkerAdapter;

    constructor(chunkWorker: ChunkWorkerAdapter) {
        super();
        
        this.chunkWorker = chunkWorker;
    }
    
    public init = async () => {
        await this.chunkWorker.init();
        // TODO: get initial center position -> refreshGrid
        this.refreshGrid();
        await this.hydrate();
    }
    
    public hydrate = async () => {
        const sortedGrid = Array.from(this.grid).sort((a, b) => {
            const [ax, ay, az] = a.split(':').map((n) => parseInt(n, 10));
            const [bx, by, bz] = b.split(':').map((n) => parseInt(n, 10));

            const aDistance = this.center.distanceTo(new Vector3(ax, ay, az));
            const bDistance = this.center.distanceTo(new Vector3(bx, by, bz));

            return aDistance - bDistance;
        });

        const chunksToGenerate = sortedGrid.map(position => {
            const [x, y, z] = position.split(':').map((n) => parseInt(n, 10));
            return { x, y, z };
        });

        await this.chunkWorker.generateChunks(chunksToGenerate);

        const chunksToLoad = chunksToGenerate.filter(({ x, y, z }) => !this.getObjectByName(`${x}:${y}:${z}`));
        
        for (const { x, y, z } of chunksToLoad) {
            const chunkData = await this.chunkWorker.getChunkData(x, y, z);
            if (chunkData) {
                const chunk = new Chunk(x, y, z);
                chunk.hydrate(chunkData);
                this.add(chunk);
            }
        }

        this.refreshGrid();
    }

    public getBlock = async (x: number, y: number, z: number) => {
        return this.chunkWorker.getBlock(x, y, z);
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
        
        // Get the local position within the chunk
        const localX = x - chunk.getOffsetX();
        const localY = y - chunk.getOffsetY();
        const localZ = z - chunk.getOffsetZ();

        // Check if the block is on a chunk boundary
        const isOnBoundary = 
            localX === 0 || localX === CHUNK.WIDTH - 1 ||
            localY === 0 || localY === CHUNK.HEIGHT - 1 ||
            localZ === 0 || localZ === CHUNK.WIDTH - 1;

        // Update the current chunk
        const chunkData = await this.chunkWorker.getChunkData(chunkX, chunkY, chunkZ);
        if (chunkData) {
            chunk.hydrate(chunkData);
        }

        // If the block is on a boundary, update neighboring chunks
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
        const grid = this.calculateGrid();
        const chunksToRemove = new Set<string>();
        
        if (this.unloadChunks) {
            this.grid.forEach((chunkId) => {
                if (!grid.has(chunkId)) {
                    chunksToRemove.add(chunkId);
                }
            });
        }
        
        if (this.loadChunks) {
            grid.forEach((chunkId) => {
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
                    const gc = (globalThis as any).gc;
                    if (typeof gc === 'function') {
                        gc();
                    }
                }
            });
        }
    }
    
    private calculateGrid(): Set<string> {
        const centerChunkX = Math.floor(this.center.x / CHUNK.WIDTH);
        const centerChunkZ = Math.floor(this.center.z / CHUNK.WIDTH);
        const grid2d = Grid2D(BlockJS.settings?.renderDistance!, centerChunkX, centerChunkZ);
        const grid3d = new Set<string>();
       
        let yMin = Math.floor(this.center.y / CHUNK.HEIGHT) - RENDER_DISTANCE_VERTICAL;
        let yMax = Math.floor(this.center.y / CHUNK.HEIGHT) + RENDER_DISTANCE_VERTICAL;
       
        if (yMin < 0) {
            yMin = 0;
        }
        
        if (yMax > WORLD_MAX_CHUNK_Y) {
            yMax = WORLD_MAX_CHUNK_Y;
        }
        
        grid2d.forEach(([x, z]) => {
            for (let y = yMin; y <= yMax; y++) {
                grid3d.add(Chunk.getId(x, y, z));
            }
        });
       
        return grid3d;
    }

    public updateCenter = (newCenter: Vector3) => {
        this.center.copy(newCenter);
        void this.hydrate();
    }

    public getBlockSync = (x: number, y: number, z: number): BlockId => {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const chunk = this.getObjectByName(`${chunkX}:${chunkY}:${chunkZ}`) as Chunk;
        
        if (!chunk) {
            return BlockIds.AIR;
        }

        return chunk.getBlockAbsolute(x, y, z);
    }
}