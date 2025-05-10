import type { BlockId } from '../../../../data/block-ids.ts';
import type GenerationResponse from './GenerationResponse.ts';

export default interface ChunkWorkerInterface {
    init(worldId: string): Promise<void>;
    
    // Chunk management
    generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void>;
    getChunkData(x: number, y: number, z: number): Promise<GenerationResponse | null>;
    invalidateChunk(x: number, y: number, z: number): Promise<void>;
    
    // Block operations
    setBlock(x: number, y: number, z: number, id: BlockId): Promise<void>;
    getBlock(x: number, y: number, z: number): Promise<BlockId>;
}