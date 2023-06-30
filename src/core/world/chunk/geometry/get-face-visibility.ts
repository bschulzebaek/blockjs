import { TRANSPARENT_BLOCKS } from '@/core/world/block/block-data';
import WorldAccessor from '@/core/world/WorldAccessor';

export default function getFaceVisibility(accessor: WorldAccessor, x: number, y: number, z: number, isTransparent: boolean) {
    const _block = accessor(x, y, z);

    if (!_block) {
        return true;
    }

    if (!isTransparent && TRANSPARENT_BLOCKS.includes(_block.id)) {
        return true;
    }

    return false;
}