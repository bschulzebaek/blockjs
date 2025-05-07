export default class SessionLoadEvent extends Event {
    static readonly NAME = 'session/load';

    public tasks: Promise<any>[] = [];

    constructor() {
        super(SessionLoadEvent.NAME);
    }
}