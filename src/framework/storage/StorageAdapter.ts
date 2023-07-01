import { openDB } from 'idb';
import StorageObject from '@/framework/storage/StorageObject';

enum TransactionMode {
    READ = 'readonly',
    WRITE = 'readwrite'
}

export default class StorageAdapter {

    static DATABASE_VERSION = 1;

    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public async read(storeName: string, key: string): Promise<unknown> {
        const db = await openDB(this.name, StorageAdapter.DATABASE_VERSION);
        let tx = db.transaction(storeName, TransactionMode.READ);
        let store = tx.objectStore(storeName);

        const result = await store.get(key);
        await tx.done;

        return result;
    }

    public async readAll(storeName: string): Promise<unknown[]> {
        const db = await openDB(this.name, StorageAdapter.DATABASE_VERSION);
        let tx = db.transaction(storeName, TransactionMode.READ);
        let store = tx.objectStore(storeName);

        const result = await store.getAll();
        await tx.done;

        return result;
    }

    public async write(storeName: string, obj: StorageObject): Promise<void> {
        const db = await openDB(this.name, StorageAdapter.DATABASE_VERSION);
        let tx = db.transaction(storeName, TransactionMode.WRITE);
        let store = tx.objectStore(storeName);

        await Promise.all([
            store.put(obj.toStorage()),
            tx.done,
        ]);
    }

    public async writeList(storeName: string, objs: StorageObject[]): Promise<void> {
        const db = await openDB(this.name, StorageAdapter.DATABASE_VERSION);
        let tx = db.transaction(storeName, TransactionMode.WRITE);
        let store = tx.objectStore(storeName);

        await Promise.all([
            ...objs.map((obj) => store.put(obj.toStorage())),
            tx.done,
        ]);
    }

    public async delete(storeName: string, key: string): Promise<void> {
        const db = await openDB(this.name, StorageAdapter.DATABASE_VERSION);
        let tx = db.transaction(storeName, TransactionMode.WRITE);
        let store = tx.objectStore(storeName);

        await Promise.all([
            store.delete(key),
            tx.done,
        ]);
    }
}