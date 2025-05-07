export default class SessionStartEvent extends Event {
    static readonly NAME = 'session/start';
    
    constructor() {
        super(SessionStartEvent.NAME);
    }
}