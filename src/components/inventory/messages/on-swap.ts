import InventorySwapPayload from '@/components/inventory/InventorySwapPayload';
import InventorySwapEvent from '@/components/inventory/events/InventorySwapEvent';

export default function onSwap(payload: InventorySwapPayload) {
    dispatchEvent(new InventorySwapEvent(payload));
}
