import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { SEA_LEVEL,  } from './parameters';
import BlockId from '@/framework/world/block/BlockId';
import { BlockMap } from '@/framework/world/chunk/Chunk';
import Block from '@/framework/world/block/Block';
import { iterateChunk2D } from '@/framework/world/iterate-coordinates';
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
        let block: Block | undefined;

        do {
            block = blocks.get(ChunkUtils.localCoordinatesToBlockId(x, currentY, z))!;

            currentY--;
        } while (!block && currentY >= SEA_LEVEL)

        if (!block || block.id === BlockId.WATER || block.changed) {
            return;
        }

        block.id = getBlockId(block);
    });
}