import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from './generation/WorldGenerator';

export default class World {
    private readonly generator: WorldGenerator;
    private readonly chunks: Map<string, Chunk | null>;

    constructor(
        private readonly seed: string,
    ) {
        this.generator = new WorldGenerator(seed);
        this.chunks = new Map();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.chunks.set(`${i},${j}`, this.generator.generateChunk(i, j));
            }
        }
    }

    public getSeed(): string {
        return this.seed;
    }

    public getChunks() {
        return this.chunks;
    }
}