import { Camera, Vector3 } from 'three';
import World from '@/world/World';
import Block from '@/world/block/Block';
import { ChunkDirections } from '@/world/chunk/data/chunk-faces';
import BlockId from '@/world/block/BlockId';

interface RaycastResult {
    block: Block;
    position: Vector3;
    face: ChunkDirections;
}

function frac(dir: any, a: number) {
    return dir > 0 ? (1 - a % 1) : (a % 1);
}

export default class BlockRaycaster {
    private origin = new Vector3();
    private direction = new Vector3();

    constructor(
        private readonly world: World,
        private readonly camera: Camera,
        private readonly far: number = 10,
    ) {

    }

    public intersectWorld(): RaycastResult | undefined {
        // ToDo: Could probably be moved into a custom Camera class and be called on every update, if any more ray casting is needed!
        this.camera.updateWorldMatrix(true, false);
        this.origin.setFromMatrixPosition(this.camera.matrixWorld);
        const elements = this.camera.matrixWorld.elements;
        this.direction.set(-elements[8], -elements[9], -elements[10]).normalize();
        let distance = this.far;

        const { x: px, y: py, z: pz } = this.origin,
            { x: dirX, y: dirY, z: dirZ } = this.direction;

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

        let face = -1;

        while (distance-- > 0) {
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

            const block = this.world.getBlock(x, y, z);

            if (!block || block.id === BlockId.AIR) {
                continue;
            }


            return {
                block,
                position: new Vector3(x, y, z),
                face,
            };
        }

        return undefined;
    }
}