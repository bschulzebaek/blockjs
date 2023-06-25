import { AxesHelper, Camera, CameraHelper, Color, Fog, Object3D, Scene } from 'three';
import ComponentRegistry from '@/core/engine/scene/ComponentRegistry';
import Player from '@/core/components/player/Player';
import FeatureFlags, { Features } from '@/feature-flags';
import Cursor from '@/core/components/player/Cursor';
import World from '@/core/world/World';

export default class CustomScene extends Object3D {
    private readonly components = new ComponentRegistry();
    private player!: Player;

    constructor() {
        super();

        this.createEnvironment();
    }

    public async setup(world: World) {
        this.add(world.getChunkGroup());

        this.createPlayer();
        const camera = this.player.getCamera();

        if (FeatureFlags.get(Features.CURSOR)) {
            const cursor = new Cursor(camera, world);
            this.components.addDynamic(cursor);

            this.add(cursor);
        }

        if (FeatureFlags.get(Features.DEBUG)) {
            this.createDebugHelpers(camera);
        }
    }

    public getComponents() {
        return this.components;
    }

    public getMainCamera() {
        return this.player.getCamera();
    }

    private createEnvironment() {
        // Needs a THREE.Scene
        // this.fog = new Fog(0xf0f0f0, 64, 300); // CHUNK_SIZE, RENDER_DISTANCE
    }

    private createPlayer() {
        const player = new Player('0:0'); // TODO: Get player chunk from IndexedDB

        this.add(player);
        this.components.addDynamic(player);
        player.position.set(4, 2, 4); // TODO: Get player position from IndexedDB

        this.player = player;
    }

    private createDebugHelpers(camera: Camera) {
        const cameraHelper = new CameraHelper(camera);
        // @ts-ignore
        cameraHelper.material.depthTest = false;
        this.add(cameraHelper);

        this.add(new AxesHelper(512));
    }
}