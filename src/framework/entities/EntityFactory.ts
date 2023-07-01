import Player from '@/components/player/Player';
import CustomScene from '@/engine/scene/CustomScene';
import Entity from '@/framework/entities/Entity';
import EntityStorageObject from '@/framework/entities/EntityStorageObject';

export default class EntityFactory {
    static fromStorageObject(storageObject: EntityStorageObject, scene: CustomScene): Entity {
        const type = storageObject.type;

        switch (type) {
            case 'player':
                return Player.fromStorageObject(storageObject, scene);
            default:
                throw new Error(`Unknown entity of type "${type}"`);
        }
    }
}