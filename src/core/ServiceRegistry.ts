import WorldService from '@/core/world/WorldService';
import ChunkService from '@/core/world/chunk/ChunkService';
import InventoryService from '@/core/components/inventory/InventoryService';
import SceneService from '@/core/engine/scene/SceneService';

class ServiceRegistry {
    private world!: typeof WorldService;
    private chunk!: ChunkService;
    private inventory!: InventoryService;
    private scene!: typeof SceneService;

    constructor() {
        // @ts-ignore
        globalThis.__services = this;
    }

    public setWorldService(world: typeof WorldService) {
        this.world = world;
    }

    public getWorldService() {
        return this.world;
    }

    public setChunkService(chunk: ChunkService) {
        this.chunk = chunk;
    }

    public getChunkService() {
        return this.chunk;
    }

    public setInventoryService(inventory: InventoryService) {
        this.inventory = inventory;
    }

    public getInventoryService() {
        return this.inventory;
    }

    public setSceneService(scene: typeof SceneService) {
        this.scene = scene;
    }

    public getSceneService() {
        return this.scene;
    }
}

export default new ServiceRegistry();