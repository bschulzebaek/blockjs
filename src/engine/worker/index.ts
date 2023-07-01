import inventoryMessageHandler from '@/components/inventory/messages/inventory-message-handler';
import EngineMessageHandler from '@/engine/EngineMessageHandler';
import MessagePayload from '@/engine/worker/payloads/MessagePayload';

const DOMAIN_DELIMITER = '/';

onmessage = (event: MessageEvent<MessagePayload>): void => {
    const [handler] = event.data.action.split(DOMAIN_DELIMITER);

    switch (handler) {
        case 'engine':
            return EngineMessageHandler.onMessage(event);
        case 'inventory':
            return inventoryMessageHandler(event);
        default:
            throw new Error(`Unknown message handler: ${handler}`);
    }
};