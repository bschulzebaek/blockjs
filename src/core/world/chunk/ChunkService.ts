import { Vector3 } from 'three';
import BlockId from '@/core/world/block/BlockId';
import Chunk from '@/core/world/chunk/Chunk';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import Block from '@/core/world/block/Block';
import updateMeshInstance from '@/core/world/chunk/geometry/update-mesh-instance';

export default class ChunkService {
    static setBlock(chunk: Chunk, position: Vector3, id: BlockId) {
        const positionString = ChunkUtils.getBlockPosition(position, true);
        const block: Block = {
            id,
            changed: true,
        };

        chunk.getBlocks().set(positionString, block);

        updateMeshInstance(chunk);
    }

    // static
}