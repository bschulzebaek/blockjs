import TeardownEvent from '@/engine/events/TeardownEvent';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';

class TeardownSubscriber {
    constructor() {
        addEventListener(TeardownEvent.NAME, this.onTeardown as unknown as EventListener);
    }

    private onTeardown = (event: TeardownEvent) => {
        event.addPromise(ServiceRegistry.getEntityService().saveAll());
    }
}

export default new TeardownSubscriber();