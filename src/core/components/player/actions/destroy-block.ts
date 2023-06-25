import { Vector3 } from 'three';
import Block from '@/core/world/Block/Block';
import SetBlockEvent from '@/core/components/player/events/SetBlockEvent';
import BlockId from '@/core/world/Block/BlockId';

export default function destroyBlock(position: Vector3, block: Block) {
    // const blockId = block.id;

    // if (BlockMeta[blockId].durability === -1) {
    //     return;
    // }

    dispatchEvent(new SetBlockEvent(position, BlockId.AIR));
}