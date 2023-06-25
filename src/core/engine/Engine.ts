import World from '@/core/world/World';
import Loop from '@/core/engine/helper/Loop';
import { WebGLRenderer } from 'three';
import WorkerContext from '@/core/engine/WorkerContext';
import CustomScene from '@/core/engine/scene/CustomScene';

export default class Engine {
    private readonly renderer = new WebGLRenderer({ canvas: WorkerContext.canvas! });
    private readonly world: World = new World();
    private readonly scene: CustomScene = new CustomScene();

    private loop: Loop = new Loop(this.renderer, this.scene);

    constructor() {
        import('@/core/engine/load-subscriber');
    }

    public getRenderer() {
        return this.renderer;
    }

    public getScene() {
        return this.scene;
    }

    public getLoop() {
        return this.loop;
    }

    public getWorld() {
        return this.world;
    }
}