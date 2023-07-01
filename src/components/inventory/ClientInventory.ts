import InventorySlot from '@/components/inventory/InventorySlot';
import { InventoryObject } from '@/components/inventory/InventoryRepository';
import WorkerAdapter from '@/interface/WorkerAdapter';

export default class ClientInventory {
    private readonly id: string;
    private readonly slots: Array<InventorySlot | null>;
    private activeIndex: number;

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
        this.activeIndex = index;
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