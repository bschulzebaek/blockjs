import GlobalState from '@/engine/worker/states/GlobalState';
import Player from '@/components/player/Player';
import CustomScene from '@/engine/scene/CustomScene';
import { Fog, PerspectiveCamera } from 'three';
import { CHUNK_SIZE } from '@/configuration';

export default class SceneService {

    private scene!: CustomScene;

    public setup() {
        this.scene = GlobalState.getScene();
        this.scene.add(GlobalState.getWorld());
        this.scene.setMainCamera(this.createCamera());

        this.createEnvironment();
    }

    private createEnvironment() {
        // const renderDistance = GlobalState.getSettings().getRenderDistance();
        // const near = CHUNK_SIZE * renderDistance - CHUNK_SIZE * 2;
        // const far = CHUNK_SIZE * renderDistance + CHUNK_SIZE;
        //
        // this.scene.fog = new Fog(0xf0f0f0, near < 80 ? 80 : near, far < 208 ? 208 : far);
    }

    private createCamera() {
        const settings = GlobalState.getSettings();
        const resX = settings.getResolutionX();
        const resY = settings.getResolutionY();

        const camera = new PerspectiveCamera(
            90,
            resX / resY,
            0.01,
            CHUNK_SIZE * GlobalState.getSettings().getRenderDistance() + CHUNK_SIZE * 2,
        );

        camera.position.set(
            -Player.WIDTH / 2,
            Player.HEIGHT * 0.9,
            -Player.WIDTH / 2
        );

        return camera;
    }
}