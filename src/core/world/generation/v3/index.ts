import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import shapeTerrain from './shape-terrain'
import fillWaterBodies from './fill-water-bodies';
import paintSurface from './paint-surface';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import ChunkRepository from '@/core/world/chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';

export default async function generationV3(x: string, z: string, seed: string, uuid: string): Promise<Chunk> {
    const repository = new ChunkRepository(new StorageAdapter(uuid));
    // @ts-ignore
    const blocks = (await repository.read(ChunkUtils.toId(x, z)))?.blocks as BlockMap ?? ChunkUtils.getEmptyBlockMap();

    const xInt = parseInt(x, 10);
    const zInt = parseInt(z, 10);

    let chunk: Chunk | undefined = undefined;

    try {
        shapeTerrain(seed, xInt, zInt, blocks);
        fillWaterBodies(blocks);
        paintSurface(blocks);

        chunk = ChunkFactory.create(xInt, zInt, blocks);
    } catch(e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return chunk as Chunk;
}