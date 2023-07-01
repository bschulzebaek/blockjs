import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';
import { Vector3 } from 'three';
import Chunk, { BlockMap } from '@/world/chunk/Chunk';
import Block from '@/world/block/Block';

export default class ChunkUtils {
    static getBlockPosition({ x, y, z }: Vector3, strict = false): string {
        if (strict && (
            x < 0 || x >= CHUNK_SIZE ||
            y < 0 || y >= WORLD_HEIGHT ||
            z < 0 || z >= CHUNK_SIZE
        )) {
            console.error(`Block position out of bounds: ${x}:${y}:${z}`);
        }

        return `${x}:${y}:${z}`;
    }

    static positionToChunkPosition(position: Vector3) {
        const x = Math.floor(position.x / CHUNK_SIZE);
        const z = Math.floor(position.z / CHUNK_SIZE);

        return new Vector3(x, 0, z);
    }

    static getEmptyBlockMap(): BlockMap {
        return new Map();
    }

    static positionToId(position: Vector3) {
        return `${Math.floor(position.x / CHUNK_SIZE)}:${Math.floor(position.z / CHUNK_SIZE)}`;
    }

    static toId(x: number | string, z: number | string) {
        return `${x}:${z}`;
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
}