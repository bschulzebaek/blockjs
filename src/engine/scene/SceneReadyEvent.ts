import GlobalState from '@/engine/worker/states/GlobalState';

/**
 * GlobalState, ServiceRegistry and Scene objects are ready.
 */
export default class SceneReadyEvent extends Event {
    static NAME = 'scene/ready';

    constructor(
        private readonly promises: Promise<any>[] = [],
    ) {
        super(SceneReadyEvent.NAME);
    }

    public getScene = () => GlobalState.getScene();

    public addPromise(promise: Promise<any>) {
        this.promises.push(promise);
    }

    public getPromises = () => this.promises;
}