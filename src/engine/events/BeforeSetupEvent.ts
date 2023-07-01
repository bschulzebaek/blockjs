import SetupPayload from '@/engine/worker/payloads/SetupPayload';

export default class BeforeSetupEvent extends Event {
    static NAME = 'setup/before';

    constructor(
        private readonly payload: SetupPayload,
    ) {
        super(BeforeSetupEvent.NAME);
    }

    public getPayload = () => this.payload;
}