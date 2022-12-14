import { ChunkDirections } from '../../data/chunk-faces';
import Vector3 from '../math/Vector3';
import WorldInterface from '../../components/world/WorldInterface';

function frac(dir: any, a: number) {
    return dir > 0 ? (1 - a % 1) : (a % 1);
}

export default function getBlockFromRay(world: WorldInterface, point: Vector3, direction: Vector3, maxDistances = 10): any {
    const { x: px, y: py, z: pz } = point,
          { x: dirX, y: dirY, z: dirZ } = direction;

    let x = Math.floor(px),
        y = Math.floor(py),
        z = Math.floor(pz);

    const stepX = Math.sign(dirX),
          stepY = Math.sign(dirY),
          stepZ = Math.sign(dirZ),
          dtX = 1 / dirX * stepX,
          dtY = 1 / dirY * stepY,
          dtZ = 1 / dirZ * stepZ;

    let toX = x >= 0 ? frac(stepX, px) : frac(-stepX, -px),
        toY = y >= 0 ? frac(stepY, py) : frac(-stepY, -py),
        toZ = z >= 0 ? frac(stepZ, pz) : frac(-stepZ, -pz);

    toX *= dtX;
    toY *= dtY;
    toZ *= dtZ;

    let found = false,
        face;

    while (!found && maxDistances-- > 0) {
        if (toX < toY) {
            if (toX < toZ) {
                x += stepX;
                toX += dtX;
                face = stepX > 0 ? ChunkDirections.EAST : ChunkDirections.WEST;
            } else {
                z += stepZ;
                toZ += dtZ;
                face = stepZ > 0 ? ChunkDirections.NORTH : ChunkDirections.SOUTH;
            }
        } else {
            if (toY < toZ) {
                y += stepY;
                toY += dtY;
                face = -stepY > 0 ? ChunkDirections.UP : ChunkDirections.DOWN;
            } else {
                z += stepZ;
                toZ += dtZ;
                face = stepZ > 0 ? ChunkDirections.NORTH : ChunkDirections.SOUTH;
            }
        }

        const blockId = world.getBlockId(x, y, z);

        if (blockId) {
            return { x, y, z, face, blockId };
        }
    }

    return null;
}