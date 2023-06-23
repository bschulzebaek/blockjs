import World from '@/core/world/World';
import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import Loop from '@/core/engine/Loop';
import ComponentRegistry from '@/core/engine/ComponentRegistry';
import {
    AxesHelper,
    Camera,
    CameraHelper,
    Color, Fog,
    Group,
    Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';
import PlayerController from '@/core/components/PlayerController';

export default class Engine {
    private readonly renderer = new WebGLRenderer({ canvas: this.canvas });
    private readonly scene = new Scene();
    private readonly components = new ComponentRegistry();

    private readonly mainCamera: Camera;
    private readonly world = new World(this.config.getSeed());
    private readonly loop: Loop;

    constructor(
        private readonly canvas: OffscreenCanvas,
        private readonly config: WorldConfig,
    ) {
        this.mainCamera = this.createCamera();
        this.scene.add(this.createPlayer(this.mainCamera));

        this.setupScene();
        this.initDemoWorld();
        this.addDebugHelpers(this.mainCamera);

        this.loop = new Loop(this.renderer, this.mainCamera, this.scene, this.components);
    }

    public getLoop() {
        return this.loop;
    }

    private initDemoWorld() {
        const chunks = this.world.getChunks();
        const chunkGroup = new Group();
        chunkGroup.name = 'chunks';

        chunks.forEach((chunk) => chunkGroup.add(chunk));
        this.scene.add(chunkGroup);
    }

    private addDebugHelpers(camera: Camera) {
        const cameraHelper = new CameraHelper(camera);
        // @ts-ignore
        cameraHelper.material.depthTest = false;
        this.scene.add(cameraHelper);
        this.scene.add(new AxesHelper(512));
    }

    private setupScene() {
        this.scene.background = new Color(0xb0ddf9);
        this.scene.fog = new Fog(0xf0f0f0, 64, 300);
    }

    private createPlayer(camera: Camera): Object3D {
        const player = new Object3D();
        player.add(camera);

        this.components.addDynamic('player-controller', new PlayerController(player, camera));

        this.components.addStatic('camera', camera);

        player.position.set(32, 48, 32);
        camera.position.set(0, 1.6, 0);

        return player;
    }

    private createCamera() {
        const camera = new PerspectiveCamera(
            90,
            this.canvas.width / this.canvas.height,
            0.01,
            10000, // World.CHUNK_SIZE * World.RENDER_DISTANCE + World.CHUNK_SIZE,
        );
        camera.name = 'camera';

        return camera;
    }
}