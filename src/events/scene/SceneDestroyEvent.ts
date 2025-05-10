import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneDestroyEvent extends LifecycleEvent {
    static readonly NAME = 'scene/destroy';
    
    constructor() {
        super(SceneDestroyEvent.NAME);
    }
}