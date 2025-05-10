import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneCollectEvent extends LifecycleEvent {
    static readonly NAME = 'scene/collect';

    constructor() {
        super(SceneCollectEvent.NAME);
    }
}