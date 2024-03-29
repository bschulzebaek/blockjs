import { Vector3 } from 'three';
import Block from '@/framework/world/block/Block';
import SetBlockEvent from '@/framework/world/block/events/SetBlockEvent';
import BlockId from '@/framework/world/block/BlockId';

export default function destroyBlock(position: Vector3, block: Block) {
    // const blockId = block.id;

    // if (BlockMeta[blockId].durability === -1) {
    //     return;
    // }

    dispatchEvent(new SetBlockEvent(position, BlockId.AIR));
}