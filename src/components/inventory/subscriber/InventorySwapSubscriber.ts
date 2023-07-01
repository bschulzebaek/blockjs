import InventoryRepository from '@/components/inventory/InventoryRepository';
import InventorySwapEvent from '@/components/inventory/events/InventorySwapEvent';
import postInventoryTransfer from '@/components/inventory/messages/post-inventory-transfer';
import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';

class InventorySwapSubscriber {
    private repository = new InventoryRepository(GlobalState.getConfig().getUUID());
    private service = ServiceRegistry.getInventoryService();

    constructor() {
        addEventListener(InventorySwapEvent.NAME, this.onSwap as unknown as EventListener)
    }

    private onSwap = (event: InventorySwapEvent) => {
        const { from, to } = event.getSwap()
        const indexA = from.index;
        const indexB = to.index;
        const idA = from.id;
        const idB = to.id;

        if (indexA !== indexB) {
            return this.swapInventories(indexA, indexB, idA, idB);
        } else {
            return this.swapInventory(indexA, indexB, idA);
        }
    }

    private swapInventories(indexA: number, indexB: number, idA: string, idB: string) {
        const inventoryA = this.service.getInventory(idA);
        const inventoryB = this.service.getInventory(idB);

        if (!inventoryA || !inventoryB) {
            console.debug(inventoryA);
            console.debug(inventoryB);
            throw new Error(`At least one Inventory not found!`);
        }

        const tmp = inventoryA.getSlot(indexA);
        inventoryA.setSlot(indexA, inventoryB.getSlot(indexB));
        inventoryB.setSlot(indexB, tmp);

        this.repository.writeList([inventoryA, inventoryB]);
        postInventoryTransfer(inventoryA, inventoryB);
    }

    private swapInventory(indexA: number, indexB: number, id: string) {
        const inventory = this.service.getInventory(id);

        if (!inventory) {
            throw new Error(`Inventory not found!`);
        }

        const temp = inventory.getSlot(indexA);
        inventory.setSlot(indexA, inventory.getSlot(indexB));
        inventory.setSlot(indexB, temp);

        this.repository.write(inventory);
        postInventoryTransfer(inventory);
    }
}

export default new InventorySwapSubscriber();