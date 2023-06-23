import Chunk from '@/core/world/Chunk/Chunk';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';

export default class WorldGenerator {
    constructor(
        private readonly seed: string,
    ) {

    }

    public getSeed() {
        return this.seed;
    }

    public generateChunk(x: string, z: string): Chunk | null {
        // return generationV1(x, z, this.seed);
        return generationV2(x, z, this.seed);
    }
}