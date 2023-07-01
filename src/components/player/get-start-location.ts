import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import CustomScene from '@/engine/scene/CustomScene';
import BlockId from '@/world/block/BlockId';
import World from '@/world/World';
import { Vector3 } from 'three';

export default function getStartLocation(scene: CustomScene) {
    const world = scene.getWorld() as World;
    const spawn = new Vector3(CHUNK_SIZE / 2, WORLD_HEIGHT, CHUNK_SIZE / 2);

    let block = world.getBlock(spawn.x, spawn.y, spawn.z);

    while (!block || block.id === BlockId.AIR) {
        spawn.y--;
        block = world.getBlock(spawn.x, spawn.y, spawn.z);
    }

    spawn.y += 2;

    return spawn;
}