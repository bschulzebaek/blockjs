import { expose, transfer } from 'comlink';
import type ChunkWorkerInterface from './ChunkWorkerInterface.ts';
import type { BlockId } from '../../../data/block-ids.ts';
import { BlockIds } from '../../../data/block-ids.ts';
import { CHUNK } from '../../defaults.const.ts';
import WorkerWorld from './WorkerWorld.ts';
import type WorkerChunk from './WorkerChunk.ts';
import { ChunkManager } from './chunk/ChunkManager.ts';
import type ChunkData from '../../framework/chunk/ChunkData.ts';

class ChunkWorker implements ChunkWorkerInterface {
    public id = '';
    public world = new WorkerWorld();
    private chunkManager!: ChunkManager;

    constructor() {
        // @ts-ignore
        globalThis.chunkWorker = this;
    }

    public async init(worldId: string): Promise<void> {
        this.id = worldId;
        this.chunkManager = new ChunkManager(this.world);
    }

    public async generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void> {
        await this.chunkManager.generateChunks(chunks);
    }

    public async getChunkData(x: number, y: number, z: number): Promise<ChunkData | null> {
        const chunk = this.world.get(x, y, z);
        if (!chunk || !chunk.ready) {
            return null;
        }
        return this.getResponse(chunk);
    }

    public async getBlock(x: number, y: number, z: number): Promise<BlockId> {
        const chunk = this.world.get(
            Math.floor(x / CHUNK.WIDTH),
            Math.floor(y / CHUNK.HEIGHT),
            Math.floor(z / CHUNK.WIDTH)
        );
        
        if (!chunk) {
            return BlockIds.AIR;
        }

        return chunk.getBlockAbsolute(x, y, z);
    }

    public async setBlock(x: number, y: number, z: number, id: BlockId): Promise<void> {
        await this.chunkManager.setBlock(x, y, z, id);
    }

    private getResponse(chunk: WorkerChunk): ChunkData {
        const payload: ChunkData = {
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

    public async invalidateChunk(x: number, y: number, z: number): Promise<void> {
        const chunk = this.world.get(x, y, z);
        if (chunk) {
            chunk.ready = false;
            await this.chunkManager.generateMesh(chunk);
            await this.chunkManager.saveChunk(chunk);
        }
    }
}

expose(ChunkWorker);