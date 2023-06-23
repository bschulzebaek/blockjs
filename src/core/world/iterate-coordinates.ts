import World from '@/core/world/World';

export function iterateChunk3D(callback: (x: number, y: number, z: number) => void) {
    for (let x = 0; x < World.CHUNK_SIZE; x++) {
        for (let z = 0; z < World.CHUNK_SIZE; z++) {
            for (let y = 0; y < World.CHUNK_HEIGHT; y++) {
                callback(x, y, z);
            }
        }
    }
}

export function iterateChunk3DVertically(callback: (x: number, y: number, z: number) => void, direction = 1) {
    if (direction === 1) {
        for (let y = 0; y < World.CHUNK_HEIGHT; y++) {
            for (let x = 0; x < World.CHUNK_SIZE; x++) {
                for (let z = 0; z < World.CHUNK_SIZE; z++) {
                    callback(x, y, z);
                }
            }
        }
    } else {
        for (let y = World.CHUNK_HEIGHT - 1; y >= 0; y--) {
            for (let x = 0; x < World.CHUNK_SIZE; x++) {
                for (let z = 0; z < World.CHUNK_SIZE; z++) {
                    callback(x, y, z);
                }
            }
        }
    }
}

export function iterateChunk2D(callback: (x: number, z: number) => void) {
    for (let x = 0; x < World.CHUNK_SIZE; x++) {
        for (let z = 0; z < World.CHUNK_SIZE; z++) {
            callback(x, z);
        }
    }
}