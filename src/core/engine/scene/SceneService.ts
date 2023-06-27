import FeatureFlags, { Features } from '@/shared/FeatureFlags';
import Cursor from '@/core/components/player/Cursor';
import Player from '@/core/components/player/Player';
import CustomScene from '@/core/engine/scene/CustomScene';
import { AxesHelper, Camera, CameraHelper, Fog } from 'three';
import World from '@/core/world/World';
import { CHUNK_SIZE, PLAYER_START } from '@/configuration';
import { RENDER_DISTANCE } from '@/settings';

class SceneService {

    private scene!: CustomScene;

    public async setupScene(scene: CustomScene, world: World) {
        this.scene = scene;

        scene.add(world);

        const player = this.createPlayer(scene);
        const camera = player.getCamera();

        scene.setMainCamera(camera);

        if (FeatureFlags.get(Features.CURSOR)) {
            const cursor = new Cursor(camera, world);
            scene.getComponents().addDynamic(cursor);
            scene.add(cursor);
        }

        if (FeatureFlags.get(Features.DEBUG)) {
            this.createDebugHelpers(camera);
        }

        this.createEnvironment();
    }

    private createPlayer(scene: CustomScene) {
        const chunkX = Math.floor(PLAYER_START.x / CHUNK_SIZE),
            chunkZ = Math.floor(PLAYER_START.z / CHUNK_SIZE);

        const player = new Player(`${chunkX}:${chunkZ}`);

        scene.add(player);
        scene.getComponents().addDynamic(player);
        player.position.copy(PLAYER_START);

        return player;
    }

    private createEnvironment() {
        const near = CHUNK_SIZE * RENDER_DISTANCE - CHUNK_SIZE * 2;
        const far = CHUNK_SIZE * RENDER_DISTANCE + CHUNK_SIZE;

        this.scene.fog = new Fog(0xf0f0f0, near < 80 ? 80 : near, far < 208 ? 208 : far);
    }

    private createDebugHelpers(camera: Camera) {
        const cameraHelper = new CameraHelper(camera);
        // @ts-ignore
        cameraHelper.material.depthTest = false;
        this.scene.add(cameraHelper);

        this.scene.add(new AxesHelper(512));
    }
}

export default new SceneService();