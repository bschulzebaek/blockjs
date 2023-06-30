import InventorySwapPayload from '@/core/components/inventory/InventorySwapPayload';
import InventorySwapEvent from '@/core/components/inventory/events/InventorySwapEvent';

export default function onSwap(payload: InventorySwapPayload) {
    dispatchEvent(new InventorySwapEvent(payload));
}
