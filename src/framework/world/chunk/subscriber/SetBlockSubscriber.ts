import { CHUNK_SIZE } from '@/configuration';
import BlockFactory from '@/framework/world/block/BlockFactory';
import SetBlockEvent from '@/framework/world/block/events/SetBlockEvent';
import Chunk from '@/framework/world/chunk/Chunk';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import updateMeshInstance from '@/framework/world/chunk/geometry/update-mesh-instance';
import World from '@/framework/world/World';
import { Vector3 } from 'three';
import ChunkRepository from '@/framework/world/chunk/ChunkRepository';
import GlobalState from '@/engine/worker/states/GlobalState';
import BlockId from '@/framework/world/block/BlockId';

class SetBlockSubscriber {
    private chunkRepository = new ChunkRepository(GlobalState.getConfig().getUUID());

    constructor() {
        addEventListener(SetBlockEvent.NAME, this.onSetBlock as unknown as EventListener);
    }

    private onSetBlock = async (event: SetBlockEvent) => {
        const position = event.getPosition();
        const id = event.getId();

        const world = GlobalState.getWorld();
        const chunk = world.getChunkByPosition(position, true);

        if (!chunk) {
            return;
        }

        // TODO: Check if position is blocked by Entities

        const currentBlock = chunk.getBlockByVector(position);

        if (id !== BlockId.AIR && currentBlock && currentBlock.id !== BlockId.AIR) {
            return console.debug(`Position "${position.x}:${position.y}:${position.z}" blocked by block "${currentBlock.id}"`);
        }

        const block = BlockFactory.create({
            id,
            changed: true,
        });

        chunk.setBlock(position, block);

        this.chunkRepository.write(chunk);
        updateMeshInstance(chunk);
        this.updateNeighborMeshes(chunk, ChunkUtils.vectorToLocalVector(position), world);
    };

    private updateNeighborMeshes(chunk: Chunk, position: Vector3, world: World) {
        let chunkX = chunk.getX();
        let chunkZ = chunk.getZ();

        if (position.x === 0) {
            chunkX--;
        } else if (position.x === CHUNK_SIZE - 1) {
            chunkX++;
        }

        if (position.z === 0) {
            chunkZ--;
        } else if (position.z === CHUNK_SIZE - 1) {
            chunkZ++;
        }

        if (chunkX !== chunk.getX()) {
            const _chunkX = world.getChunkByChunkCoordinates(chunkX, chunk.getZ());

            if (_chunkX) {
                updateMeshInstance(_chunkX);
            }
        }

        if (chunkZ !== chunk.getZ()) {
            const _chunkZ = world.getChunkByChunkCoordinates(chunk.getX(), chunkZ);

            if (_chunkZ) {
                updateMeshInstance(_chunkZ);
            }
        }
    }
}

export default new SetBlockSubscriber();