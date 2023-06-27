import { TRANSPARENT_BLOCKS } from '@/core/world/block/block-data';
import Chunk from '@/core/world/chunk/Chunk';
import World from '@/core/world/World';

export default function getFaceVisibility(chunk: Chunk, x: number, y: number, z: number, isTransparent: boolean) {
    // TODO: Use "World.getBlock instead to also check neighbor chunks
    const _block = chunk.getBlock(x, y, z);

    if (!_block || TRANSPARENT_BLOCKS.includes(_block.id)) {
        return true;
    }

    return !isTransparent;
}