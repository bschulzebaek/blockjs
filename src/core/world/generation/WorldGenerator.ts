import Chunk from '@/core/world/Chunk/Chunk';
import generationV1 from '@/core/world/generation/v1';
import generationV2 from '@/core/world/generation/v2';
import { WORLD_GENERATION_VERSION } from '@/configuration';

export default class WorldGenerator {
    constructor(
        private readonly seed: string,
    ) {

    }

    public getSeed() {
        return this.seed;
    }

    public generateChunk(x: string, z: string): Chunk | null {
        switch (WORLD_GENERATION_VERSION) {
            case 1:
                return generationV1(x, z, this.seed);
            case 2:
                return generationV2(x, z, this.seed);
            default:
                throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
        }
    }
}