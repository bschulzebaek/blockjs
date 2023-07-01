import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import UpdateGridEvent from '@/world/events/UpdateGridEvent';
import WorldGenerator from '@/world/generation/WorldGenerator';

class UpdateGridSubscriber {
    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
    }

    private onUpdateGrid = (event: UpdateGridEvent) => {
        const world = GlobalState.getWorld();
        const position = event.getPosition();
        const newMap = WorldGenerator.createMap(position.x, position.z);
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