import SetupEvent from '@/engine/events/SetupEvent';
import FeatureFlags from '@/framework/feature-flags/FeatureFlags';

class SetupSubscriber {
    constructor() {
        addEventListener(SetupEvent.NAME, this.onSetup as unknown as EventListener);
    }

    private onSetup = (event: SetupEvent) => {
        removeEventListener(SetupEvent.NAME, this.onSetup as unknown as EventListener);

        FeatureFlags.setFromSearchParams(new URLSearchParams(event.getPayload().parameters));
    }
}

export default new SetupSubscriber();