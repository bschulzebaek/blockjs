import { Group } from 'three';
import Block from '@/core/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import StorageObject, { RawStorageObject } from '@/core/engine/storage/StorageObject';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';

export type BlockMap = Map<string, Block | undefined>;

export default class Chunk extends Group implements StorageObject {
    private readonly chunkId: string;

    constructor(
        private readonly x: number,
        private readonly z: number,
        private readonly blocks: BlockMap,
    ) {
        super();
        this.chunkId = ChunkUtils.toId(x, z);
        this.name = `chunk ${this.chunkId}`;
        this.position.set(this.getOffsetX(), 0, this.getOffsetZ());
    }

    public getChunkId() {
        return this.chunkId;
    }

    public getX(): number {
        return this.x;
    }

    /**
     *
     */
    public getOffsetX(): number {
        return this.x * CHUNK_SIZE;
    }

    public getZ(): number {
        return this.z;
    }

    public getOffsetZ(): number {
        return this.z * CHUNK_SIZE;
    }

    public getBlocks(): BlockMap {
        return this.blocks;
    }

    /**
     * Use local coordinates (0 ≤ x ≤ 15 | 0 ≤ y ≤ ? | 0 ≤ z ≤ 15) to get the specific block.
     * Result can be undefined. I.e. the block hasn't existed yet (!= destroyed by Player).
     */
    public getBlock(x: number, y: number, z: number): Block | undefined {
        return this.blocks.get(`${x}:${y}:${z}`);
    }

    public toStorage(): RawStorageObject {
        return {
            id: this.chunkId,
            blocks: this.blocks,
        }
    }
}