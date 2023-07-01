import InventoryRepository from '@/core/components/inventory/InventoryRepository';
import Inventory from '@/core/components/inventory/Inventory';
import BlockId from '@/core/world/block/BlockId';
import FeatureFlags, { Features } from '@/shared/FeatureFlags';

export default class InventoryService {
    private readonly repository: InventoryRepository;
    private registry = new Map<string, Inventory>();

    constructor(uuid: string) {
        this.repository = new InventoryRepository(uuid)
    }

    public async loadInventory(id: string) {
        const data = await this.repository.read(id);

        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[InventoryService] Loaded inventory "${id}"`);
            console.debug(data);
        }

        const inventory = data ? new Inventory(id, data?.slots, data?.activeIndex) : (
            id === 'player' ? this.__createDebugInventory(id) : new Inventory(id)
        );

        this.registry.set(id, inventory);

        return inventory;
    }

    public getInventory(id: string) {
        return this.registry.get(id);
    }

    private __createDebugInventory(id: string) {
        const slots = new Array(36).fill(null);

        [
            BlockId.STONE, BlockId.GLASS, BlockId.CHEST, BlockId.BOOKSHELF, BlockId.CRAFTING_TABLE, BlockId.BEDROCK, BlockId.SAND,
            BlockId.GRAVEL, BlockId.GOLD_ORE, BlockId.IRON_ORE, BlockId.COAL_ORE, BlockId.LOG, BlockId.LEAVES, BlockId.SPONGE,
            BlockId.SANDSTONE, BlockId.SAPLING, BlockId.GRASS, BlockId.DIRT, BlockId.COBBLESTONE, BlockId.PLANKS,
        ].forEach((id, index) => {
            slots[index] = { id, quantity: 32 };
        });

        const inventory = new Inventory(id, slots);

        this.repository.write(inventory);

        return inventory;
    }
}