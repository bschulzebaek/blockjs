import InventorySwapPayload from '@/core/components/inventory/InventorySwapPayload';

export default class InventorySwapEvent extends Event {
    static NAME = 'inventory/swap';

    constructor(private readonly swap: InventorySwapPayload) {
        super(InventorySwapEvent.NAME);
    }

    public getSwap = (): InventorySwapPayload => this.swap;
}