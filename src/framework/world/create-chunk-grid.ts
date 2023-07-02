import ChunkUtils from '@/framework/world/chunk/ChunkUtils';

export default function createChunkGrid(radius: number, offsetX: number, offsetZ: number): Map<string, undefined> {
    const map = new Map();

    if (radius < 1) {
        throw new Error('"renderDistance" must be >= 1!');
    } else if (radius === 1) {
        map.set(`${offsetX}:${offsetZ}`, undefined);

        return map
    }

    for (let x = -radius; x < radius + 1; x++) {
        for (let z = -radius; z < radius + 1; z++) {
            const hypotenuse = Math.sqrt(x * x + z * z);

            if (radius < 8 || hypotenuse <= radius) {
                const id = ChunkUtils.chunkCoordinatesToChunkId(x + offsetX, z + offsetZ);

                map.set(id, undefined);
            }
        }
    }

    return map;
}