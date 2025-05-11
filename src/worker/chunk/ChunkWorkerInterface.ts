import type { BlockId } from '../../../data/block-ids.ts';
import type ChunkData from '../../framework/chunk/ChunkData.ts';

export default interface ChunkWorkerInterface {
    init(worldId: string): Promise<void>;
    
    // Chunk management
    generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void>;
    getChunkData(x: number, y: number, z: number): Promise<ChunkData | null>;
    invalidateChunk(x: number, y: number, z: number): Promise<void>;
    
    // Block operations
    setBlock(x: number, y: number, z: number, id: BlockId): Promise<void>;
    getBlock(x: number, y: number, z: number): Promise<BlockId>;
}