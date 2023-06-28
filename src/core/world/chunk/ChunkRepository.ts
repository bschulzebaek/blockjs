import Repository from '@/core/engine/storage/Repository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';
import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import StorageObject from '@/core/engine/storage/StorageObject';

interface ChunkObject {
    id: string;
    blocks: BlockMap;
}

export default class ChunkRepository extends Repository {
    static STORE_NAME = 'chunk';
    static KEY_PATH = 'id';

    constructor(uuid: string) {
        super(new StorageAdapter(uuid), ChunkRepository.STORE_NAME);
    }

    public async read(identifier: string): Promise<ChunkObject | undefined> {
        return await super.read(identifier) as ChunkObject | undefined;
    }

    public async readAll(): Promise<ChunkObject[]> {
        return await super.readAll() as ChunkObject[];
    }

    public write(chunk: Chunk) {
        return super.write(chunk);
    }

    public writeList(chunks: StorageObject[]) {
        return super.writeList(chunks);
    }
}