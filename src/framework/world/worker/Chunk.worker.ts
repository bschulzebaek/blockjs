import { expose, transfer } from 'comlink';
import type ChunkWorkerInterface from './ChunkWorkerInterface.ts';
import type GenerationResponse from './GenerationResponse.ts';
import WorkerChunk from './WorkerChunk.ts';
import { CHUNK, CHUNK_GENERATOR, WORLD_MAX_CHUNK_Y } from '../../../defaults.const.ts';
import { BlockIds, type BlockId } from '../../../../data/block-ids.ts';
import CoordinatesHelper from '../CoordinatesHelper.ts';
import WorkerWorld from './WorkerWorld.ts';
import createGeometry from '../geometry/create-geometry.ts';
import type { Vector3 } from 'three';

class ChunkWorker implements ChunkWorkerInterface {
    public id = '';
    public world = new WorkerWorld();

    private useFileSystem = false;

    constructor() {
        // @ts-ignore
        globalThis.chunkWorker = this;
    }

    public async init(worldId: string) {
        this.id = worldId;
    }
    
    public async generateChunks(chunks: Array<{ x: number, y: number, z: number }>) {
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

    public async getChunkData(x: number, y: number, z: number): Promise<GenerationResponse | null> {
        const chunk = this.world.get(x, y, z);
        if (!chunk || !chunk.ready) {
            return null;
        }
        return this.getResponse(chunk);
    }

    public async invalidateChunk(x: number, y: number, z: number) {
        const chunk = this.world.get(x, y, z);
        if (chunk) {
            chunk.ready = false;
            await this.generateMesh(chunk);
        }
    }

    public async getBlock(x: number, y: number, z: number): Promise<BlockId> {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const chunk = this.world.get(chunkX, chunkY, chunkZ);
        if (!chunk) {
            return BlockIds.AIR;
        }

        const position = CoordinatesHelper.WorldCoordsToChunkCoords(x, y, z);
        const index = CoordinatesHelper.ChunkCoordsToIndex(position.x, position.y, position.z);
        return chunk.blocks[index];
    }

    public async setBlock(x: number, y: number, z: number, id: BlockId) {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);

        const position = CoordinatesHelper.WorldCoordsToChunkCoords(x, y, z);
        const chunk = this.world.get(chunkX, chunkY, chunkZ);

        if (!chunk) {
            throw new Error(`Chunk at ${chunkX}:${chunkY}:${chunkZ} is not loaded!`);
        }

        console.debug(`[Chunk.worker] Setting block ${position.x}:${position.y}:${position.z} -> ${id}`);

        const index = CoordinatesHelper.ChunkCoordsToIndex(position.x, position.y, position.z);
        chunk.blocks[index] = id;
        const key = `${position.x}:${position.y}:${position.z}`;
        chunk.blockData.set(key, { id });

        // Invalidate the chunk and its neighbors if the block is on a boundary
        await this.invalidateChunkAndNeighbors(chunkX, chunkY, chunkZ, position);
    }

    private async invalidateChunkAndNeighbors(x: number, y: number, z: number, blockPosition: Vector3) {
        const chunksToInvalidate = new Set<[number, number, number]>([[x, y, z]]);

        if (blockPosition.x === 0) {
            chunksToInvalidate.add([x - 1, y, z]);
        } else if (blockPosition.x === CHUNK.WIDTH - 1) {
            chunksToInvalidate.add([x + 1, y, z]);
        }

        if (blockPosition.y === 0) {
            chunksToInvalidate.add([x, y - 1, z]);
        } else if (blockPosition.y === CHUNK.HEIGHT - 1) {
            chunksToInvalidate.add([x, y + 1, z]);
        }

        if (blockPosition.z === 0) {
            chunksToInvalidate.add([x, y, z - 1]);
        } else if (blockPosition.z === CHUNK.WIDTH - 1) {
            chunksToInvalidate.add([x, y, z + 1]);
        }

        await Promise.all(Array.from(chunksToInvalidate).map(([cx, cy, cz]) => 
            this.invalidateChunk(cx, cy, cz)
        ));
    }

    private async generateBlocks(x: number, y: number, z: number) {
        let promises: Promise<void>[] = [];

        [
            [x,     y,     z],
            [x + 1, y,     z],
            [x - 1, y,     z],
            [x,     y + 1, z],
            [x,     y - 1, z],
            [x,     y,     z + 1],
            [x,     y,     z - 1],
        ].forEach(([aX, aY, aZ]) => {
            if (aY > WORLD_MAX_CHUNK_Y) {
                return;
            }

            promises.push((async () => {
                if (this.world.has(aX, aY, aZ)) {
                    return;
                }

                const blocks = CHUNK_GENERATOR.generate(aX, aY, aZ);
                const data = await this.getBlockData(aX, aY, aZ);

                this.applyBlockData(blocks, data);

                this.world.add(new WorkerChunk(aX, aY, aZ, blocks, data));
            })());
        });
        
        await Promise.all(promises);
    }

    private async generateMesh(chunk: WorkerChunk) {
        const geometry = createGeometry(chunk, this.world);
        chunk.opaque = geometry.opaque;
        chunk.transparent = geometry.transparent;
        chunk.ready = true;
    }
    
    private getResponse(chunk: WorkerChunk) {
        const payload: GenerationResponse = {
            x: chunk.x,
            y: chunk.y,
            z: chunk.z,
            blocks: new Uint8Array(chunk.blocks),
            opaque: {
                positions: this.copyArrayBuffer(chunk.opaque!.positions),
                normals: this.copyArrayBuffer(chunk.opaque!.normals),
                uvs: this.copyArrayBuffer(chunk.opaque!.uvs),
                colors: this.copyArrayBuffer(chunk.opaque!.colors),
            },
            transparent: {
                positions: this.copyArrayBuffer(chunk.transparent!.positions),
                normals: this.copyArrayBuffer(chunk.transparent!.normals),
                uvs: this.copyArrayBuffer(chunk.transparent!.uvs),
                colors: this.copyArrayBuffer(chunk.transparent!.colors),
            },
        };
        
        return transfer(payload, [
            payload.blocks.buffer,
            payload.opaque.positions,
            payload.opaque.normals,
            payload.opaque.uvs,
            payload.opaque.colors,
            payload.transparent.positions,
            payload.transparent.normals,
            payload.transparent.uvs,
            payload.transparent.colors,
        ]);
    }

    private copyArrayBuffer(source: ArrayBuffer): ArrayBuffer {
        const dst = new ArrayBuffer(source.byteLength);
        new Float32Array(dst).set(new Float32Array(source));
        return dst;
    }

    private applyBlockData(blocks: Uint8Array, data: Map<string, { id: BlockId }>) {
        for (const [key, value] of data) {
            const [x, y, z] = key.split(':').map((v) => parseInt(v, 10));
            blocks[CoordinatesHelper.ChunkCoordsToIndex(x, y, z)] = value.id;
        }
    }
    
    private async getBlockData(_x: number, _y: number, _z: number) {
        return new Map();
    }
}

expose(ChunkWorker);