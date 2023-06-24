import { Intersection, Raycaster } from 'three';
import World from '@/core/world/World';

function ascSort(a: Intersection, b: Intersection) {
    return a.distance - b.distance;
}

export default class BlockRaycaster extends Raycaster {
    constructor() {
        super(undefined, undefined, 0, 10);
    }

    public intersectWorld(world: World, recursive = true, intersects = []) {
        // world.raycast(this, intersects);

        intersects.sort(ascSort);

        return intersects;
    }
}