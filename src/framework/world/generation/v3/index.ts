import { BlockMap } from '@/framework/world/chunk/Chunk';
import shapeTerrain from './shape-terrain'
import fillWaterBodies from './fill-water-bodies';
import paintSurface from './paint-surface';

export default function generationV3(blockMap: BlockMap, chunkId: string, seed: string) {
    const [x, z] = chunkId.split(':');
    const xInt = parseInt(x, 10);
    const zInt = parseInt(z, 10);

    try {
        shapeTerrain(seed, xInt, zInt, blockMap);
        fillWaterBodies(blockMap);
        paintSurface(blockMap);
    } catch(e) {
        console.error(e);
        console.debug(chunkId, seed);
    }

    return blockMap;
}