export default class AppInitEvent extends Event {
    static readonly NAME = 'app/init';

    public tasks: Promise<any>[] = [];

    constructor() {
        super(AppInitEvent.NAME);
    }
}
