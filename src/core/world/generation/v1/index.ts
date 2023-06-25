import Chunk from '../../Chunk/Chunk';
import BlockId from '@/core/world/Block/BlockId';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';

const biomeData = {
    humidity: 0.5,
    temperature: 0.5,
    continentalness: 0.5
};

export default function generationV1(x: string, z: string, seed: string): Chunk | undefined {
    const blocks = Chunk.getEmptyBlocks();

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                blocks.set(`${i}:1:${j}`, { x: i, y: 1, z: j, id: BlockId.STONE, biomeData });
                blocks.set(`${i}:3:${j}`, { x: i, y: 3, z: j, id: BlockId.GRASS, biomeData });
                blocks.set(`${i}:7:${j}`, { x: i, y: 7, z: j, id: BlockId.STONE, biomeData });
                blocks.set(`${i}:12:${j}`, { x: i, y: 12, z: j, id: BlockId.GLASS, biomeData });
            }
        }

        return ChunkFactory.create(parseInt(x, 10), parseInt(z), blocks);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);
    }

    return undefined;
}