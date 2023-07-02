import LightMap from '@/framework/light/LightMap';
import strictModulo from '@/shared/math/strict-modulo';
import { Group, Vector3 } from 'three';
import Block from '@/framework/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import StorageObject, { RawStorageObject } from '@/framework/storage/StorageObject';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';

export type BlockMap = Map<string, Block | undefined>;

export default class Chunk extends Group implements StorageObject {
    private readonly chunkId: string;

    constructor(
        private readonly x: number,
        private readonly z: number,
        private readonly blocks: BlockMap,
        private readonly lightMap: LightMap = new Map(),
    ) {
        super();
        this.chunkId = ChunkUtils.chunkCoordinatesToChunkId(x, z);
        this.name = `chunk ${this.chunkId}`;
        this.position.set(this.getOffsetX(), 0, this.getOffsetZ());
    }

    public getChunkId = () => this.chunkId;

    public getX = (): number => this.x;

    public getOffsetX =(): number => this.x * CHUNK_SIZE;

    public getZ = (): number => this.z;

    public getOffsetZ = (): number => this.z * CHUNK_SIZE;

    public getBlocks = (): BlockMap => this.blocks;

    public getLightMap = (): LightMap => this.lightMap;

    public setBlock(position: Vector3, block: Block) {
        const local = position.clone();
        local.x = strictModulo(local.x, CHUNK_SIZE);
        local.z = strictModulo(local.z, CHUNK_SIZE);

        this.blocks.set(ChunkUtils.vectorToBlockId(local), block);
    }

    public getBlockByVector = (position: Vector3): Block | undefined => {
        const local = position.clone();
        local.x = strictModulo(local.x - this.getOffsetX(), CHUNK_SIZE);
        local.z = strictModulo(local.z - this.getOffsetZ(), CHUNK_SIZE);

        return this.blocks.get(ChunkUtils.vectorToBlockId(local));
    }

    public getBlockByCoordinates = (x: number, y: number, z: number): Block | undefined => {
        return this.blocks.get(ChunkUtils.worldCoordinatesToBlockId(x - this.getOffsetX(), y, z - this.getOffsetZ()));
    }

    /**
     * Use local coordinates (0 ≤ x ≤ 15 | 0 ≤ y ≤ ? | 0 ≤ z ≤ 15) to get the specific block.
     * Result can be undefined. I.e. the block hasn't existed yet (!= destroyed by Player).
     */
    public getBlockByLocalCoordinates = (x: number, y: number, z: number): Block | undefined => {
        return this.blocks.get(ChunkUtils.localCoordinatesToBlockId(x, y, z));
    }

    public toStorage(): RawStorageObject {
        return {
            id: this.chunkId,
            blocks: this.blocks,
        }
    }
}