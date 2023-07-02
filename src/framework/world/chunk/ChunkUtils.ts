import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import strictModulo from '@/shared/math/strict-modulo';
import { Vector3 } from 'three';
import Chunk, { BlockMap } from '@/framework/world/chunk/Chunk';
import Block from '@/framework/world/block/Block';

export default class ChunkUtils {

    static vectorToChunkId(position: Vector3) {
        return `${Math.floor(position.x / CHUNK_SIZE)}:${Math.floor(position.z / CHUNK_SIZE)}`;
    }

    static vectorToChunkVector(position: Vector3) {
        const _position = position.clone();

        _position.x = Math.floor(_position.x / CHUNK_SIZE);
        _position.z = Math.floor(_position.z / CHUNK_SIZE);

        return _position;
    }

    static chunkCoordinatesToChunkId(x: string | number, z: string | number) {
        return `${x}:${z}`;
    }

    static worldCoordinatesToChunkId(x: string | number, z: string | number)  {
        const xInt = typeof x === 'string' ? parseInt(x, 10) : x;
        const zInt = typeof z === 'string' ? parseInt(z, 10) : z;

        return `${Math.floor(xInt / CHUNK_SIZE)}:${Math.floor(zInt / CHUNK_SIZE)}`;
    }

    static vectorToLocalVector(v: Vector3) {
        const _v = v.clone();

        _v.x = strictModulo(_v.x, CHUNK_SIZE);
        _v.z = strictModulo(_v.z, CHUNK_SIZE);

        return _v;
    }

    static vectorToBlockId({ x, y, z }: Vector3, strict = false): string {
        if (strict && (
            x < 0 || x >= CHUNK_SIZE ||
            y < 0 || y >= WORLD_HEIGHT ||
            z < 0 || z >= CHUNK_SIZE
        )) {
            console.error(`Block position out of bounds: ${ChunkUtils.worldCoordinatesToBlockId(x, y, z)}`);
        }

        return `${x}:${y}:${z}`;
    }

    static localCoordinatesToBlockId(x: string | number, y: string | number, z: string | number) {
        return `${x}:${y}:${z}`;
    }

    static worldCoordinatesToBlockId(x: string | number, y: string | number, z: string | number) {
        const xInt = typeof x === 'string' ? parseInt(x, 10) : x;
        const zInt = typeof z === 'string' ? parseInt(z, 10) : z;

        return `${strictModulo(xInt, CHUNK_SIZE)}:${y}:${strictModulo(zInt, CHUNK_SIZE)}`;
    }

    static getEmptyBlockMap(): BlockMap {
        return new Map();
    }

    static iterateBlocks(chunk: Chunk, callback: (x: number, y: number, z: number, block: Block) => void): void {
        chunk.getBlocks().forEach((block, key) => {
            const [x, y, z] = key.split(':').map((number) => parseInt(number, 10));

            callback(
                x,
                y,
                z,
                block as Block,
            );
        });
    }

    static getFacingCoordinates(x: number, y: number, z: number) {
        return [
            [x, y, z + 1],
            [x, y, z - 1],
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y + 1, z],
            [x, y - 1, z],
        ];
    }

    static getFacingHorizontalCoordinates(x: number, y: number, z: number) {
        return [
            [x, y, z + 1],
            [x, y, z - 1],
            [x + 1, y, z],
            [x - 1, y, z],
        ];
    }
}