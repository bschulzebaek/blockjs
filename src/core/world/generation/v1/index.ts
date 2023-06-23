import Chunk from '../../Chunk/Chunk';
import Block from '@/core/world/Block/Block';
import BlockId from '@/core/world/Block/BlockId';

export default function generationV1(x: string, z: string, seed: string): Chunk | null {
    const blocks = Chunk.getEmptyBlocks();

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                blocks.set(`${i}:1:${j}`, new Block(i, 1, j, BlockId.STONE));
            }
        }

        return new Chunk(parseInt(x, 10), parseInt(z), blocks);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);

        return null;
    }
}