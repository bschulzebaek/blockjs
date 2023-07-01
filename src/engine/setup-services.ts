import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';

export default async function setupServices() {
    const worldService = (await import('@/world/WorldService')).default;
    const chunkService = (await import('@/world/chunk/ChunkService')).default;
    const sceneService = (await import('@/engine/scene/SceneService')).default;
    const inventoryService = (await import('@/components/inventory/InventoryService')).default;
    const entityService = (await import('@/framework/entities/EntityService')).default;

    ServiceRegistry.setWorldService(new worldService());
    ServiceRegistry.setChunkService(new chunkService());
    ServiceRegistry.setSceneService(new sceneService());
    ServiceRegistry.setInventoryService(new inventoryService());
    ServiceRegistry.setEntityService(new entityService());

    await ServiceRegistry.getWorldService().setup();
    await ServiceRegistry.getSceneService().setup();
    await ServiceRegistry.getEntityService().setup();
    await ServiceRegistry.getInventoryService().setup();
}