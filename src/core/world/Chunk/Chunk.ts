import { BufferGeometry, Group, Object3D, Vector3 } from 'three';
import Block from '@/core/world/Block/Block';
import ChunkGeometry from '@/core/world/Chunk/ChunkGeometry';
import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import BlockId from '@/core/world/Block/BlockId';

export type BlockMap = Map<string, Block | undefined>;

export default class Chunk extends Group {
    private geometries: BufferGeometry[] = [];
    private dirty = false;

    constructor(
        private readonly x: number,
        private readonly z: number,
        private readonly blocks: BlockMap,
    ) {
        super();
        this.name = `chunk ${this.id}`;
        this.position.set(this.getOffsetX(), 0, this.getOffsetZ());
    }

    public pushGeometry(geometry: BufferGeometry) {
        this.geometries.push(geometry);
    }

    public getX(): number {
        return this.x;
    }

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

    public getBlockLocal(x: number, y: number, z: number): Block | undefined {
        return this.blocks.get(`${x}:${y}:${z}`);
    }

    public iterateBlocksLocal(callback: (x: number, y: number, z: number, block: Block) => void) {
        this.blocks.forEach((block, key) => {
            const [x, y, z] = key.split(':').map((number) => parseInt(number, 10));

            callback(
                x,
                y,
                z,
                block as Block,
            );
        });
    }

    public getObject(): Object3D {
        return this;
    }

    static getBlockPosition(x: number, y: number, z: number, strict = false) {
        if (strict && (
            x < 0 || x >= CHUNK_SIZE ||
            y < 0 || y >= WORLD_HEIGHT ||
            z < 0 || z >= CHUNK_SIZE
        )) {
            throw new Error(`Block position out of bounds: ${x}:${y}:${z}`);
        }

        return `${x}:${y}:${z}`;
    }

    static getEmptyBlocks(): BlockMap {
        return new Map();
    }

    public getId() {
        return Chunk.toId(this.x, this.z);
    }

    public setBlock(x: number, y: number, z: number, id: BlockId) {
        const position = Chunk.getBlockPosition(x, y, z);

        if (id === BlockId.AIR) {
            this.blocks.delete(position);
        } else {
            this.blocks.set(position, { id, x, y, z });
        }

        ChunkGeometry.build(this);
    }

    static toId(x: number | string, z: number | string) {
        return `${x}:${z}`;
    }

    static positionToId(position: Vector3) {
        return `${Math.floor(position.x / CHUNK_SIZE)}:${Math.floor(position.z / CHUNK_SIZE)}`;
    }
}