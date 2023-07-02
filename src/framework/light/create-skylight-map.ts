import { WORLD_HEIGHT } from '@/configuration';
import Block from '@/framework/world/block/Block';
import Chunk from '@/framework/world/chunk/Chunk';
import { iterateChunk2D } from '@/framework/world/iterate-coordinates';

export default function createSkylightMap(chunk: Chunk) {
    // let block: Block | undefined = undefined;
    //
    // iterateChunk2D((x, z) => {
    //     let currentY = WORLD_HEIGHT - 1;
    //
    //     do {
    //         block = chunk.getBlockByLocalCoordinates(x, currentY, z)!;
    //
    //         if (block.transparent) {
    //             block.lightLevel = 15;
    //         }
    //
    //         currentY--;
    //
    //
    //     } while (currentY > 0 && block.transparent);
    // });
}