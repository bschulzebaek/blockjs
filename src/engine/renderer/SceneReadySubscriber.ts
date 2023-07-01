import SceneReadyEvent from '@/engine/scene/SceneReadyEvent';
import GlobalState from '@/engine/worker/states/GlobalState';

class SceneReadySubscriber {
    constructor() {
        addEventListener(SceneReadyEvent.NAME, this.onSceneReady as unknown as EventListener);
    }

    private onSceneReady = (event: SceneReadyEvent) => {
        removeEventListener(SceneReadyEvent.NAME, this.onSceneReady as unknown as EventListener);

        GlobalState.getLoop().frame();
    }
}

export default new SceneReadySubscriber();