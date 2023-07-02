import SetupEvent from '@/engine/events/SetupEvent';
import registerSetupSubscriber from '@/engine/lifecycle/setup/register-setup-subscriber';
import registerSubscriber from '@/engine/lifecycle/setup/register-subscriber';
import stepSetupServices from '@/engine/lifecycle/setup/setup-services';
import SceneReadyEvent from '@/engine/scene/SceneReadyEvent';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import applySchema from '@/framework/storage/apply-schema';
import postReady from '@/engine/worker/out/post-ready';
import stepSetupGlobalState from '@/engine/lifecycle/setup/setup-global-state';

export default async function lifecycleSetup(payload: SetupPayload) {
    const start = performance.now();

    await stepSetupGlobalState(payload);
    await stepPreSetup(payload);
    await stepSetupServices();
    await stepSceneReady();

    console.debug(`[Setup] Done in ${((performance.now() - start) / 1000).toFixed(3)}s`);
    postReady();
}

async function stepPreSetup(payload: SetupPayload) {
    await applySchema();
    await registerSetupSubscriber();

    const setupEvent = new SetupEvent(payload);
    dispatchEvent(setupEvent);
    await Promise.all(setupEvent.getPromises());
}

async function stepSceneReady() {
    await registerSubscriber();

    const sceneReadyEvent = new SceneReadyEvent();
    dispatchEvent(sceneReadyEvent);
    await Promise.all(sceneReadyEvent.getPromises());
}
