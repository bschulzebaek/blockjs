import ServiceRegistry from '@/core/ServiceRegistry';
import WorldService from '@/core/world/WorldService';
import ChunkService from '@/core/world/chunk/ChunkService';
import InventoryService from '@/core/components/inventory/InventoryService';
import SceneService from '@/core/engine/scene/SceneService';

export default function loadServices(uuid: string) {
    ServiceRegistry.setWorldService(WorldService);
    ServiceRegistry.setChunkService(ChunkService);
    ServiceRegistry.setSceneService(SceneService);
    ServiceRegistry.setInventoryService(new InventoryService(uuid));

    // GlobalState.setEntityServices(new EntityServices(uuid));
}