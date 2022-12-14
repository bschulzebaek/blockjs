import BlockInterface from './BlockInterface';
import BlockID from '../../data/block-id';
import StoreClass from '../../shared/storage/StoreClass';
import { ChunkFaces } from '../../data/chunk-faces';
import { Vector3 } from '../../shared/math';
import { CHUNK_HEIGHT } from '../world/world-generation/generation-v1/configuration';
import generateChunk from '../world/world-generation/generate-chunk';
import OutOfChunkError from './exceptions/OutOfChunkError';

export type BlockMap = Map<string, BlockInterface>;

export interface ChunkRawInterface {
    id: string;
    blocks: BlockMap;
    x: number;
    z: number;
}

export default class Chunk extends StoreClass {
    static STORAGE_IDENTIFIER = 'id';
    static STORAGE_FIELDS = [
        'id',
        'blocks',
        'x',
        'z',
    ];
    static WIDTH = 16;
    static LENGTH = 16;
    static HEIGHT = CHUNK_HEIGHT;

    private readonly id: string;
    private readonly blocks: BlockMap;
    private readonly x: number;
    private readonly z: number;
    private changed = false;

    constructor(x: number, z: number, blocks = Chunk.getEmptyBlocks()) {
        super(Chunk.STORAGE_IDENTIFIER, Chunk.STORAGE_FIELDS);

        this.id = Chunk.worldToId(x, z);
        this.blocks = blocks;
        this.x = x;
        this.z = z;
    }

    public getWorldX() {
        return this.x;
    }

    public getWorldZ() {
        return this.z;
    }

    public getBlockX() {
        return this.x * Chunk.WIDTH;
    }

    public getBlockZ() {
        return this.z * Chunk.LENGTH;
    }

    public getId() {
        return this.id;
    }

    public getBlocks() {
        return this.blocks;
    }

    public getBlockIds() {
        return Array.from(this.blocks.values()).map((block) => block.id);
    }

    public getChanged() {
        return this.changed;
    }

    public getBlockId(x: number, y: number, z: number) {
        const block = this.blocks.get(Chunk.getBlockPosition(x, y, z));

        return block ? block.id : BlockID.AIR;
    }

    public getBlock(x: number, y: number, z: number) {
        return this.blocks.get(Chunk.getBlockPosition(x, y, z));
    }

    public setBlockId(x: number, y: number, z: number, id: BlockID) {
        const position = Chunk.getBlockPosition(x, y, z);

        this.blocks.set(position, { id });

        this.changed = true;
    }

    public getFacingBlockId(x: number, y: number, z: number, dir: number): BlockID {
        if (dir < 0 || dir > ChunkFaces.length) {
            throw new Error(`Invalid value for parameter dir! ${dir} given, expected value in range of 0 and ${ChunkFaces.length}.`);
        }

        const [offsetX, offsetY, offsetZ] = ChunkFaces[dir].n;

        x += offsetX;
        y += offsetY;
        z += offsetZ;

        return this.getBlockId(x, y, z);
    }

    public getFacingBlockIds(x: number, y: number, z: number): BlockID[] {
        let facing = [];

        facing.push(this.getBlockId(x, y - 1, z));
        facing.push(this.getBlockId(x, y + 1, z));
        facing.push(this.getBlockId(x - 1, y, z));
        facing.push(this.getBlockId(x + 1, y, z));
        facing.push(this.getBlockId(x, y, z - 1));
        facing.push(this.getBlockId(x, y, z + 1));

        return facing;
    }

    static createFromRaw(raw: ChunkRawInterface) {
        const chunkX = raw.x,
              chunkZ = raw.z;

        return new Chunk(chunkX, chunkZ, raw.blocks);
    }

    public getRaw(): ChunkRawInterface {
        return {
            id: this.id,
            x: this.x,
            z: this.z,
            blocks: this.blocks,
        }
    }

    static worldToId(x: number, z: number): string {
        return `${x}:${z}`;
    }

    static blockToId(x: number, z: number) {
        return `${Math.floor(x / Chunk.WIDTH)}:${Math.floor(z / Chunk.LENGTH)}`;
    }

    static getEmptyBlocks(): BlockMap {
        return new Map();
    }

    static getBlockPosition(x: number, y: number, z: number, strict = false) {
        if (strict && (
            x < 0 || x >= Chunk.WIDTH ||
            y < 0 || y >= Chunk.HEIGHT ||
            z < 0 || z >= Chunk.LENGTH
        )) {
            throw new OutOfChunkError(x, y, z);
        }

        return `${x}:${y}:${z}`;
    }

    static blockToChunkPosition(position: Vector3) {
        const x = Math.floor(position.x / Chunk.WIDTH);
        const z = Math.floor(position.z / Chunk.WIDTH);

        return new Vector3(x, 0, z);
    }

    static generate(id: string, seed: string) {
        return generateChunk(id, seed);
    }

    public convertToAbsoluteBlockPosition(position: Vector3) {
        return new Vector3(position.x + this.x * Chunk.WIDTH, position.y, position.z + this.z * Chunk.LENGTH);
    }
}