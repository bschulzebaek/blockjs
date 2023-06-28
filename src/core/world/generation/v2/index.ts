import { BlockMap } from '@/core/world/chunk/Chunk';
import paintSurface from '@/core/world/generation/v2/paint-surface';
import shapeTerrain from '@/core/world/generation/v2/shape-terrain';

export default async function generationV2(blockMap: BlockMap, chunkId: string, seed: string) {
    const [x, z] = chunkId.split(':');
    const xInt = parseInt(x, 10);
    const zInt = parseInt(z, 10);

    try {
        shapeTerrain(seed, xInt, zInt, blockMap);
        paintSurface(blockMap);
    } catch(e) {
        console.error(e);
        console.debug(chunkId, seed);
    }
}