import { type Remote, wrap } from 'comlink';
import type ChunkWorkerInterface from './ChunkWorkerInterface.ts';
import Chunk from '../Chunk.ts';
import type { BlockId } from '../../../../data/block-ids.ts';
import type GenerationResponse from './GenerationResponse.ts';

export default class ChunkWorkerAdapter {
    private worker!: Remote<ChunkWorkerInterface>;
    private pending = new Map<string, number>();
    
    public init = async () => {
        const wrapper = wrap(new Worker(new URL('./Chunk.worker.ts?worker', import.meta.url), {
            type: 'module',
        }));
        
        // @ts-ignore
        this.worker = await new wrapper();
        await this.worker.init(BlockJS.id!);
    };
    
    public generateChunks = async (chunks: Array<{ x: number, y: number, z: number }>) => {
        await this.worker.generateChunks(chunks);
    }
    
    public getChunkData = async (x: number, y: number, z: number): Promise<GenerationResponse | null> => {
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