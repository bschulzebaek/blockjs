import World from '@/core/world/World';
import { Camera, Vector3 } from 'three';
import Block from '@/core/world/Block/Block';
import BlockRaycaster from '@/core/world/Block/BlockRaycaster';

const raycaster = new BlockRaycaster();
const origin = new Vector3();
const direction = new Vector3();

export default function getBlockFromRay(world: World, camera: Camera): { position: Vector3, block: Block } | undefined {
    let position = undefined,
        block = undefined

    raycaster.set(camera.getWorldPosition(origin), camera.getWorldDirection(direction));
    const intersects = raycaster.intersectObjects(Array.from(world.getChunks().values()));

    const first = intersects[0];

    // console.log(intersects)

    if (first) {
        const x = Math.floor(first.point.x),
            y = Math.round(first.point.y),
            z = Math.floor(first.point.z);

        position = new Vector3(x, y, z);
        block = world.getBlock(x, y, z);

        if (!block) {
            return undefined
        }

        return {
            position,
            block,
        }
    }

    return undefined
}