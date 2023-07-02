import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import UpdateGridEvent from '@/framework/world/events/UpdateGridEvent';
import WorldGenerator from '@/framework/world/generation/WorldGenerator';

class UpdateGridSubscriber {
    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
    }

    private onUpdateGrid = (event: UpdateGridEvent) => {
        const world = GlobalState.getWorld();
        const newMap = WorldGenerator.createMap(
            ChunkUtils.vectorToChunkVector(event.getPosition())
        );
        const oldMap = world.getChunks();

        const chunksToCreate = Array.from(newMap.keys()).filter((key) => !oldMap.has(key));
        const chunksToRemove = Array.from(oldMap.keys()).filter((key) => !newMap.has(key));

        const pendingMap = new Map();

        chunksToCreate.forEach((id) => {
            pendingMap.set(id, undefined);
        });

        world.setPendingChunks(pendingMap);

        const service = ServiceRegistry.getWorldService();

        service.unloadChunks(chunksToRemove);
        service.loadPendingChunks();
    };
}

export default new UpdateGridSubscriber();