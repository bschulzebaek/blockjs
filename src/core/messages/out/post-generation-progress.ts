import GenerationProgressPayload from '@/core/messages/payloads/GenerationProgressPayload';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

export default function postGenerationProgress(payload: GenerationProgressPayload) {
    postMessage({
        action: CoreWorkerMessages.WORLD_GENERATION_PROGRESS,
        payload,
    });
}