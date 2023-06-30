import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import Inventory from '@/core/components/inventory/Inventory';

export default function postInventoryTransfer(...inventories: Inventory[]) {
    postMessage({
        action: CoreWorkerMessages.INVENTORY_TRANSFER,
        payload: inventories,
    });
}