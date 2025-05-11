import { expose, transfer } from 'comlink';
import type ChunkWorkerInterface from './ChunkWorkerInterface.ts';
import type { BlockId } from '../../../data/block-ids.ts';
import WorkerWorld from './WorkerWorld.ts';
import type WorkerChunk from './WorkerChunk.ts';
import { ChunkService } from './ChunkService.ts';
import type ChunkData from '../../framework/chunk/ChunkData.ts';
import FileService from '../../framework/storage/FileService.ts';

class ChunkWorker implements ChunkWorkerInterface {
    public id = '';
    public world = new WorkerWorld();
    public fileService = new FileService();
    private chunkService = new ChunkService(this.world);

    constructor() {
        // @ts-ignore
        globalThis.chunkWorker = this;
    }

    public async init(worldId: string): Promise<void> {
        this.id = worldId;
        await this.fileService.init();
        this.fileService.setWorldId(worldId);
    }

    public async generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void> {
        await this.chunkService.generateChunks(chunks);
    }

    public async getChunkData(x: number, y: number, z: number): Promise<ChunkData | null> {
        const chunk = this.world.get(x, y, z);
        
        if (!chunk || !chunk.ready) {
            return null;
        }
        
        return this.getResponse(chunk);
    }

    public async setBlock(x: number, y: number, z: number, id: BlockId): Promise<void> {
        await this.chunkService.setBlock(x, y, z, id);
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
}

expose(ChunkWorker);