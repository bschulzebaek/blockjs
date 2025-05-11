import type { BlockId } from '../../../data/block-ids.ts';
import type ChunkData from '../../framework/chunk/ChunkData.ts';

export default interface ChunkWorkerInterface {
    init(worldId: string): Promise<void>;
    
    generateChunks(chunks: Array<{ x: number, y: number, z: number }>): Promise<void>;
    getChunkData(x: number, y: number, z: number): Promise<ChunkData | null>;
    setBlock(x: number, y: number, z: number, id: BlockId): Promise<void>;
}