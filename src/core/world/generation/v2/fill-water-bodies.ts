import { iterateChunk2D } from '../../iterate-coordinates';
import { SEA_LEVEL } from './configuration';
import BlockId from '@/core/world/Block/BlockId';
import { BlockMap } from '@/core/world/Chunk/Chunk';
import Block from '@/core/world/Block/Block';

export default function fillWaterBodies(blocks: BlockMap) {
    iterateChunk2D((x: number, z: number) => {
        let currentY = SEA_LEVEL;
        let blockId = null;

        while (blockId !== BlockId.STONE && currentY) {
            const key = `${x}:${currentY}:${z}`;
            const block = blocks.get(key);

            if (!block) {
                blocks.set(key, new Block(x, currentY, z, BlockId.WATER));
            }

            currentY--;
        }
    });
}