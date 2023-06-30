import MessagePayload from '@/core/messages/payloads/MessagePayload';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import onSetIndex from '@/core/components/inventory/messages/on-set-index';
import ActiveItemPayload from '@/core/components/inventory/ActiveItemPayload';
import onSwap from '@/core/components/inventory/messages/on-swap';
import InventorySwapPayload from '@/core/components/inventory/InventorySwapPayload';

export default function inventoryMessageHandler(event: MessageEvent<MessagePayload>) {
    const { action, payload } = event.data;

    switch (action) {
        case CoreWorkerMessages.INVENTORY_SET_INDEX:
            return onSetIndex(payload as ActiveItemPayload);
        case CoreWorkerMessages.INVENTORY_SWAP:
            return onSwap(payload as InventorySwapPayload);
        default:
            console.debug(event);
            throw new Error(`Unknown action: ${event.data.action}`);
    }
}