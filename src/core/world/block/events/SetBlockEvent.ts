import { Vector3 } from 'three';
import BlockId from '@/core/world/block/BlockId';

export default class SetBlockEvent extends Event {
    static NAME = 'world/set-block';

    constructor(
        private readonly position: Vector3,
        private readonly id: BlockId
    ) {
        super(SetBlockEvent.NAME);
    }

    public getPosition = () => {
        return this.position;
    }

    public getId = () => {
        return this.id;
    }
}