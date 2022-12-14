import UpdateGridEvent from '../../../components/world/events/UpdateGridEvent';
import SetBlockEvent from '../../../components/world/events/SetBlockEvent';
import Chunk from '../../../components/chunk/Chunk';
import { VIEW_DISTANCE } from '../../../data/settings';
import SceneContainer from '../SceneContainer';
import unloadChunks from '../world-helper/unload-chunks';
import PlayerController from '../../../components/player/PlayerController';
import loadChunks from '../world-helper/load-chunks';
import updateChunkModel from '../world-helper/update-chunk-model';
import World from '../../../components/world/World';
import ChunkNotFoundError from '../../../components/world/exceptions/ChunkNotFoundError';

class WorldSubscriber {
    constructor() {
        addEventListener(UpdateGridEvent.NAME, this.onUpdateGrid as unknown as EventListener);
        addEventListener(SetBlockEvent.NAME, this.onSetBlock as unknown as EventListener);
    }

    private onUpdateGrid = async (event: UpdateGridEvent) => {
        const chunkPos = Chunk.blockToChunkPosition(event.getPosition()),
            newMap = World.createChunkMap(VIEW_DISTANCE, chunkPos.x, chunkPos.z),
            oldMap = SceneContainer.getWorld().getMap(),
            chunksToCreate = Array.from(newMap.keys()).filter((key) => !oldMap.has(key)),
            chunksToRemove = Array.from(oldMap.keys()).filter((key) => !newMap.has(key));

        unloadChunks(chunksToRemove);
        loadChunks(chunksToCreate);
    }

    private onSetBlock = async (event: SetBlockEvent) => {
        const { x, y, z } = event.getPosition(),
            id = event.getId(),
            world = SceneContainer.getWorld(),
            chunkId = Chunk.blockToId(x, z),
            chunk = world.getChunkById(chunkId);

        if (!chunk) {
            throw new ChunkNotFoundError(chunkId);
        }
        
        const player = SceneContainer.getScene().getSceneObject('player-controller') as unknown as PlayerController;

        if (player.isBlocking(x, y, z)) {
            return;
        }

        world.setBlockId(x, y, z, id);
        await SceneContainer.getChunkRepository().write(chunk);

        updateChunkModel(chunkId);
    }
}

export default new WorldSubscriber()