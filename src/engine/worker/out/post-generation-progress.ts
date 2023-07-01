import EngineMessages from '@/engine/worker/EngineMessages';
import GenerationProgressPayload from '@/engine/worker/payloads/GenerationProgressPayload';

export default function postGenerationProgress(payload: GenerationProgressPayload) {
    postMessage({
        action: EngineMessages.WORLD_GENERATION_PROGRESS,
        payload,
    });
}