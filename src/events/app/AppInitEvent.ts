import LifecycleEvent from '../LifecycleEvent.ts';

export default class AppInitEvent extends LifecycleEvent {
    static readonly NAME = 'app/init';

    constructor() {
        super(AppInitEvent.NAME);
    }
}
