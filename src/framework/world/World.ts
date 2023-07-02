import Chunk from '@/framework/world/chunk/Chunk';
import Block from '@/framework/world/block/Block';
import { Group, Object3D, Vector3 } from 'three';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';

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

    public getChunkByChunkCoordinates(x: string | number, z: number, strict: boolean = false): Chunk | undefined {
        const id = ChunkUtils.chunkCoordinatesToChunkId(x, z);
        const chunk = this.chunks.get(id);

        if (strict && !chunk) {
            throw new Error(`Chunk ${id} not found`);
        }

        return chunk;
    }

    public getChunkByCoordinates(x: string | number, z: number, strict: boolean = false): Chunk | undefined {
        const id = ChunkUtils.worldCoordinatesToChunkId(x, z);
        const chunk = this.chunks.get(id);

        if (strict && !chunk) {
            throw new Error(`Chunk ${id} not found`);
        }

        return chunk;
    }

    public getChunkByPosition(position: Vector3, strict: boolean = false): Chunk | undefined {
        const id = ChunkUtils.vectorToChunkId(position);
        const chunk = this.chunks.get(id);

        if (strict && !chunk) {
            throw new Error(`Chunk ${id} not found`);
        }

        return chunk;
    }

    public getBlockByCoordinates = (x: number, y: number, z: number): Block | undefined => {
        const chunk = this.chunks.get(ChunkUtils.worldCoordinatesToChunkId(x, z));

        if (!chunk) {
            return undefined;
        }

        return chunk.getBlockByCoordinates(x, y, z);
    }

    public getBlockByVector = (position: Vector3): Block | undefined => {
        const chunk = this.chunks.get(ChunkUtils.vectorToChunkId(position));

        if (!chunk) {
            return undefined;
        }

        return chunk.getBlockByVector(position);
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