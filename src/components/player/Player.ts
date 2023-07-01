import Inventory from '@/components/inventory/Inventory';
import destroyBlock from '@/components/player/actions/destroy-block';
import placeBlock from '@/components/player/actions/place-block';
import getStartLocation from '@/components/player/get-start-location';
import PlayerController from '@/components/player/PlayerController';
import { CHUNK_SIZE } from '@/configuration';
import CustomScene from '@/engine/scene/CustomScene';
import GlobalState from '@/engine/worker/states/GlobalState';
import InputMapper from '@/engine/worker/utility/InputMapper';
import Entity from '@/framework/entities/Entity';
import EntityStorageObject from '@/framework/entities/EntityStorageObject';
import RawEntityStorageObject from '@/framework/entities/EntityStorageObject';
import EntityTypes from '@/framework/entities/EntityTypes';
import BlockRaycaster from '@/world/block/BlockRaycaster';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import UpdateGridEvent from '@/world/events/UpdateGridEvent';
import { Camera, Vector3, Euler } from 'three';

export default class Player extends Entity {
    static ID = 'player';

    static HEIGHT = 1.8;
    static WIDTH = 0.6;

    private controller: PlayerController;
    private world = GlobalState.getWorld();
    private raycaster: BlockRaycaster;
    private inventory!: Inventory;
    private lastChunkId: string;

    constructor(
        private camera: Camera,
        position: Vector3,
    ) {
        super(EntityTypes.PLAYER, Player.ID);
        this.name = Player.ID;

        this.lastChunkId = `${Math.floor(position.x / CHUNK_SIZE)}:${Math.floor(position.z / CHUNK_SIZE)}`;

        this.position.copy(position);
        this.rotation.set(0, 0, 0);

        this.controller = new PlayerController(this, this.camera);
        this.add(this.camera);

        this.raycaster = new BlockRaycaster(this.world, this.camera);

        this.registerActions();
    }

    public update(delta: number) {
        this.controller.update(delta);
        this.updateWorldPosition();
    }

    public getCamera() {
        return this.camera;
    }

    public setCamera(camera: Camera) {
        this.camera = camera;
    }

    public setPosition(x: number, y: number, z: number) {
        this.position.set(x, y, z);
    }

    private updateWorldPosition() {
        const id = ChunkUtils.positionToId(this.position);

        if (id !== this.lastChunkId) {
            this.lastChunkId = id;

            dispatchEvent(new UpdateGridEvent(
                Math.floor(this.position.x / CHUNK_SIZE),
                Math.floor(this.position.z / CHUNK_SIZE),
            ));
        }
    }

    private registerActions() {
        InputMapper.subscribeClick(this.onClick.bind(this));
    }

    private onClick(button: number) {
        switch (button) {
            case 0:
                return this.onLeftClick();
            case 2:
                return this.onRightClick();
        }
    }

    private onLeftClick() {
        const result = this.raycaster.intersectWorld();

        if (!result) {
            return;
        }

        destroyBlock(result.position, result.block);
    }

    private onRightClick() {
        const target = this.raycaster.intersectWorld();
        const activeItem = this.inventory.getActiveSlot();

        if (!target || !activeItem) {
            return;
        }

        placeBlock(target.position, target.face, activeItem.id);
    }

    public setInventory = (inventory: Inventory) => this.inventory = inventory;

    public getInventory = () => {
        if (!this.inventory) {
            throw new Error('Player inventory not set');
        }

        return this.inventory;
    }

    public toStorage(): RawEntityStorageObject {
        const { x, y, z } = this.position;
        const { x: rx, y: ry, z: rz } = this.rotation;

        return {
            id: Player.ID,
            type: EntityTypes.PLAYER,
            position: {
                x,
                y,
                z,
            },
            rotation: {
                x: rx,
                y: ry,
                z: rz,
            }
        };
    }

    static fromStorageObject(obj: EntityStorageObject, scene: CustomScene) {
        const position = new Vector3(obj.position.x, obj.position.y, obj.position.z);
        const rotation = new Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z);

        const player = new Player(scene.getMainCamera(), position);

        player.rotation.copy(rotation);

        return player;
    }

    static createNew(scene: CustomScene) {
        return new Player(scene.getMainCamera(), getStartLocation(scene));
    }
}