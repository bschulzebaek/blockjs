import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from './generation/WorldGenerator';
import createChunkMap from '@/core/world/create-chunk-map';
import { RENDER_DISTANCE } from '@/configuration';

export default class World {
    private readonly generator: WorldGenerator;
    private readonly chunks: Map<string, Chunk> = new Map();
    private readonly pendingChunks: Map<string, null> = new Map();

    constructor(
        private readonly seed: string,
    ) {
        this.generator = new WorldGenerator(seed);
        this.pendingChunks = createChunkMap(RENDER_DISTANCE, 0, 0);

        Array.from(this.pendingChunks.keys()).forEach(async (key) => {
            const [x, z] = key.split(':');

            this.chunks.set(key, this.generator.generateChunk(x, z)!);
            this.pendingChunks.delete(key);
            this.postProgress();
        });
    }

    public getSeed(): string {
        return this.seed;
    }

    public getChunks() {
        return this.chunks;
    }

    private postProgress() {
        postMessage({
            action: 'world-generation-progress',
            data: {
                total: this.pendingChunks.size + this.chunks.size,
                ready: this.chunks.size,
            },
        });
    }
}