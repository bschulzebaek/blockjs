import Chunk, { BlockMap } from '../../Chunk/Chunk';
import BlockId from '@/core/world/Block/BlockId';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';
import ChunkRepository from '@/core/world/Chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';

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
    const blocks = (await repository.read(Chunk.toId(x, z)))?.blocks as BlockMap ?? Chunk.getEmptyBlocks();

    let chunk: Chunk | undefined = undefined;

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                const mapId = `${i}:1:${j}`;

                if (blocks.has(mapId)) {
                    continue;
                }

                blocks.set(mapId, { x: i, y: 1, z: j, id: blockId });
            }
        }

        for (let i = 6; i < 10; i++) {
            for (let j = 6; j < 10; j++) {
                for (let k = 6; k < 12; k++) {
                    const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                    const mapId = `${i}:1:${j}`;

                    if (blocks.has(mapId)) {
                        continue;
                    }

                    blocks.set(`${i}:${k}:${j}`, { x: i, y: k, z: j, id: blockId });
                }
            }
        }

        chunk = ChunkFactory.create(parseInt(x, 10), parseInt(z), blocks);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return chunk as Chunk;
}