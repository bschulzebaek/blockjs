import Chunk from '../../Chunk/Chunk';
import BlockId from '@/core/world/Block/BlockId';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';

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

export default function generationV1(x: string, z: string, seed: string): Chunk | undefined {
    const blocks = Chunk.getEmptyBlocks();

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                blocks.set(`${i}:1:${j}`, { x: i, y: 1, z: j, id: blockId });
            }
        }

        for (let i = 6; i < 10; i++) {
            for (let j = 6; j < 10; j++) {
                for (let k = 6; k < 12; k++) {
                    const blockId = BLOCK_IDS[Math.floor(Math.random() * BLOCK_IDS.length)];
                    blocks.set(`${i}:${k}:${j}`, { x: i, y: k, z: j, id: blockId });
                }
            }
        }

        return ChunkFactory.create(parseInt(x, 10), parseInt(z), blocks);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return undefined;
}