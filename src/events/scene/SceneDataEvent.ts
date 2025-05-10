import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneDataEvent extends LifecycleEvent {
    static readonly NAME = 'scene/data';

    constructor() {
        super(SceneDataEvent.NAME);
    }
}