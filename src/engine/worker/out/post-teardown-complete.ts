import EngineMessages from '@/engine/worker/EngineMessages';

export default function postTeardownComplete() {
    postMessage({
        action: EngineMessages.TEARDOWN_COMPLETE,
    });
}