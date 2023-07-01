import Chunk from '@/world/chunk/Chunk';
import Block from '@/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import { Group, Object3D, Vector3 } from 'three';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import strictModulo from '@/shared/math/strict-modulo';

type ChunkMap = Map<string, Chunk|undefined>;

export default class World extends Group {
    private readonly chunks: ChunkMap = new Map();
    private pendingChunks: ChunkMap = new Map();

    constructor() {
        super();

        this.name = 'world';
        this.position.add(new Vector3(0.5, 0.5, 0.5));
    }

    public setPendingChunks(map: ChunkMap) {
        this.pendingChunks = map;
    }

    public getPendingChunks() {
        return this.pendingChunks;
    }

    public getChunks(): ChunkMap {
        return this.chunks;
    }

    public getChunkById(id: string, strict: boolean = false): Chunk | undefined {
        const chunk = this.chunks.get(id);

        if (strict && !chunk) {
            throw new Error(`Chunk ${id} not found`);
        }

        return chunk;
    }

    /**
     * Use global coordinates to get the specific block. These will be converted to local chunk coordinates.
     * Result can be undefined. I.e. the block hasn't existed yet (!= destroyed by Player).
     */
    public getBlock = (x: number, y: number, z: number): Block | undefined => {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(ChunkUtils.toId(chunkX, chunkZ));

        if (!chunk) {
            return undefined;
        }

        return chunk.getBlock(strictModulo(x, CHUNK_SIZE), y, strictModulo(z, CHUNK_SIZE));
    }

    public getStats() {
        const chunks = this.chunks.size;
        let blocks = 0;

        this.chunks.forEach((chunk) => {
            blocks += chunk!.getBlocks().size;
        });

        return {
            blocks,
            chunks,
            world: this,
        };
    }

    public add(...object: Object3D[]): this {
        object.forEach((obj) => {
            if (!(obj instanceof Chunk)) {
                throw new Error('World can only contain Chunks!');
            }

            this.chunks.set(obj.getChunkId(), obj);
            this.pendingChunks.delete(obj.getChunkId());
            super.add(obj);
        });



        return this;
    }

    public remove(...object: Object3D[]): this {
        object.forEach((obj) => {
            if (!(obj instanceof Chunk)) {
                throw new Error('World can only contain Chunks!');
            }

            super.remove(obj);
            this.chunks.delete(obj.getChunkId());
        });

        return this;
    }
}