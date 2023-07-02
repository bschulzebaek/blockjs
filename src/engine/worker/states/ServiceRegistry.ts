import type EntityService from '@/framework/entities/EntityService';
import type WorldService from '@/framework/world/WorldService';
import type InventoryService from '@/components/inventory/InventoryService';
import type SceneService from '@/engine/scene/SceneService';

class ServiceRegistry {
    private world!: WorldService;
    private inventory!: InventoryService;
    private scene!: SceneService;
    private entity!: EntityService;

    constructor() {
        // @ts-ignore
        globalThis.__services = this;
    }

    public setWorldService = (world: WorldService) => this.world = world;

    public getWorldService = () => this.world;

    public setInventoryService = (inventory: InventoryService) => this.inventory = inventory;

    public getInventoryService = () => this.inventory;

    public setSceneService = (scene: SceneService) => this.scene = scene;

    public getSceneService = () => this.scene;

    public setEntityService = (entity: EntityService) => this.entity = entity;

    public getEntityService = () => this.entity;
}

export default new ServiceRegistry();