import { Vector3 } from 'three';
import { ChunkDirections, ChunkFaces } from '@/framework/world/chunk/data/chunk-faces';
import BlockId from '@/framework/world/block/BlockId';
import SetBlockEvent from '@/framework/world/block/events/SetBlockEvent';

export default function placeBlock(position: Vector3, direction: ChunkDirections, id: BlockId) {
    const target = position.clone();

    const n = ChunkFaces[direction].n;

    target.x = position.x + n[0];
    target.y = position.y + n[1];
    target.z = position.z + n[2];

    dispatchEvent(new SetBlockEvent(target, id));
}