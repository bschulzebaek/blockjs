export default interface InventorySwapPayload {
    from: {
        id: string;
        index: number;
    };
    to: {
        id: string;
        index: number;
    };
}