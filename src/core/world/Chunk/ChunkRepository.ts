import Repository from '@/core/engine/storage/Repository';
import type StorageAdapter from '@/core/engine/storage/StorageAdapter';
import Chunk from '@/core/world/Chunk/Chunk';
import StorageObject from '@/core/engine/storage/StorageObject';

export default class ChunkRepository extends Repository {
    static STORE_NAME = 'chunk';

    constructor(adapter: StorageAdapter) {
        super(adapter, ChunkRepository.STORE_NAME);
    }

    public async read(identifier: string): Promise<unknown> {
        return await super.read(identifier) as unknown;
    }

    public readAll(): Promise<unknown[]> {
        return super.readAll();
    }

    public write(chunk: Chunk) {
        return super.write(chunk);
    }

    public writeList(chunks: StorageObject[]) {
        return super.writeList(chunks);
    }
}