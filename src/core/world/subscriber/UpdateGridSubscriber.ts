import UpdateGridEvent from '@/core/world/events/UpdateGridEvent';
import WorldGenerator from '@/core/world/generation/WorldGenerator';
import WorldService from '@/core/world/WorldService';

class UpdateGridSubscriber {
    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
    }

    private onUpdateGrid = (event: UpdateGridEvent) => {
        const world = WorldService.getWorld();
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

        WorldService.unloadChunks(chunksToRemove);
        WorldService.loadPendingChunks();
    };
}

export default new UpdateGridSubscriber();