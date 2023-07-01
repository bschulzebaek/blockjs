import Inventory from '@/components/inventory/Inventory';

export default class InventoryUpdateEvent extends Event {
    static NAME = 'inventory/update';

    constructor(
        private readonly inventory: Inventory,
    ) {
        super(InventoryUpdateEvent.NAME);
    }

    public getInventory = (): Inventory => this.inventory;
}