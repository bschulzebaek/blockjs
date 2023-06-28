import { TRANSPARENT_BLOCKS } from '@/core/world/block/block-data';
import Chunk from '@/core/world/chunk/Chunk';
import WorldAccessor from '@/core/world/generation/WorldAccessor';
import World from '@/core/world/World';

export default function getFaceVisibility(accessor: WorldAccessor | World | Chunk, x: number, y: number, z: number, isTransparent: boolean) {
    const _block = accessor.getBlock(x, y, z);

    if (!_block) {
        return true;
    }

    if (!isTransparent && TRANSPARENT_BLOCKS.includes(_block.id)) {
        return true;
    }

    return false;
}