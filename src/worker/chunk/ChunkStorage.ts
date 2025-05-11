import WorkerChunk from './WorkerChunk.ts';
import type FileService from '../../framework/storage/FileService.ts';
import { SerializationUtils } from '../../lib/SerializationUtils.ts';

type ChunkStorageData = {
    blocks: Uint8Array;
};

export default class ChunkStorage {
    /**
     * Take a chunk and save it's block data to the file system. 1 file per chunk, the name is the chunk coordinates.
     * @param chunk
     */
    public save = async (chunk: WorkerChunk) => {
        const fileService = this.getFileService();
        const fileName = chunk.getId();

        // Convert blocks to base64 for storage
        const base64Data = SerializationUtils.arrayBufferToBase64(chunk.blocks.buffer);
        
        // Compress the data
        const compressedData = await this.compress(new TextEncoder().encode(base64Data));
        const compressedBase64 = SerializationUtils.arrayBufferToBase64(compressedData);
        
        // Save to file system
        // @ts-ignore
        await fileService.writeFile(fileName, compressedBase64, globalThis.chunkWorker.id);
    }

    /**
     * Load a chunk from the file system. 1 file per chunk, the name is the chunk coordinates.
     */
    public load = async (x: number, y: number, z: number): Promise<ChunkStorageData | null> => {
        try {
            const fileService = this.getFileService();
            const fileName = WorkerChunk.getId(x, y, z);
            
            // Read and decompress the data
            const compressedBase64 = await fileService.readWorldFile(fileName);
            const compressedData = SerializationUtils.base64ToArrayBuffer(compressedBase64);
            const decompressedData = await this.decompress(new Uint8Array(compressedData));
            
            // Convert back to Uint8Array
            const base64Data = new TextDecoder().decode(decompressedData);
            const blocksBuffer = SerializationUtils.base64ToArrayBuffer(base64Data);
            
            return {
                blocks: new Uint8Array(blocksBuffer)
            };
        } catch (e) {
            // File doesn't exist or other error
            return null;
        }
    }
    
    private async compress(data: Uint8Array): Promise<Uint8Array> {
        const stream = new CompressionStream('gzip');
        const compressedStream = new Blob([data]).stream().pipeThrough(stream);
        const result = await new Response(compressedStream).arrayBuffer();
        return new Uint8Array(result);
    }
    
    private async decompress(data: Uint8Array): Promise<Uint8Array> {
        const stream = new DecompressionStream('gzip');
        const decompressedStream = new Blob([data]).stream().pipeThrough(stream);
        const result = await new Response(decompressedStream).arrayBuffer();
        return new Uint8Array(result);
    }
    
    private getFileService(): FileService {
        // @ts-ignore
        return globalThis.chunkWorker.fileService as FileService;
    }
}