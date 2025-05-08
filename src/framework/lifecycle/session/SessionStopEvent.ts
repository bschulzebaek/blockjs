export default class SessionStopEvent extends Event {
    static readonly NAME = 'session/stop';
    
    constructor() {
        super(SessionStopEvent.NAME);
    }
}