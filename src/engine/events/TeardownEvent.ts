export default class TeardownEvent extends Event {
    static NAME = 'teardown';

    constructor(
        private readonly promises: Promise<any>[] = [],
    ) {
        super(TeardownEvent.NAME);
    }

    public addPromise(promise: Promise<any>) {
        this.promises.push(promise);
    }

    public getPromises = () => this.promises;
}