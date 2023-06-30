import GlobalState from '@/core/GlobalState';
import InventoryRepository from '@/core/components/inventory/InventoryRepository';
import InventoryUpdateEvent from '@/core/components/inventory/events/InventoryUpdateEvent';

class InventoryUpdateSubscriber {
    private repository = new InventoryRepository(GlobalState.getConfig().getUUID());

    constructor() {
        addEventListener(InventoryUpdateEvent.NAME, this.onUpdateInventory as unknown as EventListener)
    }

    private onUpdateInventory = (event: InventoryUpdateEvent) => {
        console.log(event);
    }
}

export default new InventoryUpdateSubscriber();