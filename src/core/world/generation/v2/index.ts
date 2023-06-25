import Chunk, { BlockMap } from '../../Chunk/Chunk';
import shapeTerrain from './shape-terrain'
import fillWaterBodies from './fill-water-bodies';
import paintSurface from './paint-surface';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';
import ChunkRepository from '@/core/world/Chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';

export default async function generationV2(x: string, z: string, seed: string, uuid: string): Promise<Chunk> {
    const repository = new ChunkRepository(new StorageAdapter(uuid));
    // @ts-ignore
    const blocks = (await repository.read(Chunk.toId(x, z)))?.blocks as BlockMap ?? Chunk.getEmptyBlocks();

    const xInt = parseInt(x, 10);
    const zInt = parseInt(z, 10);

    let chunk: Chunk | undefined = undefined;

    try {
        shapeTerrain(seed, xInt, zInt, blocks);
        fillWaterBodies(blocks);
        // paintSurface(blocks); // todo: Doesn't work with current Chunk storage implementation

        chunk = ChunkFactory.create(xInt, zInt, blocks);
    } catch(e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return chunk as Chunk;
}