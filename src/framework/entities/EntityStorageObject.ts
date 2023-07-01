import EntityTypes from '@/framework/entities/EntityTypes';
import { RawStorageObject } from '@/framework/storage/StorageObject';

export default interface EntityStorageObject extends RawStorageObject {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
    type: EntityTypes;
}