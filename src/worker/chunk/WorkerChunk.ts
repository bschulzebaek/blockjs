import { CHUNK } from '../../defaults.const.ts';
import { BlockIds } from '../../../data/block-ids.ts';
import type ChunkGeometryBuffer from '../../framework/chunk/ChunkGeometryBuffer.ts';
import CoordinatesHelper from '../../lib/CoordinatesHelper.ts';

export default class WorkerChunk {
    public ready = false;
    public opaque?: ChunkGeometryBuffer;
    public transparent?: ChunkGeometryBuffer;
    public blocks: Uint8Array;
    public blockData: Map<string, unknown>;
    public x: number;
    public y: number;
    public z: number;
    public isModified = false;
    
    constructor(
        x: number,
        y: number,
        z: number,
        blocks: Uint8Array = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH),
        blockData = new Map<string, unknown>(),
        isModified = false,
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.blocks = blocks;
        this.blockData = blockData;
        this.isModified = isModified;
    }
    
    static getId(x: number, y: number, z: number): string {
        return `${x}:${y}:${z}`;
    }
    
    public getId() {
        return WorkerChunk.getId(this.x, this.y, this.z);
    }
    
    public getOffsetX(): number {
        return this.x * CHUNK.WIDTH;
    }
    
    public getOffsetY(): number {
        return this.y * CHUNK.HEIGHT;
    }
    
    public getOffsetZ(): number {
        return this.z * CHUNK.WIDTH;
    }

    public getBlockLocal = (x: number, y: number, z: number): number => {
        if (x < 0 || x >= CHUNK.WIDTH || y < 0 || y >= CHUNK.HEIGHT || z < 0 || z >= CHUNK.WIDTH) {
            // throw new LogicError('Tried to access block outside of Chunk bounds!');
            throw new Error('Tried to access block outside of Chunk bounds!');
        }

        const index = CoordinatesHelper.ChunkCoordsToIndex(x, y, z);

        return this.blocks[index] ??BlockIds.AIR;
    }

    public getBlockAbsolute = (x: number, y: number, z: number): number => {
        const xLocal = x - this.getOffsetX();
        const yLocal = y - this.getOffsetY();
        const zLocal = z - this.getOffsetZ();

        return this.getBlockLocal(xLocal, yLocal, zLocal);
    }
}