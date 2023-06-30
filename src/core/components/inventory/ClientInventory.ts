import InventorySlot from '@/core/components/inventory/InventorySlot';
import { InventoryObject } from '@/core/components/inventory/InventoryRepository';
import WorkerAdapter from '@/app/(game)/[uuid]/WorkerAdapter';

export default class ClientInventory {
    private readonly id: string;
    private readonly slots: Array<InventorySlot | null>;
    private readonly activeIndex: number;

    constructor(data: InventoryObject) {
        this.id = data.id;
        this.slots = data.slots;
        this.activeIndex = data.activeIndex;
    }

    public getId() {
        return this.id;
    }

    public getSlots() {
        return this.slots;
    }

    public setActiveIndex(index: number, adapter: WorkerAdapter) {
        // this.activeIndex = index;
        adapter.setActiveItem({ index });
    }

    public getActiveIndex() {
        return this.activeIndex;
    }

    public swapPosition(a: number, b: number, adapter: WorkerAdapter) {
        const temp = this.slots[a];
        this.slots[a] = this.slots[b];
        this.slots[b] = temp;

        adapter.swapInventoryPositions({
            from: {
                index: a,
                id: this.id,
            },
            to: {
                index: b,
                id: this.id,
            },
        });
    }
}