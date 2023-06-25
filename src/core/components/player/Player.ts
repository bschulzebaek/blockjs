import { Camera, Object3D, PerspectiveCamera } from 'three';
import PlayerController from '@/core/components/player/PlayerController';
import { RESOLUTION } from '@/settings';
import WorkerContext from '@/core/engine/WorkerContext';
import Chunk from '@/core/world/Chunk/Chunk';
import { CHUNK_SIZE, DEFAULT_BLOCK_PLACEMENT } from '@/configuration';
import UpdateGridEvent from '@/core/components/player/events/UpdateGridEvent';
import BlockRaycaster from '@/core/world/Block/BlockRaycaster';
import destroyBlock from '@/core/components/player/actions/destroy-block';
import placeBlock from '@/core/components/player/actions/place-block';

export default class Player extends Object3D {
    static HEIGHT = 1.8;
    static WIDTH = 0.6;

    private camera: Camera;
    private controller: PlayerController;

    private world = WorkerContext.engine!.getWorld();
    private raycaster: BlockRaycaster;

    constructor(
        private lastChunkId: string = '0:0'
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
        const id = Chunk.positionToId(this.position);

        if (id !== this.lastChunkId) {
            this.lastChunkId = id;

            dispatchEvent(new UpdateGridEvent(
                Math.floor(this.position.x / CHUNK_SIZE),
                Math.floor(this.position.z / CHUNK_SIZE),
            ));
        }
    }

    private registerActions() {
        WorkerContext.input.subscribeClick(this.onClick.bind(this));
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
        const result = this.raycaster.intersectWorld();

        if (!result) {
            return;
        }

        placeBlock(result.position, result.face, DEFAULT_BLOCK_PLACEMENT);
    }
}