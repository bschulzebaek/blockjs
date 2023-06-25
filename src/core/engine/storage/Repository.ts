import StorageAdapter from '@/core/engine/storage/StorageAdapter';
import StorageObject from '@/core/engine/storage/StorageObject';

export default class Repository {
    private readonly storeName: string;

    protected adapter: StorageAdapter;

    constructor(adapter: StorageAdapter, storeName: string) {
        this.adapter = adapter;
        this.storeName = storeName;
    }

    public read(identifier: string): Promise<unknown> {
        return this.adapter.read(this.storeName, identifier);
    }

    public readAll(): Promise<unknown[]> {
        return this.adapter.readAll(this.storeName);
    }

    public async write(obj: StorageObject): Promise<any> {
        await this.adapter.write(this.storeName, obj);
    }

    public writeList(objs: StorageObject[]): Promise<void> {
        return this.adapter.writeList(this.storeName, objs);
    }

    public delete(identifier: string): Promise<void> {
        return this.adapter.delete(this.storeName, identifier);
    }
}