import BlockId from '@/core/world/block/BlockId';
import { BlockMap } from '@/core/world/chunk/Chunk';
import { iterateChunk2D } from '@/core/world/iterate-coordinates';
import { WORLD_HEIGHT } from '@/configuration';
import { SEA_LEVEL } from '@/core/world/generation/v2/parameters';
import Block from '@/core/world/block/Block';

export default function paintSurface(blocks: BlockMap) {

    iterateChunk2D((x: number, z: number) => {
        let currentY = WORLD_HEIGHT - 1;
        let block: Block | undefined;

        try {
            block = blocks.get(`${x}:${currentY}:${z}`)!;

            do {
                block = blocks.get(`${x}:${currentY}:${z}`)!;

                currentY--;
            } while (!block && currentY >= SEA_LEVEL)

            if (!block || block.id === BlockId.WATER || block.changed) {
                return;
            }

            block.id = BlockId.GRASS;
        } catch(e) {
            console.debug(x, currentY, z);
            console.debug(block);
            console.error(e);
        }
    });
}