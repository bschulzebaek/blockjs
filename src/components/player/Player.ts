import Inventory from '@/components/inventory/Inventory';
import destroyBlock from '@/components/player/actions/destroy-block';
import placeBlock from '@/components/player/actions/place-block';
import PlayerController from '@/components/player/PlayerController';
import { CHUNK_SIZE } from '@/configuration';
import GlobalState from '@/engine/worker/states/GlobalState';
import InputMapper from '@/engine/worker/utility/InputMapper';
import Entity from '@/framework/entities/Entity';
import RawEntityStorageObject from '@/framework/entities/EntityStorageObject';
import EntityTypes from '@/framework/entities/EntityTypes';
import BlockRaycaster from '@/framework/world/block/BlockRaycaster';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import UpdateGridEvent from '@/framework/world/events/UpdateGridEvent';
import { Camera, Vector3 } from 'three';

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

    public setPosition(position: Vector3) {
        this.position.copy(position);
    }

    private updateWorldPosition() {
        const id = ChunkUtils.vectorToChunkId(this.position);

        if (id !== this.lastChunkId) {
            this.lastChunkId = id;

            dispatchEvent(new UpdateGridEvent(
                this.position.x,
                this.position.z,
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
            },
        };
    }
}