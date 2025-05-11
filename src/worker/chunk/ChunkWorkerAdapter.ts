import { type Remote, wrap } from 'comlink';
import type ChunkWorkerInterface from './ChunkWorkerInterface.ts';
import type { BlockId } from '../../../data/block-ids.ts';
import type ChunkData from '../../framework/chunk/ChunkData.ts';

export default class ChunkWorkerAdapter {
    private worker!: Remote<ChunkWorkerInterface>;
    
    public init = async () => {
        const wrapper = wrap(new Worker(new URL('./Chunk.worker.ts?worker', import.meta.url), {
            type: 'module',
        }));
        
        // @ts-ignore
        this.worker = await new wrapper();
        await this.worker.init(BlockJS.getWorldId());
    };
    
    public generateChunks = async (chunks: Array<{ x: number, y: number, z: number }>) => {
        await this.worker.generateChunks(chunks);
    }
    
    public getChunkData = async (x: number, y: number, z: number): Promise<ChunkData | null> => {
        return this.worker.getChunkData(x, y, z);
    }
    
    public invalidateChunk = async (x: number, y: number, z: number) => {
        await this.worker.invalidateChunk(x, y, z);
    }
    
    public getBlock = async (x: number, y: number, z: number): Promise<BlockId> => {
        return this.worker.getBlock(x, y, z);
    }
    
    public setBlock = async (x: number, y: number, z: number, id: BlockId): Promise<void> => {
        await this.worker.setBlock(x, y, z, id);
    }
}