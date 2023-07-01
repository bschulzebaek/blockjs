import SetupEvent from '@/engine/events/SetupEvent';
import SceneReadyEvent from '@/engine/scene/SceneReadyEvent';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import applySchema from '@/framework/storage/apply-schema';
import postReady from '@/engine/worker/out/post-ready';
import setupGlobalState from '@/engine/setup-global-state';
import setupServices from '@/engine/setup-services';

export default async function lifecycleSetup(payload: SetupPayload) {
    console.debug('[Setup] Start');
    const start = performance.now();

    setupGlobalState(payload);
    await applySchema();
    await import('@/load-setup-subscriber');

    dispatchEvent(new SetupEvent(payload));

    await setupServices();

    await import('@/load-subscriber');

    dispatchEvent(new SceneReadyEvent());

    console.debug(`[Setup] End - ${((performance.now() - start) / 1000).toFixed(3)}s`);
    postReady();
}