import CustomRenderer from '@/core/engine/renderer/CustomRenderer';
import Loop from '@/core/engine/helper/Loop';
import CustomScene from '@/core/engine/scene/CustomScene';
import WorldConfig from '@/shared/WorldConfig';
import World from '@/core/world/World';

class GlobalState {
    private config!: WorldConfig;
    private renderer!: CustomRenderer;
    private scene!: CustomScene;
    private loop!: Loop;

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
}

export default new GlobalState();