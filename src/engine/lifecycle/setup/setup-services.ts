import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';

export default async function stepSetupServices() {
    ServiceRegistry.setWorldService(new (await import('@/framework/world/WorldService')).default());
    ServiceRegistry.setSceneService(new (await import('@/engine/scene/SceneService')).default());
    ServiceRegistry.setInventoryService(new (await import('@/components/inventory/InventoryService')).default());
    ServiceRegistry.setEntityService(new (await import('@/framework/entities/EntityService')).default());

    await ServiceRegistry.getWorldService().setup();
    await ServiceRegistry.getSceneService().setup();
    await ServiceRegistry.getEntityService().setup();
}