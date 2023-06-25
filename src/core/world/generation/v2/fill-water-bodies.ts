import { iterateChunk2D } from '../../iterate-coordinates';
import { SEA_LEVEL } from './parameters';
import BlockId from '@/core/world/Block/BlockId';
import { BlockMap } from '@/core/world/Chunk/Chunk';

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
            const key = `${x}:${currentY}:${z}`;
            const block = blocks.get(key);

            if (!block) {
                blocks.set(key, {
                    x,
                    y: currentY,
                    z,
                    id: BlockId.WATER,
                    biomeData,
                });
            }

            currentY--;
        }
    });
}