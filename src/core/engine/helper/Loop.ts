import { Camera, WebGLRenderer } from 'three';
import CustomScene from '@/core/engine/scene/CustomScene';

export default class Loop {
    private paused = true;
    private lastFrame: number = 0;

    private camera: Camera | null = null

    constructor(
        private readonly renderer: WebGLRenderer,
        private readonly scene: CustomScene,
    ) {

    }

    public setCamera(camera: Camera) {
        this.camera = camera;
    }

    public start() {
        if (!this.paused) {
            return;
        }

        this.getCamera();

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

    public frame() {
        this.getCamera();
        this.renderer.render(this.scene, this.camera!);
    }

    private loop(time: number, lastTime: number) {
        this.innerLoop(this.getDelta(time, lastTime));
        this.lastFrame = requestAnimationFrame((newTime) => this.loop(newTime, time));
    }

    private innerLoop = (delta: number) => {
        this.scene.update(delta);
        this.renderer.render(this.scene, this.camera!);
    }

    private getDelta(time: number, lastTime: number): number {
        return Math.min(time - lastTime, 100) / 1000;
    }

    private flushAnimation() {
        cancelAnimationFrame(this.lastFrame);
    }

    private getCamera() {
        this.camera = this.scene.getMainCamera();

        if (!this.camera) {
            throw new Error('Camera has not been set');
        }
    }
}