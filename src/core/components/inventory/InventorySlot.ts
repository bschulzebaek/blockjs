import BlockId from '@/core/world/block/BlockId';

export default interface InventorySlot {
    id: BlockId;
    quantity: number;
    durability?: number;
}