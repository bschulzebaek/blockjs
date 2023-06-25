import { Vector3 } from 'three';
import { ChunkDirections, ChunkFaces } from '@/data/chunk-faces';
import BlockId from '@/core/world/Block/BlockId';
import SetBlockEvent from '@/core/components/player/events/SetBlockEvent';

export default function placeBlock(position: Vector3, direction: ChunkDirections, id: BlockId) {
    const target = position.clone();

    const n = ChunkFaces[direction].n;

    target.x = position.x + n[0];
    target.y = position.y + n[1];
    target.z = position.z + n[2];

    dispatchEvent(new SetBlockEvent(target, id));
}