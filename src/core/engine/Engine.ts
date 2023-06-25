import World from '@/core/world/World';
import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import Loop from '@/core/engine/Loop';
import ComponentRegistry from '@/core/engine/ComponentRegistry';
import { AxesHelper, CameraHelper, Color, Fog, Group, Scene, Vector3, WebGLRenderer } from 'three';
import Cursor from '@/core/components/Cursor';
import Player from '@/core/components/Player';
import FeatureFlags, { Features } from '@/feature-flags';

export default class Engine {
    private readonly renderer = new WebGLRenderer({ canvas: this.canvas });
    private readonly components = new ComponentRegistry();
    private readonly world = new World(this.config.getSeed());
    private readonly scene = new Scene();

    private readonly player = this.createPlayer();
    private readonly loop: Loop = this.createLoop();

    constructor(
        private readonly canvas: OffscreenCanvas,
        private readonly config: WorldConfig,
    ) {
        this.setupScene();
        this.createDemoWorld();
        this.createDebugHelpers();
    }

    public getLoop() {
        return this.loop;
    }

    private createDemoWorld() {
        const chunks = this.world.getChunks();
        const chunkGroup = new Group();
        chunkGroup.name = 'chunks';
        chunkGroup.position.add(new Vector3(0.5, 0.5, 0.5));

        chunks.forEach((chunk) => chunkGroup.add(chunk));
        this.scene.add(chunkGroup);
    }

    private createDebugHelpers() {
        if (!FeatureFlags.get(Features.DEBUG_HELPERS)) {
            return;
        }

        const cameraHelper = new CameraHelper(this.player.getCamera());
        // @ts-ignore
        cameraHelper.material.depthTest = false;
        this.scene.add(cameraHelper);

        this.scene.add(new AxesHelper(512));
    }

    private setupScene() {
        this.scene.background = new Color(0xb0ddf9);
        this.scene.fog = new Fog(0xf0f0f0, 64, 300); // CHUNK_SIZE, RENDER_DISTANCE

        if (FeatureFlags.get(Features.CURSOR)) {
            const cursor = new Cursor(this.player.getCamera(), this.world);
            this.components.addDynamic(cursor);
            this.scene.add(cursor);
        }
    }

    private createPlayer(): Player {
        const player = new Player();

        this.scene.add(player);
        this.components.addDynamic(player);
        player.position.set(-2, 0, -2);

        return player;
    }

    private createLoop(): Loop {
        const loop = new Loop(this.renderer, this.scene, this.components);
        loop.setCamera(this.player.getCamera());

        return loop;
    }
}