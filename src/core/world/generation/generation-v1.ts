import Chunk from '../Chunk/Chunk';

export default function generationV1(x: number, z: number, seed: string): Chunk | null {
    const blocks = Chunk.getEmptyBlocks();

    try {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                blocks.set(`${i}:0:${j}`, 1);
            }
        }

        return new Chunk(x, z, blocks);
    } catch (e) {
        console.error(e);
        console.debug(`${x}:${z}`, seed);

        return null;
    }
}