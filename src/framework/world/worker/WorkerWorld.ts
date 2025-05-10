import WorkerChunk from './WorkerChunk.ts';
import { CHUNK } from '../../../defaults.const.ts';
import { BlockIds } from '../../../../data/block-ids.ts';

export default class WorkerWorld {
    private chunks = new Map<string, WorkerChunk>();
    private loadedFromDisk = new Set<string>();
    private fileCache = new Map<string, string>();

    public add = (chunk: WorkerChunk) => {
        this.chunks.set(chunk.getId(), chunk);
    }

    public delete = (x: number, y: number, z: number) => {
        const id = WorkerChunk.getId(x, y, z);
        this.chunks.delete(id);
        this.loadedFromDisk.delete(id);
        this.fileCache.delete(id);
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

    public isLoadedFromDisk = (x: number, y: number, z: number) => {
        return this.loadedFromDisk.has(WorkerChunk.getId(x, y, z));
    }

    public markLoadedFromDisk = (x: number, y: number, z: number) => {
        this.loadedFromDisk.add(WorkerChunk.getId(x, y, z));
    }

    public getCachedFile = (x: number, y: number, z: number) => {
        return this.fileCache.get(WorkerChunk.getId(x, y, z));
    }

    public setCachedFile = (x: number, y: number, z: number, content: string) => {
        this.fileCache.set(WorkerChunk.getId(x, y, z), content);
    }

    public invalidateCache = (x: number, y: number, z: number) => {
        this.fileCache.delete(WorkerChunk.getId(x, y, z));
    }

    public clear = () => {
        this.chunks.clear();
        this.loadedFromDisk.clear();
        this.fileCache.clear();
    }
}