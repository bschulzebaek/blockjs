import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneStartEvent extends LifecycleEvent{
    static readonly NAME = 'scene/start';
    
    constructor() {
        super(SceneStartEvent.NAME);
    }
}