import SetupPayload from '@/engine/worker/payloads/SetupPayload';

/**
 * GlobalState is available, ServiceRegistry is not.
 */
export default class SetupEvent extends Event {
    static NAME = 'setup';

    constructor(
        private readonly payload: SetupPayload,
    ) {
        super(SetupEvent.NAME);
    }

    public getPayload = () => this.payload;
}