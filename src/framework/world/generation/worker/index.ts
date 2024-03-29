import GeneratorMessagePayload from '@/framework/world/generation/worker/GeneratorMessagePayload';
import MessagePayload from '@/engine/worker/payloads/MessagePayload';
import { BlockCache } from '@/framework/world/generation/worker/caches';
import processGeneration from '@/framework/world/generation/worker/process-generation';
import ProcessingQueue from '@/shared/utility/ProcessingQueue';
import WorldMessages from '@/framework/world/WorldMessages';

const queue = new ProcessingQueue(processGeneration);

onmessage = (event: MessageEvent<MessagePayload>) => {
    const payload = event.data.payload as GeneratorMessagePayload;

    switch (event.data.action) {
        case WorldMessages.CHUNK_INVALIDATE:
            BlockCache.delete(payload.id);
            break;
        case WorldMessages.CHUNK_GENERATE:
            queue.addData(payload);
            break;
        default:
            throw new Error(`Unknown action "${event.data.action}"`);
    }
};
