import { Group, Object3D } from 'three';
import Block from '@/core/world/Block/Block';
import ChunkGeometry from '@/core/world/Chunk/ChunkGeometry';
import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';

export type BlockMap = Map<string, Block | undefined>;

export default class Chunk extends Group {

    constructor(
        private readonly x: number,
        private readonly z: number,
        private readonly blocks: BlockMap,
    ) {
        super();
        this.name = `chunk ${this.getOffsetX()}:${this.getOffsetZ()}`;
        this.position.set(this.getOffsetX(), 0, this.getOffsetZ());

        ChunkGeometry.build(this);
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

    public iterateBlocksAbsolute(callback: (x: number, y: number, z: number, block: Block) => void) {
        const chunkX = this.getOffsetX();
        const chunkZ = this.getOffsetZ();

        this.blocks.forEach((block, key) => {
            const [x, y, z] = key.split(':').map((number) => parseInt(number, 10));

            callback(
                x + chunkX,
                y,
                z + chunkZ,
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

    static toId(x: number | string, z: number | string) {
        return `${x}:${z}`;
    }
}