import ComponentRegistry from '@/core/engine/scene/ComponentRegistry';
import { Camera, Scene, WebGLRenderer } from 'three';

export default class Loop {
    private paused = true;
    private lastFrame: number = 0;

    private camera: Camera | null = null

    constructor(
        private readonly renderer: WebGLRenderer,
        private readonly scene: Scene,
        private readonly components: ComponentRegistry,
    ) {

    }

    public setCamera(camera: Camera) {
        this.camera = camera;
    }

    public start() {
        if (!this.paused) {
            return;
        }

        if (!this.camera) {
            throw new Error('Camera has not been set');
        }

        this.flushAnimation();
        this.paused = false;

        requestAnimationFrame((time) => this.loop(time, 0));
    }

    public stop() {
        if (this.paused) {
            return;
        }

        this.paused = true;
        this.flushAnimation();
    }

    private loop(time: number, lastTime: number) {
        this.innerLoop(this.getDelta(time, lastTime));
        this.lastFrame = requestAnimationFrame((newTime) => this.loop(newTime, time));
    }

    private innerLoop = (delta: number) => {
        // console.log(delta, performance.now())

        this.components.iterateDynamic((component) => {
            component.update(delta);
        });

        this.renderer.render(this.scene, this.camera!);
    }

    private getDelta(time: number, lastTime: number): number {
        return Math.min(time - lastTime, 100) / 1000;
    }

    private flushAnimation() {
        cancelAnimationFrame(this.lastFrame);
    }
}