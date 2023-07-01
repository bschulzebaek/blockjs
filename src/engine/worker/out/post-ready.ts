import EngineMessages from '@/engine/worker/EngineMessages';

export default function postReady() {
    postMessage({
        action: EngineMessages.READY,
    });
}