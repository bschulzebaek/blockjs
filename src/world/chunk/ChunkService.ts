import { Vector3 } from 'three';
import BlockId from '@/world/block/BlockId';
import Chunk from '@/world/chunk/Chunk';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import Block from '@/world/block/Block';
import updateMeshInstance from '@/world/chunk/geometry/update-mesh-instance';
import { CHUNK_SIZE } from '@/configuration';
import World from '@/world/World';

export default class ChunkService {
    public setBlock(chunk: Chunk, position: Vector3, id: BlockId, world: World) {
        const positionString = ChunkUtils.getBlockPosition(position)!;

        const block: Block = {
            id,
            changed: true,
        };

        chunk.getBlocks().set(positionString, block);

        updateMeshInstance(chunk);

        this.updateNeighborMeshes(chunk, position, world);
    }

    public updateNeighborMeshes(chunk: Chunk, position: Vector3, world: World) {
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
            const _chunkX = world.getChunkById(`${chunkX}:${chunk.getZ()}`);

            if (_chunkX) {
                updateMeshInstance(_chunkX);
            }
        }

        if (chunkZ !== chunk.getZ()) {
            const _chunkZ = world.getChunkById(`${chunk.getX()}:${chunkZ}`);

            if (_chunkZ) {
                updateMeshInstance(_chunkZ);
            }
        }
    }
}