import CustomRenderer from '@/core/engine/renderer/CustomRenderer';
import Loop from '@/core/engine/helper/Loop';
import CustomScene from '@/core/engine/scene/CustomScene';
import WorldConfig from '@/shared/WorldConfig';
import World from '@/core/world/World';
import WorldGenerator from '@/core/world/generation/WorldGenerator';
import Player from '@/core/components/player/Player';

class GlobalState {
    private config!: WorldConfig;
    private renderer!: CustomRenderer;
    private scene!: CustomScene;
    private loop!: Loop;
    private world!: World;
    private generator!: WorldGenerator;

    constructor() {
        // @ts-ignore
        globalThis.__state = this;
    }

    public setConfig(config: WorldConfig) {
        this.config = config;
    }

    public getConfig() {
        return this.config;
    }

    public setRenderer(renderer: CustomRenderer) {
        this.renderer = renderer;
    }

    public getRenderer() {
        return this.renderer;
    }

    public setScene(scene: CustomScene) {
        this.scene = scene;
    }

    public getScene() {
        return this.scene;
    }

    public setLoop(loop: Loop) {
        this.loop = loop;
    }

    public getLoop() {
        return this.loop;
    }

    public getWorld() {
        return this.scene.getObjectByName('world') as World;
    }

    public setGenerator(generator: WorldGenerator) {
        this.generator = generator;
    }

    public getGenerator() {
        return this.generator;
    }

    public getPlayer() {
        return this.scene.getObjectByName('player') as Player;
    }
}

export default new GlobalState();