import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import SetBlockEvent from '@/world/block/events/SetBlockEvent';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import { Vector3 } from 'three';
import ChunkRepository from '@/world/chunk/ChunkRepository';
import GlobalState from '@/engine/worker/states/GlobalState';
import BlockId from '@/world/block/BlockId';

class SetBlockSubscriber {
    private chunkRepository = new ChunkRepository(GlobalState.getConfig().getUUID());

    constructor() {
        addEventListener(SetBlockEvent.NAME, this.onSetBlock as unknown as EventListener);
    }

    private onSetBlock = (event: SetBlockEvent) => {
        const position = event.getPosition();
        const id = event.getId();
        const world = GlobalState.getWorld();
        const chunkId = ChunkUtils.positionToId(position);
        const chunk = world.getChunkById(chunkId, true);

        if (!chunk) {
            return;
        }

        // TODO: Check if position is blocked by player

        const blockPosition = new Vector3(position.x - chunk.getOffsetX(), position.y, position.z - chunk.getOffsetZ());
        const currentBlock = chunk.getBlock(blockPosition.x, blockPosition.y, blockPosition.z);

        if (id !== BlockId.AIR && currentBlock && currentBlock.id !== BlockId.AIR) {
            return console.debug(`Position "${blockPosition.x}:${blockPosition.y}:${blockPosition.z}" blocked by block "${currentBlock.id}"`);
        }

        ServiceRegistry.getChunkService().setBlock(chunk, blockPosition, id, world);

        this.chunkRepository.write(chunk);
    };
}

export default new SetBlockSubscriber();