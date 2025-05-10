import LifecycleEvent from '../LifecycleEvent.ts';

export default class SceneStopEvent extends LifecycleEvent {
    static readonly NAME = 'scene/stop';
    
    constructor() {
        super(SceneStopEvent.NAME);
    }
}