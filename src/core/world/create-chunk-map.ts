import Chunk from './Chunk/Chunk';

export default function createChunkMap(radius: number, offsetX: number, offsetZ: number): Map<string, null> {
    const map = new Map();

    if (radius < 1) {
        throw new Error('"renderDistance" must be >= 1!');
    } else if (radius === 1) {
        map.set(`${offsetX}:${offsetZ}`, null);

        return map
    }

    for (let x = -radius; x < radius + 1; x++) {
        for (let z = -radius; z < radius + 1; z++) {

            const hypotenuse = Math.sqrt(x * x + z * z);

            if (radius < 8 || hypotenuse <= radius) {
                const id = Chunk.toId(x + offsetZ, z + offsetZ);

                map.set(id, null);
            }
        }
    }

    return map;
}