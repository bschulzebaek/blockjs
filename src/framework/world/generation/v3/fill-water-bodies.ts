import BlockFactory from '@/framework/world/block/BlockFactory';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { iterateChunk2D } from '../../iterate-coordinates';
import { SEA_LEVEL } from './parameters';
import BlockId from '@/framework/world/block/BlockId';
import { BlockMap } from '@/framework/world/chunk/Chunk';

const biomeData = {
    humidity: 0.5,
    temperature: 0.5,
    continentalness: 0.5
};

export default function fillWaterBodies(blocks: BlockMap) {
    iterateChunk2D((x: number, z: number) => {
        let currentY = SEA_LEVEL;
        let blockId = null;

        while (blockId !== BlockId.STONE && currentY) {
            const position = ChunkUtils.worldCoordinatesToBlockId(x, currentY, z);
            const block = blocks.get(position);

            if (!block) {
                blocks.set(position, BlockFactory.create({ id: BlockId.WATER, biomeData }));
            }

            currentY--;
        }
    });
}