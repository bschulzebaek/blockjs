import type { BlockId } from '../../../../../data/block-ids.ts';
import FileService from '../../../storage/FileService.ts';
import { CHUNKS_PERSIST } from '../../../../defaults.const.ts';
import { CompressionUtils } from '../utils/CompressionUtils.ts';
import { SerializationUtils } from '../utils/SerializationUtils.ts';

export interface ChunkData {
    blocks: Uint8Array;
    blockData: Map<string, { id: BlockId }>;
}

export class ChunkStorage {
    private static CHUNK_FORMAT_VERSION = 1;

    constructor(
        private readonly fileService: FileService,
        private readonly worldId: string
    ) {}

    public async init(): Promise<void> {
        if (CHUNKS_PERSIST) {
            await this.fileService.init();
        }
    }

    public async saveChunk(
        x: number, 
        y: number, 
        z: number, 
        data: Uint8Array, 
        isModified: boolean
    ): Promise<void> {
        if (!CHUNKS_PERSIST || !isModified) return;

        try {
            // If no modifications, try to delete the chunk file if it exists
            if (data.length === 0) {
                try {
                    await this.fileService.readFile(this.getChunkFileName(x, y, z), this.worldId);
                    // If we get here, the file exists, so ideally we should delete it
                    // Note: We would need a delete method in FileService for this
                } catch (e) {
                    // File doesn't exist, which is fine
                }
                return;
            }

            const compressedData = await CompressionUtils.compress(data);
            const base64Data = SerializationUtils.arrayBufferToBase64(compressedData.buffer);
            
            await this.fileService.writeFile(
                this.getChunkFileName(x, y, z),
                base64Data,
                this.worldId
            );
            console.debug(`[ChunkStorage] Saved chunk: ${x}:${y}:${z}`);
        } catch (e) {
            console.error(`[ChunkStorage] Failed to save chunk ${x}:${y}:${z}. `, e);
        }
    }

    public async loadChunk(x: number, y: number, z: number): Promise<Uint8Array | null> {
        if (!CHUNKS_PERSIST) return null;

        try {
            const base64Data = await this.fileService.readFile(
                this.getChunkFileName(x, y, z),
                this.worldId
            );

            if (!base64Data) {
                return null;
            }

            const arrayBuffer = SerializationUtils.base64ToArrayBuffer(base64Data);
            const compressedData = new Uint8Array(arrayBuffer);
            const decompressedData = await CompressionUtils.decompress(compressedData);
            
            return decompressedData;
        } catch (e) {
            if (e instanceof Error && e.name === 'NotFoundError') {
                // This is normal for chunks that haven't been modified
                return null;
            }
            console.error(`[ChunkStorage] Failed to load chunk ${x}:${y}:${z} for world ${this.worldId}:`, e);
            return null;
        }
    }

    private getChunkFileName(x: number, y: number, z: number): string {
        return `chunk_${x}_${y}_${z}.bin`;
    }
} 