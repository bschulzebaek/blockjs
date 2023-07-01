import type EntityService from '@/framework/entities/EntityService';
import type WorldService from '@/world/WorldService';
import type ChunkService from '@/world/chunk/ChunkService';
import type InventoryService from '@/components/inventory/InventoryService';
import type SceneService from '@/engine/scene/SceneService';

class ServiceRegistry {
    private world!: WorldService;
    private chunk!: ChunkService;
    private inventory!: InventoryService;
    private scene!: SceneService;
    private entity!: EntityService;

    constructor() {
        // @ts-ignore
        globalThis.__services = this;
    }

    public setWorldService = (world: WorldService) => this.world = world;

    public getWorldService = () => this.world;

    public setChunkService = (chunk: ChunkService) => this.chunk = chunk;

    public getChunkService = () => this.chunk;

    public setInventoryService = (inventory: InventoryService) => this.inventory = inventory;

    public getInventoryService = () => this.inventory;

    public setSceneService = (scene: SceneService) => this.scene = scene;

    public getSceneService = () => this.scene;

    public setEntityService = (entity: EntityService) => this.entity = entity;

    public getEntityService = () => this.entity;
}

export default new ServiceRegistry();