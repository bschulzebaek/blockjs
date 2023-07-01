import InventoryMessages from '@/components/inventory/messages/InventoryMessages';
import MessagePayload from '@/engine/worker/payloads/MessagePayload';
import onSetIndex from '@/components/inventory/messages/on-set-index';
import ActiveItemPayload from '@/components/inventory/ActiveItemPayload';
import onSwap from '@/components/inventory/messages/on-swap';
import InventorySwapPayload from '@/components/inventory/InventorySwapPayload';

export default function inventoryMessageHandler(event: MessageEvent<MessagePayload>) {
    const { action, payload } = event.data;

    switch (action) {
        case InventoryMessages.INVENTORY_SET_INDEX:
            return onSetIndex(payload as ActiveItemPayload);
        case InventoryMessages.INVENTORY_SWAP:
            return onSwap(payload as InventorySwapPayload);
        default:
            console.debug(event);
            throw new Error(`Unknown action: ${event.data.action}`);
    }
}