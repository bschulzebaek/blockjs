import { IDBPDatabase, openDB } from 'idb';
import ChunkRepository from '@/core/world/Chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';

interface StoreConfig {
    name: string;
    keyPath?: string;
}

const DEFAULT_STORAGE: StoreConfig[] = [{
    name: ChunkRepository.STORE_NAME,
    keyPath: 'id',
}];

export default async function firstTimeSetup(worldId: string) {
    await openDB(worldId, StorageAdapter.DATABASE_VERSION, {
        upgrade(database: IDBPDatabase) {
            DEFAULT_STORAGE.forEach((config: StoreConfig) => {
                database.createObjectStore(config.name, config);
            });
        }
    });
}