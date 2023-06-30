import { Camera, Object3D, PerspectiveCamera } from 'three';
import PlayerController from '@/core/components/player/PlayerController';
import { RESOLUTION } from '@/settings';
import { CHUNK_SIZE, DEFAULT_BLOCK_PLACEMENT } from '@/configuration';
import UpdateGridEvent from '@/core/world/events/UpdateGridEvent';
import BlockRaycaster from '@/core/world/block/BlockRaycaster';
import destroyBlock from '@/core/components/player/actions/destroy-block';
import placeBlock from '@/core/components/player/actions/place-block';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import WorldService from '@/core/world/WorldService';
import InputMapper from '@/core/engine/helper/InputMapper';
import Inventory from '@/core/components/inventory/Inventory';
import BlockId from '@/core/world/block/BlockId';
import GlobalState from '@/core/GlobalState';

export default class Player extends Object3D {
    static HEIGHT = 1.8;
    static WIDTH = 0.6;

    private camera: Camera;
    private controller: PlayerController;

    private world = WorldService.getWorld();
    private raycaster: BlockRaycaster;

    constructor(
        private readonly inventory: Inventory,
        private lastChunkId: string = '0:0',
    ) {
        super();
        this.name = 'player';

        this.rotation.set(0, 0, 0);

        this.camera = this.createCamera();
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

    private createCamera() {
        const camera = new PerspectiveCamera(
            90,
            RESOLUTION.X / RESOLUTION.Y,
            0.01,
            CHUNK_SIZE /* * RENDER_DISTANCE */ * 10 + CHUNK_SIZE,
        );

        camera.position.set(
            -Player.WIDTH / 2,
            Player.HEIGHT * 0.9,
            -Player.WIDTH / 2
        );

        return camera;
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

    public getInventory() {
        return this.inventory;
    }
}