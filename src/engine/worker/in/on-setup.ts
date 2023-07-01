import lifecycleSetup from '@/engine/lifecycle/setup';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import postReady from '@/engine/worker/out/post-ready';

export default async function onSetup(payload: SetupPayload) {
    await lifecycleSetup(payload);

    postReady();
}