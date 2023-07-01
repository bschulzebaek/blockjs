import { Vector3 } from 'three';
import BlockId from '@/world/block/BlockId';

export default class SetBlockEvent extends Event {
    static NAME = 'world/set-block';

    constructor(
        private readonly position: Vector3,
        private readonly id: BlockId
    ) {
        super(SetBlockEvent.NAME);
    }

    public getPosition = (): Vector3 => this.position;

    public getId = (): BlockId => this.id;
}