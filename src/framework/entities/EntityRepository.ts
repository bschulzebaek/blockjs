import EntityStorageObject from '@/framework/entities/EntityStorageObject';
import Repository from '@/framework/storage/Repository';
import StorageAdapter from '@/framework/storage/StorageAdapter';

export default class EntityRepository extends Repository {
    static STORE_NAME = 'entity';
    static KEY_PATH = 'id';

    constructor(uuid: string) {
        super(new StorageAdapter(uuid), EntityRepository.STORE_NAME);
    }

    public async read(identifier: string) {
        return await super.read(identifier) as EntityStorageObject | undefined
    }

    public async readAll(): Promise<EntityStorageObject[]> {
        return await super.readAll() as EntityStorageObject[];
    }

    public write(entity: any) {
        return super.write(entity);
    }

    public writeList(entities: any[]) {
        return super.writeList(entities);
    }
}