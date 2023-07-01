import { SEA_LEVEL,  } from './parameters';
import BlockId from '@/world/block/BlockId';
import { BlockMap } from '@/world/chunk/Chunk';
import Block from '@/world/block/Block';
import { iterateChunk2D } from '@/world/iterate-coordinates';
import { WORLD_HEIGHT } from '@/configuration';

// e.g.
// +humidity && +temperature = Jungle
// +humidity && -temperature = Swamp
// -humidity && +temperature = Desert
// -humidity && -temperature = Snowy plains

function getBlockId(block: Block) {
    if (!block.biomeData) {
        return BlockId.GRASS;
    }

    const { continentalness, humidity, temperature } = block.biomeData;

    if (continentalness > 0.76) {
        return humidity < -0.5 ? BlockId.SANDSTONE : BlockId.STONE;
    }

    if (humidity < -0.5 && temperature > 0.5) {
        return BlockId.SAND;
    }

    return BlockId.GRASS;
}

export default function paintSurface(blocks: BlockMap) {
    iterateChunk2D((x: number, z: number) => {
        let currentY = WORLD_HEIGHT - 1;
        let block = blocks.get(`${x}:${currentY}:${z}`)!;

        do {
            block = blocks.get(`${x}:${currentY}:${z}`)!;

            currentY--;
        } while (!block && currentY >= SEA_LEVEL)

        if (block.id === BlockId.WATER || block.changed) {
            return;
        }

        block.id = getBlockId(block);

        // ToDo: Randomly change adjacent blocks to proper biome ground block
    });
}