import postInventoryTransfer from '@/components/inventory/messages/post-inventory-transfer';
import getStartLocation from '@/components/player/get-start-location';
import Player from '@/components/player/Player';
import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import EntityStorageObject from '@/framework/entities/EntityStorageObject';
import { Vector3, Euler } from 'three';

export default class PlayerFactory {
    static async fromStorageObject(obj: EntityStorageObject) {
        const position = new Vector3(obj.position.x, obj.position.y, obj.position.z);
        const rotation = new Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        const scene = GlobalState.getScene();
        const inventory = await ServiceRegistry.getInventoryService().getPlayerInventory();

        const player = new Player(scene.getMainCamera(), position);
        player.rotation.copy(rotation);
        player.setInventory(inventory);
        postInventoryTransfer(inventory);

        return player;
    }

    static async createNew() {
        const scene = GlobalState.getScene();
        const inventory = await ServiceRegistry.getInventoryService().getPlayerInventory();

        const player = new Player(scene.getMainCamera(), getStartLocation(scene));
        player.setInventory(inventory);
        postInventoryTransfer(inventory);

        return player;
    }
}