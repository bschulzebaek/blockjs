import { SEA_LEVEL,  } from './configuration';
import BlockId from '@/core/world/Block/BlockId';
import World from '@/core/world/World';
import { BlockMap } from '@/core/world/Chunk/Chunk';
import Block from '@/core/world/Block/Block';
import { iterateChunk2D } from '@/core/world/iterate-coordinates';

// e.g.
// +humidity && +temperature = Jungle
// +humidity && -temperature = Swamp
// -humidity && +temperature = Desert
// -humidity && -temperature = Snowy plains

function getBlockId(block: Block) {
    const { continentalness, humidity, temperature } = block.getBiomeData();

    if (continentalness! > 0.76) {
        return humidity! < -0.5 ? BlockId.SANDSTONE : BlockId.STONE;
    }

    if (humidity! < -0.5 && temperature! > 0.5) {
        return BlockId.SAND;
    }

    return BlockId.GRASS;
}

export default function paintSurface(blocks: BlockMap) {
    iterateChunk2D((x: number, z: number) => {
        let currentY = World.CHUNK_HEIGHT - 1;
        let block = blocks.get(`${x}:${currentY}:${z}`)!;

        do {
            block = blocks.get(`${x}:${currentY}:${z}`)!;

            currentY--;
        } while (!block && currentY >= SEA_LEVEL)

        if (block.getId() === BlockId.WATER) {
            return;
        }

        block.setId(getBlockId(block));

        // ToDo: Randomly change adjacent blocks to proper biome ground block
    });
}