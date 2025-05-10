import WorkerChunk from './WorkerChunk.ts';
import { CHUNK } from '../../../defaults.const.ts';
import { BlockIds } from '../../../../data/block-ids.ts';

export default class WorkerWorld {
    private chunks = new Map<string, WorkerChunk>();

    public add = (chunk: WorkerChunk) => {
        this.chunks.set(chunk.getId(), chunk);
    }

    public delete = (x: number, y: number, z: number) => {
        this.chunks.delete(WorkerChunk.getId(x, y, z));
    }

    public has = (x: number, y: number, z: number) => {
        return this.chunks.has(WorkerChunk.getId(x, y, z));
    }

    public get = (x: number, y: number, z: number) => {
        return this.chunks.get(WorkerChunk.getId(x, y, z));
    }

    public getBlock = (x: number, y: number, z: number) => {
        const chunkX = Math.floor(x / CHUNK.WIDTH);
        const chunkY = Math.floor(y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(z / CHUNK.WIDTH);
        const chunk = this.get(chunkX, chunkY, chunkZ);

        if (!chunk) {
            return BlockIds.AIR;
        }

        return chunk.getBlockAbsolute(x, y, z);
    }
}