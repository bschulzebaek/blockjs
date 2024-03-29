import Repository from '@/framework/storage/Repository';
import StorageAdapter from '@/framework/storage/StorageAdapter';
import StorageObject from '@/framework/storage/StorageObject';
import InventorySlot from '@/components/inventory/InventorySlot';
import Inventory from '@/components/inventory/Inventory';

export interface InventoryObject {
    id: string;
    slots: InventorySlot[];
    activeIndex: number;
}

export default class InventoryRepository extends Repository {
    static STORE_NAME = 'inventory';
    static KEY_PATH = 'id';

    constructor(uuid: string) {
        super(new StorageAdapter(uuid), InventoryRepository.STORE_NAME);
    }

    public async read(identifier: string): Promise<InventoryObject | undefined> {
        return await super.read(identifier) as InventoryObject | undefined;
    }

    public async readAll(): Promise<InventoryObject[]> {
        return await super.readAll() as InventoryObject[];
    }

    public write(inventory: Inventory) {
        return super.write(inventory);
    }

    public writeList(inventories: StorageObject[]) {
        return super.writeList(inventories);
    }
}