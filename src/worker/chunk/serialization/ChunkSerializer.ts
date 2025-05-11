import type { BlockId } from '../../../../data/block-ids.ts';
import type WorkerChunk from '../WorkerChunk.ts';
import { CHUNK_GENERATOR } from '../../../defaults.const.ts';

export class ChunkSerializer {
    private static CHUNK_FORMAT_VERSION = 1;

    public static serializeChunkData(chunk: WorkerChunk): Uint8Array {
        const defaultBlocks = CHUNK_GENERATOR.generate(chunk.x, chunk.y, chunk.z);
        const modifiedBlocks: Array<[number, BlockId]> = [];
        
        // Find modified blocks
        for (let i = 0; i < chunk.blocks.length; i++) {
            if (chunk.blocks[i] !== defaultBlocks[i]) {
                modifiedBlocks.push([i, chunk.blocks[i]]);
            }
        }

        // If no modifications, return empty array
        if (modifiedBlocks.length === 0) {
            chunk.isModified = false;
            return new Uint8Array(0);
        }

        // Calculate buffer size
        const headerSize = 3; // version (1 byte) + modification count (2 bytes)
        const modificationsSize = modifiedBlocks.length * 5; // index (4 bytes) + block id (1 byte)
        
        const buffer = new ArrayBuffer(headerSize + modificationsSize);
        const view = new DataView(buffer);
        let offset = 0;

        // Write header
        view.setUint8(offset, this.CHUNK_FORMAT_VERSION);
        offset += 1;
        view.setUint16(offset, modifiedBlocks.length, true);
        offset += 2;

        // Write modifications
        for (const [index, blockId] of modifiedBlocks) {
            view.setUint32(offset, index, true);
            offset += 4;
            view.setUint8(offset, blockId);
            offset += 1;
        }

        return new Uint8Array(buffer);
    }

    public static deserializeChunkData(
        data: Uint8Array, 
        x: number, 
        y: number, 
        z: number
    ): { blocks: Uint8Array, blockData: Map<string, { id: BlockId }> } {
        const blocks = CHUNK_GENERATOR.generate(x, y, z); // CHUNK_GENERATOR.generate(x, y, z);

        // If no data, return default blocks
        if (data.length === 0) {
            return {
                blocks,
                blockData: new Map()
            };
        }

        const view = new DataView(data.buffer);
        let offset = 0;

        // Read header
        const version = view.getUint8(offset);
        offset += 1;
        if (version !== this.CHUNK_FORMAT_VERSION) {
            throw new Error(`Unsupported chunk format version: ${version}`);
        }

        const modificationCount = view.getUint16(offset, true);
        offset += 2;

        // Read modifications
        for (let i = 0; i < modificationCount; i++) {
            const index = view.getUint32(offset, true);
            offset += 4;
            const blockId = view.getUint8(offset);
            offset += 1;
            blocks[index] = blockId;
        }

        return {
            blocks,
            blockData: new Map()
        };
    }
} 