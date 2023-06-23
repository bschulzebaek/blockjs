import Chunk from './Chunk/Chunk';

export default function createChunkMap(renderDistance: number, offsetX: number, offsetZ: number): Map<string, null> {
    const map = new Map();

    if (renderDistance < 1) {
        throw new Error('"renderDistance" must be >= 1!');
    } else if (renderDistance === 1) {
        map.set(`${offsetX}:${offsetZ}`, null);

        return map
    }

    for (let x = -renderDistance; x < renderDistance + 1; x++) {
        for (let z = -renderDistance; z < renderDistance + 1; z++) {

            const hypotenuse = Math.sqrt(x * x + z * z);

            if (renderDistance < 8 || hypotenuse <= renderDistance) {
                const id = Chunk.toId(x + offsetZ, z + offsetZ);

                map.set(id, null);
            }
        }
    }

    return map;
}