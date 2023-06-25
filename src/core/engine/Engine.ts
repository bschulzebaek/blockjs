import World from '@/core/world/World';
import Loop from '@/core/engine/helper/Loop';
import ComponentRegistry from '@/core/engine/scene/ComponentRegistry';
import { AxesHelper, Camera, CameraHelper, Color, Fog, Group, Scene, Vector3, WebGLRenderer } from 'three';
import Cursor from '@/core/components/Cursor';
import Player from '@/core/components/Player';
import FeatureFlags, { Features } from '@/feature-flags';
import WorkerContext from '@/core/engine/WorkerContext';

export default class Engine {
    private readonly renderer = new WebGLRenderer({ canvas: WorkerContext.canvas! });
    private readonly components = new ComponentRegistry();
    private readonly world = new World();
    private readonly scene = new Scene();

    private loop: Loop | null = null;
    private player: Player | null = null;

    public getLoop() {
        if (!this.loop) {
            throw new Error('Loop not initialized!');
        }

        return this.loop;
    }

    public async setupScene() {
        this.player = this.createPlayer();
        const camera = this.player.getCamera();

        this.loop = this.createLoop(camera);

        this.scene.background = new Color(0xb0ddf9);
        this.scene.fog = new Fog(0xf0f0f0, 64, 300); // CHUNK_SIZE, RENDER_DISTANCE

        if (FeatureFlags.get(Features.CURSOR)) {
            const cursor = new Cursor(camera, this.world);
            this.components.addDynamic(cursor);
            this.scene.add(cursor);
        }

        if (FeatureFlags.get(Features.DEBUG)) {
            this.createDebugHelpers(camera);
        }
    }

    public async loadWorld() {
        await this.world.loadChunks();

        const chunks = this.world.getChunks();
        const chunkGroup = new Group();
        chunkGroup.name = 'chunks';
        chunkGroup.position.add(new Vector3(0.5, 0.5, 0.5));

        chunks.forEach((chunk) => chunkGroup.add(chunk));
        this.scene.add(chunkGroup);
    }

    private createDebugHelpers(camera: Camera) {
        const cameraHelper = new CameraHelper(camera);
        // @ts-ignore
        cameraHelper.material.depthTest = false;
        this.scene.add(cameraHelper);

        this.scene.add(new AxesHelper(512));
    }

    private createPlayer(): Player {
        const player = new Player();

        this.scene.add(player);
        this.components.addDynamic(player);
        player.position.set(-2, 0, -2);
        player.rotateY(180);

        return player;
    }

    private createLoop(camera: Camera): Loop {
        const loop = new Loop(this.renderer, this.scene, this.components);

        loop.setCamera(camera);

        return loop;
    }
}