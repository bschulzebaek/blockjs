import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneLoadEvent extends LifecycleEvent {
    static readonly NAME = 'scene/load';

    constructor() {
        super(SceneLoadEvent.NAME);
    }
}