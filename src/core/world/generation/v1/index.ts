import Chunk, { BlockMap } from '@/core/world/chunk/Chunk';
import BlockId from '@/core/world/block/BlockId';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import ChunkRepository from '@/core/world/chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';

const biomeData = {
    humidity: 0.5,
    temperature: 0.5,
    continentalness: 0.5
};

const BLOCK_IDS = [
    BlockId.STONE,
    BlockId.GRASS,
    BlockId.DIRT,
    BlockId.COBBLESTONE,
    BlockId.PLANKS,
    BlockId.BEDROCK,
    BlockId.SAND,
    BlockId.GOLD_ORE,
    BlockId.IRON_ORE,
    BlockId.COAL_ORE,
    BlockId.SANDSTONE,
    BlockId.BOOKSHELF,
    BlockId.CRAFTING_TABLE,
];

export default async function generationV1(x: string, z: string, seed: string, uuid: string): Promise<Chunk> {
    const repository = new ChunkRepository(new StorageAdapter(uuid));
    // @ts-ignore
    const blockMap = (await repository.read(ChunkUtils.toId(x, z)))?.blocks as BlockMap ?? ChunkUtils.getEmptyBlockMap();

    let chunk: Chunk | undefined = undefined;

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                const mapId = `${i}:1:${j}`;

                if (blockMap.has(mapId)) {
                    continue;
                }

                blockMap.set(mapId, { id: blockId });
            }
        }

        chunk = ChunkFactory.create(parseInt(x, 10), parseInt(z), blockMap);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return chunk as Chunk;
}