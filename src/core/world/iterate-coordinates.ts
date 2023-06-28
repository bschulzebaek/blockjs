import { CHUNK_SIZE, WORLD_HEIGHT } from '@/configuration';

export function iterateChunk3D(callback: (x: number, y: number, z: number) => void) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
            for (let y = 0; y < WORLD_HEIGHT; y++) {
                callback(x, y, z);
            }
        }
    }
}

export function iterateChunk3DVertically(callback: (x: number, y: number, z: number) => void, direction = 1) {
    if (direction === 1) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    callback(x, y, z);
                }
            }
        }
    } else {
        for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    callback(x, y, z);
                }
            }
        }
    }
}

export function iterateChunk2D(callback: (x: number, z: number) => void) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
            callback(x, z);
        }
    }
}