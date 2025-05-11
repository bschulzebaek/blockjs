import { CHUNK } from '../defaults.const.ts';
import { Vector3 } from 'three';

export default class CoordinatesHelper {
    static ChunkCoordsToIndex(x: number, y: number, z: number): number {
        const _x = x < 0 ? x + CHUNK.WIDTH : x;
        const _y = y < 0 ? y + CHUNK.HEIGHT : y;
        const _z = z < 0 ? z + CHUNK.WIDTH : z;

        return _x + _y * CHUNK.WIDTH + _z * CHUNK.WIDTH * CHUNK.HEIGHT;
    }

    static WorldCoordsToChunkCoords(x: number, y: number, z: number): Vector3 {
        const xLocal = x % CHUNK.WIDTH;
        const yLocal = y % CHUNK.HEIGHT;
        const zLocal = z % CHUNK.WIDTH;

        return new Vector3(
            xLocal < 0 ? xLocal + CHUNK.WIDTH : xLocal,
            yLocal < 0 ? yLocal + CHUNK.HEIGHT : yLocal,
            zLocal < 0 ? zLocal + CHUNK.WIDTH : zLocal
        );
    }

    static IndexToCoords(index: number): Vector3 {
        const x = Math.floor(index % CHUNK.WIDTH);
        const z = Math.floor(index / (CHUNK.WIDTH * CHUNK.WIDTH));
        const y = Math.floor((index / CHUNK.WIDTH) % CHUNK.HEIGHT);

        return new Vector3(x, y, z);
    }
}