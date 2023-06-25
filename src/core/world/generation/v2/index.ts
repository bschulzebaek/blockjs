import Chunk from '../../Chunk/Chunk';
import shapeTerrain from './shape-terrain'
import fillWaterBodies from './fill-water-bodies';
import paintSurface from './paint-surface';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';

export default function generationV2(x: string, z: string, seed: string) {
    const blocks = Chunk.getEmptyBlocks();
    const xInt = parseInt(x, 10);
    const zInt = parseInt(z, 10);

    try {
        shapeTerrain(seed, xInt, zInt, blocks);
        fillWaterBodies(blocks);
        paintSurface(blocks);

        return ChunkFactory.create(xInt, zInt, blocks);
    } catch(e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return undefined;
}