import BlockFactory from '@/framework/world/block/BlockFactory';
import BlockId from '@/framework/world/block/BlockId';
import { BlockMap } from '@/framework/world/chunk/Chunk';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { iterateChunk2D } from '@/framework/world/iterate-coordinates';
import { WORLD_HEIGHT } from '@/configuration';
import { SEA_LEVEL } from '@/framework/world/generation/v2/parameters';
import Block from '@/framework/world/block/Block';

export default function paintSurface(blocks: BlockMap) {
    iterateChunk2D((x: number, z: number) => {
        let currentY = WORLD_HEIGHT - 1;
        let block: Block | undefined;
        let position = '';

        try {
            do {
                position = ChunkUtils.localCoordinatesToBlockId(x, currentY, z);
                block = blocks.get(position);

                currentY--;
            } while (!block && currentY >= SEA_LEVEL);

            if (!block || block.id === BlockId.WATER || block.changed) {
                return;
            }

            blocks.set(position, BlockFactory.update(block, { id: BlockId.GRASS }));
        } catch(e) {
            console.debug(x, currentY, z);
            console.debug(block);
            console.error(e);
        }
    });
}