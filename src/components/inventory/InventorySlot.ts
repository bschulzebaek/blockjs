import BlockId from '@/framework/world/block/BlockId';

export default interface InventorySlot {
    id: BlockId;
    quantity: number;
    durability?: number;
}