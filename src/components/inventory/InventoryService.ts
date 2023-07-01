import ActiveItemPayload from '@/components/inventory/ActiveItemPayload';
import InventoryRepository from '@/components/inventory/InventoryRepository';
import Inventory from '@/components/inventory/Inventory';
import postInventoryTransfer from '@/components/inventory/messages/post-inventory-transfer';
import Player from '@/components/player/Player';
import GlobalState from '@/engine/worker/states/GlobalState';
import BlockId from '@/world/block/BlockId';
import FeatureFlags, { Features } from '@/framework/feature-flags/FeatureFlags';

export default class InventoryService {
    private readonly repository: InventoryRepository;
    private registry = new Map<string, Inventory>();

    constructor() {
        this.repository = new InventoryRepository(GlobalState.getConfig().getUUID())
    }

    public async loadInventory(id: string) {
        const data = await this.repository.read(id);

        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[InventoryService] Loaded inventory "${id}"`);
            console.debug(data);
        }

        const inventory = new Inventory(id, data?.slots, data?.activeIndex);

        this.registry.set(id, inventory);

        return inventory;
    }

    public getInventory(id: string) {
        return this.registry.get(id);
    }

    private async __createDebugInventory(id: string) {
        const slots = new Array(36).fill(null);

        [
            BlockId.STONE, BlockId.GLASS, BlockId.CHEST, BlockId.BOOKSHELF, BlockId.CRAFTING_TABLE, BlockId.BEDROCK, BlockId.SAND,
            BlockId.GRAVEL, BlockId.GOLD_ORE, BlockId.IRON_ORE, BlockId.COAL_ORE, BlockId.LOG, BlockId.LEAVES, BlockId.SPONGE,
            BlockId.SANDSTONE, BlockId.SAPLING, BlockId.GRASS, BlockId.DIRT, BlockId.COBBLESTONE, BlockId.PLANKS,
        ].forEach((id, index) => {
            slots[index] = { id, quantity: 32 };
        });

        const inventory = new Inventory(id, slots);

        await this.repository.write(inventory);

        return inventory;
    }

    /**
     * TODO: Depends on EntityService being setup first
     */
    public async setup() {
        const scene = GlobalState.getScene();

        const id = 'player';
        const data = await this.repository.read(id);

        const inventory = data ? new Inventory(id, data?.slots, data?.activeIndex) : (
            id === 'player' ? await this.__createDebugInventory(id) : new Inventory(id)
        );

        this.registry.set(id, inventory);
        const player = scene.getObjectByName(id) as Player;

        player.setInventory(inventory);
        postInventoryTransfer(inventory);
    }

    public setActiveInventoryItem(payload: ActiveItemPayload) {
        const inventory = this.getInventory('player');

        if (!inventory) {
            throw new Error('Player inventory not found');
        }

        inventory.setActiveIndex(payload.index);
    }
}