import SetupPayload from '@/engine/worker/payloads/SetupPayload';

/**
 * GlobalState is available, ServiceRegistry is not.
 */
export default class SetupEvent extends Event {
    static NAME = 'setup';

    constructor(
        private readonly payload: SetupPayload,
        private readonly promises: Promise<any>[] = [],
    ) {
        super(SetupEvent.NAME);
    }

    public getPayload = () => this.payload;

    public addPromise(promise: Promise<any>) {
        this.promises.push(promise);
    }

    public getPromises = () => this.promises;
}