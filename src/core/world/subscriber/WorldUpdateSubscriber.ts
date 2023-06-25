import UpdateGridEvent from '@/core/components/player/events/UpdateGridEvent';
import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from '@/core/world/generation/WorldGenerator';
import WorkerContext from '@/core/engine/WorkerContext';

class WorldUpdateSubscriber {
    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
    }

    private onUpdateGrid = (event: UpdateGridEvent) => {
        const world = WorkerContext.engine!.getWorld();
        const position = event.getPosition();
        console.log(position)
        const newMap = WorldGenerator.createMap(position.x, position.z);
        const oldMap = world.getChunks();

        const chunksToCreate = Array.from(newMap.keys()).filter((key) => !oldMap.has(key));
        const chunksToRemove = Array.from(oldMap.keys()).filter((key) => !newMap.has(key));

        const pendingMap = new Map();

        chunksToCreate.forEach((id) => { pendingMap.set(id, undefined) });

        world.unloadChunks(chunksToRemove);
        world.setPendingChunks(pendingMap);

        console.log('Remove', chunksToRemove);
        console.log('Create', chunksToCreate);

        world.loadPendingChunks();
    }
}

export default new WorldUpdateSubscriber();