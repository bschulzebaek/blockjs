import Inventory from '@/components/inventory/Inventory';
import InventoryMessages from '@/components/inventory/messages/InventoryMessages';

export default function postInventoryTransfer(...inventories: Inventory[]) {
    postMessage({
        action: InventoryMessages.INVENTORY_TRANSFER,
        payload: inventories,
    });
}