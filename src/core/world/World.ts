import Chunk from '@/core/world/Chunk/Chunk';
import WorldGenerator from './generation/WorldGenerator';
import Block from '@/core/world/Block/Block';
import { CHUNK_SIZE } from '@/configuration';
import WorkerContext from '@/core/engine/WorkerContext';
import { Group, Vector3 } from 'three';
import BlockId from '@/core/world/Block/BlockId';

export default class World {
    private readonly generator: WorldGenerator;
    private readonly chunks: Map<string, Chunk> = new Map();
    private pendingChunks: Map<string, undefined> = new Map();
    private readonly chunkGroup: Group = new Group();

    constructor() {
        this.generator = new WorldGenerator();
        this.pendingChunks = WorldGenerator.createMap(); // Todo: Provide current Player Chunk as offset

        this.chunkGroup.name = 'chunks';
        this.chunkGroup.position.add(new Vector3(0.5, 0.5, 0.5));
    }

    public async loadPendingChunks() {
        await Promise.all(Array.from(this.pendingChunks.keys()).map(async (key) => {
            const [x, z] = key.split(':');
            const chunk = await this.generator.generateChunk(x, z);

            if (!this.pendingChunks.has(key)) {
                return;
            }

            this.chunks.set(key, chunk);
            this.pendingChunks.delete(key);

            this.chunkGroup.add(chunk);

            this.postProgress();
        }));
    }

    public async setup() {
        await this.loadPendingChunks();
    }

    public getChunkGroup() {
        return this.chunkGroup;
    }

    public setPendingChunks(map: Map<string, undefined>) {
        this.pendingChunks = map;
    }

    public getPendingChunks() {
        return this.pendingChunks;
    }

    public getChunks() {
        return this.chunks;
    }

    public getChunkByPosition(x: number, z: number, strict = false) {
        return this.getChunkById(Chunk.toId(x, z), strict);
    }

    public getChunkById(id: string, strict: boolean = false): Chunk | undefined {
        const chunk = this.chunks.get(id);

        if (strict && !chunk) {
            throw new Error(`Chunk ${id} not found`);
        }

        return chunk;
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

    public unloadChunks(ids: string[]) {
        ids.forEach((id) => {
            const chunk = this.chunks.get(id);

            if (!chunk) {
                return;
            }

            this.chunks.delete(id);
            this.chunkGroup.remove(chunk);
        });
    }

    public setBlock(position: Vector3, blockId: BlockId) {
        const chunkId = Chunk.positionToId(position);
        const chunk = this.getChunkById(chunkId);

        if (!chunk) {
            return; // todo: Out of bounds
        }

        const blockX = position.x - chunk.getOffsetX(),
            blockZ = position.z - chunk.getOffsetZ();

        chunk.setBlock(blockX, position.y, blockZ, blockId);
    }
}