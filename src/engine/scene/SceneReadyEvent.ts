import GlobalState from '@/engine/worker/states/GlobalState';

/**
 * GlobalState, ServiceRegistry and Scene objects are ready.
 */
export default class SceneReadyEvent extends Event {
    static NAME = 'scene/ready';

    constructor() {
        super(SceneReadyEvent.NAME);
    }

    public getScene = () => GlobalState.getScene();
}