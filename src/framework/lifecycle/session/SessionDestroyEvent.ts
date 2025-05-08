export default class SessionDestroyEvent extends Event {
    static readonly NAME = 'session/destroy';
    
    constructor() {
        super(SessionDestroyEvent.NAME);
    }
}