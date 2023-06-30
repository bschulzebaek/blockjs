import InventorySlot from '@/core/components/inventory/InventorySlot';
import StorageObject, { RawStorageObject } from '@/core/engine/storage/StorageObject';

export default class Inventory implements StorageObject {
    static DEFAULT_SIZE = 36;

    constructor(
        private readonly id: string,
        private slots: Array<InventorySlot | null> = new Array(Inventory.DEFAULT_SIZE).fill(null),
        private activeIndex = 0,
    ) {
        // @ts-ignore
        globalThis.__inventory = this;
    }

    public getId() {
        return this.id;
    }

    public getSlot(index: number) {
        return this.slots[index];
    }

    public getActiveSlot() {
        return this.slots[this.activeIndex];
    }

    public setSlot(index: number, slot: InventorySlot | null) {
        this.slots[index] = slot;
    }

    public setSlots(slots: Array<InventorySlot | null>) {
        this.slots = slots;
    }

    public getActiveIndex() {
        return this.activeIndex;
    }

    public setActiveIndex(index: number) {
        if (index > this.slots.length) {
            throw new Error('[Inventory] Index exceeds inventory slots!');
        }

        this.activeIndex = index;
    }

    public toStorage(): RawStorageObject {
        return {
            id: this.id,
            slots: this.slots,
            activeIndex: this.activeIndex,
        }
    }
}