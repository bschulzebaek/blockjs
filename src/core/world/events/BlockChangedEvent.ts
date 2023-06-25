import BlockId from '@/core/world/Block/BlockId';
import { Vector3 } from 'three';
import FeatureFlags, { Features } from '@/feature-flags';

export default class BlockChangedEvent extends Event {
    static NAME = 'world/block-updated';

    private readonly position: Vector3;

    constructor(
        x: number,
        y: number,
        z: number,
        private readonly oldId: BlockId,
        private readonly newId: BlockId
    ) {
        super(BlockChangedEvent.NAME);

        this.position = new Vector3(x, y, z);

        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(this);
        }
    }

    public getPosition = () => {
        return this.position;
    }

    public getOldId = () => {
        return this.oldId;
    }

    public getNewId = () => {
        return this.newId;
    }
}