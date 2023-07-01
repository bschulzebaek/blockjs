import Cursor from '@/components/player/Cursor';
import CustomScene from '@/engine/scene/CustomScene';
import SceneReadyEvent from '@/engine/scene/SceneReadyEvent';
import FeatureFlags, { Features } from '@/framework/feature-flags/FeatureFlags';
import { CameraHelper, AxesHelper } from 'three';

class SceneReadySubscriber {
    constructor() {
        addEventListener(SceneReadyEvent.NAME, this.onSceneReady as unknown as EventListener);
    }

    private onSceneReady = (event: SceneReadyEvent) => {
        removeEventListener(SceneReadyEvent.NAME, this.onSceneReady as unknown as EventListener);

        const scene = event.getScene();

        this.createCursor(scene);
        this.createDebugHelpers(scene);
    }

    private createCursor(scene: CustomScene) {
        if (FeatureFlags.get(Features.CURSOR)) {
            const camera = scene.getMainCamera();
            const world = scene.getWorld();

            const cursor = new Cursor(camera, world);
            scene.add(cursor);
        }
    }

    private createDebugHelpers(scene: CustomScene) {
        if (FeatureFlags.get(Features.DEBUG)) {
            const camera = scene.getMainCamera();

            const cameraHelper = new CameraHelper(camera);
            // @ts-ignore
            cameraHelper.material.depthTest = false;
            scene.add(cameraHelper);

            scene.add(new AxesHelper(512));
        }
    }
}

export default new SceneReadySubscriber();