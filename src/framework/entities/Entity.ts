import RawEntityStorageObject from '@/framework/entities/EntityStorageObject';
import EntityTypes from '@/framework/entities/EntityTypes';
import StorageObject from '@/framework/storage/StorageObject';
import generateUUID from '@/shared/utility/generate-uuid';
import { Object3D } from 'three';

export default class Entity extends Object3D implements StorageObject {
    constructor(
        private readonly entityType: EntityTypes,
        private readonly entityId: string = generateUUID(),
    ) {
        super();
    }

    public toStorage(): RawEntityStorageObject {
        throw new Error('Method not implemented.');
    }
}