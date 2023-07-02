import BlockFactory from '@/framework/world/block/BlockFactory';
import { BlockMap } from '@/framework/world/chunk/Chunk';
import BlockId from '@/framework/world/block/BlockId';

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

export default function generationV1(blockMap: BlockMap, chunkId: string, seed: string) {
    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                const mapId = `${i}:1:${j}`;

                if (blockMap.has(mapId)) {
                    continue;
                }

                blockMap.set(mapId, BlockFactory.create({ id: blockId }));
            }
        }
    } catch (e) {
        console.error(e);
        console.debug(chunkId, seed);
    }

    return blockMap;
}