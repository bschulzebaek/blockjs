import SessionLoadEvent from '../lifecycle/session/SessionLoadEvent.ts';

export default class AssetService {
    constructor() {
        window.addEventListener(SessionLoadEvent.NAME, ((event: SessionLoadEvent) => {
            event.tasks.push(this.preload());
        }) as EventListener);
    }
    
    private preload = async () => {
        console.log('should preload scene assets')
    }
}