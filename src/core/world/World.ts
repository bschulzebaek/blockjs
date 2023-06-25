import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from './generation/WorldGenerator';
import Block from '@/core/world/Block/Block';
import { CHUNK_SIZE } from '@/configuration';

import WorkerContext from '@/core/engine/WorkerContext';

export default class World {
    private readonly generator: WorldGenerator;
    private readonly chunks: Map<string, Chunk> = new Map();
    private readonly pendingChunks: Map<string, undefined> = new Map();

    constructor() {
        this.generator = new WorldGenerator();
        this.pendingChunks = this.generator.createMap();
    }

    public async loadChunks() {
        await Promise.all(Array.from(this.pendingChunks.keys()).map(async (key) => {
            const [x, z] = key.split(':');

            const chunk = await this.generator.generateChunk(x, z);

            this.chunks.set(key, chunk);
            this.pendingChunks.delete(key);
            this.postProgress();
        }));
    }

    public getChunks() {
        return this.chunks;
    }

    private postProgress() {
        WorkerContext.messageHandler.sendGenerationProgress({
            total: this.pendingChunks.size + this.chunks.size,
            ready: this.chunks.size,
        });
    }

    public getBlock(x: number, y: number, z: number): Block | undefined {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(Chunk.toId(chunkX, chunkZ));

        if (!chunk) {
            return undefined;
        }

        return chunk.getBlockLocal(
            x - chunk.getOffsetX(),
            y,
            z - chunk.getOffsetZ()
        );
    }
}