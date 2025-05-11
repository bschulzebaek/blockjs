import type { BlockId } from '../../../data/block-ids.ts';
import { CHUNK, CHUNK_GENERATOR, WORLD_MAX_CHUNK_Y } from '../../defaults.const.ts';
import { Vector3 } from 'three';
import type WorkerWorld from './WorkerWorld.ts';
import WorkerChunk from './WorkerChunk.ts';
import createGeometry from './create-geometry.ts';
import CoordinatesHelper from '../../lib/CoordinatesHelper.ts';
import ChunkStorage from './ChunkStorage.ts';

export class ChunkService {
    private readonly world: WorkerWorld;
    private readonly storage = new ChunkStorage();
    
    constructor(world: WorkerWorld) {
        this.world = world;
    }

    public async generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void> {
        // First, generate all chunks that don't exist yet
        const chunksToGenerate = chunks.filter(({ x, y, z }) => !this.world.has(x, y, z));
        if (chunksToGenerate.length > 0) {
            await Promise.all(chunksToGenerate.map(({ x, y, z }) => this.generateBlocks(x, y, z)));
        }

        // Then, ensure all chunks have their meshes generated
        const chunksToMesh = chunks.filter(({ x, y, z }) => {
            const chunk = this.world.get(x, y, z);
            return chunk && !chunk.ready;
        });
        
        if (chunksToMesh.length > 0) {
            await Promise.all(chunksToMesh.map(({ x, y, z }) => {
                const chunk = this.world.get(x, y, z)!;
                return this.generateMesh(chunk);
            }));
        }
    }

    public async setBlock(x: number, y: number, z: number, id: BlockId): Promise<void> {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const position = this.worldToChunkCoords(x, y, z);
        const chunk = this.world.get(chunkX, chunkY, chunkZ);

        if (!chunk) {
            throw new Error(`Chunk at ${chunkX}:${chunkY}:${chunkZ} is not loaded!`);
        }

        const index = this.chunkCoordsToIndex(position.x, position.y, position.z);

        // Update the block in the chunk
        chunk.blocks[index] = id;
        chunk.isModified = true;

        // Get all chunks that need to be updated (current chunk and affected neighbors)
        const chunksToUpdate = this.getAffectedChunks(chunkX, chunkY, chunkZ, position);
        
        // First pass: Save all modified chunks
        await Promise.all(Array.from(chunksToUpdate).map(async ([cx, cy, cz]) => {
            const targetChunk = this.world.get(cx, cy, cz);
            if (targetChunk?.isModified) {
                await this.saveChunk(targetChunk);
            }
        }));

        // Second pass: Invalidate caches and regenerate meshes
        await Promise.all(Array.from(chunksToUpdate).map(async ([cx, cy, cz]) => {
            const targetChunk = this.world.get(cx, cy, cz);
            if (targetChunk) {
                this.world.invalidateCache(cx, cy, cz);
                targetChunk.ready = false;
                await this.generateMesh(targetChunk);
            }
        }));
    }

    private getAffectedChunks(x: number, y: number, z: number, blockPosition: Vector3): Set<[number, number, number]> {
        const chunksToUpdate = new Set<[number, number, number]>([[x, y, z]]);

        // Add neighbors if block is on a chunk boundary
        if (blockPosition.x === 0) {
            chunksToUpdate.add([x - 1, y, z]);
        } else if (blockPosition.x === CHUNK.WIDTH - 1) {
            chunksToUpdate.add([x + 1, y, z]);
        }

        if (blockPosition.y === 0) {
            chunksToUpdate.add([x, y - 1, z]);
        } else if (blockPosition.y === CHUNK.HEIGHT - 1) {
            chunksToUpdate.add([x, y + 1, z]);
        }

        if (blockPosition.z === 0) {
            chunksToUpdate.add([x, y, z - 1]);
        } else if (blockPosition.z === CHUNK.WIDTH - 1) {
            chunksToUpdate.add([x, y, z + 1]);
        }

        return chunksToUpdate;
    }

    private async generateBlocks(x: number, y: number, z: number): Promise<void> {
        const neighbors = [
            [x,     y,     z],
            [x + 1, y,     z],
            [x - 1, y,     z],
            [x,     y + 1, z],
            [x,     y - 1, z],
            [x,     y,     z + 1],
            [x,     y,     z - 1],
        ];

        const promises = neighbors
            .filter(([_, aY, __]) => aY <= WORLD_MAX_CHUNK_Y)
            .map(async ([aX, aY, aZ]) => {
                if (this.world.has(aX, aY, aZ)) {
                    return;
                }
                
                // Try to load chunk modifications from storage first
                const savedData = await this.storage.load(aX, aY, aZ);
                
                if (savedData) {
                    return this.world.add(new WorkerChunk(aX, aY, aZ, savedData.blocks, new Map(), true));
                }

                // If no saved chunk exists, use the default generation
                this.world.add(new WorkerChunk(aX, aY, aZ, CHUNK_GENERATOR.generate(aX, aY, aZ), new Map(), false));
            });

        await Promise.all(promises);
    }

    public async generateMesh(chunk: WorkerChunk): Promise<void> {
        const geometry = createGeometry(chunk, this.world);
        chunk.opaque = geometry.opaque;
        chunk.transparent = geometry.transparent;
        chunk.ready = true;
    }

    private saveChunk(chunk: WorkerChunk): Promise<void> {
        return this.storage.save(chunk);
    }

    private worldToChunkCoords(x: number, y: number, z: number): Vector3 {
        return new Vector3(
            x - Math.floor(x / CHUNK.WIDTH) * CHUNK.WIDTH,
            y - Math.floor(y / CHUNK.HEIGHT) * CHUNK.HEIGHT,
            z - Math.floor(z / CHUNK.WIDTH) * CHUNK.WIDTH
        );
    }

    private chunkCoordsToIndex(x: number, y: number, z: number): number {
        return CoordinatesHelper.ChunkCoordsToIndex(x, y, z);
    }
} 
