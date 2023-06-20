import Chunk from '@/core/world/Chunk/Chunk';
import generationV1 from '@/core/world/generation/generation-v1';

export default class WorldGenerator {
    constructor(
        private readonly seed: string,
    ) {

    }

    public getSeed() {
        return this.seed;
    }

    public generateChunk(x: number, z: number): Chunk | null {
        return generationV1(x, z, this.seed);
    }
}