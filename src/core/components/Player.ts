import { Camera, Object3D, PerspectiveCamera } from 'three';
import PlayerController from '@/core/components/PlayerController';
import { RESOLUTION } from '@/settings';

export default class Player extends Object3D {
    static HEIGHT = 1.8;
    static WIDTH = 0.6;

    private camera: Camera;
    private controller: PlayerController;

    constructor() {
        super();

        this.name = 'player';

        this.rotation.set(0, 0, 0);

        this.camera = this.createCamera();
        this.controller = new PlayerController(this, this.camera);
        this.add(this.camera);
    }

    public update(delta: number) {
        this.controller.update(delta);
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
            10000, // CHUNK_SIZE * RENDER_DISTANCE + CHUNK_SIZE,
        );

        camera.position.set(
            -Player.WIDTH / 2,
            Player.HEIGHT * 0.9,
            -Player.WIDTH / 2
        );

        return camera;
    }
}