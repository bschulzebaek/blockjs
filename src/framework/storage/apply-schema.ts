import GlobalState from '@/engine/worker/states/GlobalState';
import EntityRepository from '@/framework/entities/EntityRepository';
import { IDBPDatabase, openDB } from 'idb';
import ChunkRepository from '@/framework/world/chunk/ChunkRepository';
import StorageAdapter from '@/framework/storage/StorageAdapter';
import InventoryRepository from '@/components/inventory/InventoryRepository';

interface StoreConfig {
    name: string;
    keyPath?: string;
}

const DEFAULT_STORAGE: StoreConfig[] = [{
    name: ChunkRepository.STORE_NAME,
    keyPath: ChunkRepository.KEY_PATH,
}, {
    name: InventoryRepository.STORE_NAME,
    keyPath: InventoryRepository.KEY_PATH,
}, {
    name: EntityRepository.STORE_NAME,
    keyPath: EntityRepository.KEY_PATH,
}];

export default async function applySchema() {
    await openDB(GlobalState.getConfig().getUUID(), StorageAdapter.DATABASE_VERSION, {
        upgrade(database: IDBPDatabase) {
            DEFAULT_STORAGE.forEach((config: StoreConfig) => {
                database.createObjectStore(config.name, config);
            });
        }
    });
}