import PlayerFactory from '@/components/player/PlayerFactory';
import Entity from '@/framework/entities/Entity';
import EntityStorageObject from '@/framework/entities/EntityStorageObject';

export default class EntityFactory {
    static async fromStorageObject(storageObject: EntityStorageObject): Promise<Entity> {
        const type = storageObject.type;

        switch (type) {
            case 'player':
                return await PlayerFactory.fromStorageObject(storageObject);
            default:
                throw new Error(`Unknown entity of type "${type}"`);
        }
    }
}