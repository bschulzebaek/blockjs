import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import CustomScene from '@/engine/scene/CustomScene';
import BlockId from '@/framework/world/block/BlockId';
import World from '@/framework/world/World';
import { Vector3 } from 'three';

export default function getStartLocation(scene: CustomScene) {
    const world = scene.getWorld() as World;
    const spawn = new Vector3(CHUNK_SIZE / 2, WORLD_HEIGHT, CHUNK_SIZE / 2);

    let block = world.getBlockByVector(spawn);

    while (!block || block.id === BlockId.AIR) {
        spawn.y--;
        block = world.getBlockByVector(spawn);
    }

    spawn.y += 2;

    return spawn;
}