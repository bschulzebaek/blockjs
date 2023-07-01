import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import MessagePayload from '@/core/messages/payloads/MessagePayload';
import { BlockCache } from '@/core/world/generation/worker/caches';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import processGeneration from '@/core/world/generation/worker/process-generation';
import ProcessingQueue from '@/utility/ProcessingQueue';

const queue = new ProcessingQueue(processGeneration);

onmessage = (event: MessageEvent<MessagePayload>) => {
    const payload = event.data.payload as GeneratorMessagePayload;

    switch (event.data.action) {
        case CoreWorkerMessages.CHUNK_INVALIDATE:
            BlockCache.delete(payload.id);
            break;
        case CoreWorkerMessages.CHUNK_GENERATE:
            queue.addData(payload);
            break;
        default:
            throw new Error(`Unknown action "${event.data.action}"`);
    }
};
