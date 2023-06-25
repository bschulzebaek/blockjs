import UpdateGridEvent from '@/core/components/player/events/UpdateGridEvent';
import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from '@/core/world/generation/WorldGenerator';
import WorkerContext from '@/core/engine/WorkerContext';
import SetBlockEvent from '@/core/components/player/events/SetBlockEvent';
import ChunkRepository from '@/core/world/Chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';

class WorldUpdateSubscriber {
    private chunkRepository = new ChunkRepository(new StorageAdapter(WorkerContext.config.getUUID()));

    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
        addEventListener(SetBlockEvent.NAME, this.onSetBlock as unknown as EventListener);


    }

    private onUpdateGrid = (event: UpdateGridEvent) => {
        const world = WorkerContext.engine!.getWorld();
        const position = event.getPosition();
        const newMap = WorldGenerator.createMap(position.x, position.z);
        const oldMap = world.getChunks();

        const chunksToCreate = Array.from(newMap.keys()).filter((key) => !oldMap.has(key));
        const chunksToRemove = Array.from(oldMap.keys()).filter((key) => !newMap.has(key));

        const pendingMap = new Map();

        chunksToCreate.forEach((id) => { pendingMap.set(id, undefined) });

        world.unloadChunks(chunksToRemove);
        world.setPendingChunks(pendingMap);

        world.loadPendingChunks();
    }

    private onSetBlock = (event: SetBlockEvent) => {
        const position = event.getPosition();
        const id = event.getId();
        const world = WorkerContext.engine!.getWorld();
        const chunkId = Chunk.positionToId(position);
        const chunk = world.getChunkById(chunkId, true);

        if (!chunk) {
            return;
        }

        // TODO: Check if position is blocked by player

        const blockX = position.x - chunk.getOffsetX(),
            blockZ = position.z - chunk.getOffsetZ();

        chunk.setBlock(blockX, position.y, blockZ, id);

        this.chunkRepository.write(chunk);
    }
}

export default new WorldUpdateSubscriber();