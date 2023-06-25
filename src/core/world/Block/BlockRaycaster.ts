import { Camera, Intersection, Raycaster, Vector3 } from 'three';
import World from '@/core/world/World';
import Block from '@/core/world/Block/Block';

function ascSort(a: Intersection, b: Intersection) {
    return a.distance - b.distance;
}

function frac(dir: any, a: number) {
    return dir > 0 ? (1 - a % 1) : (a % 1);
}

export default class BlockRaycaster extends Raycaster {
    private origin = new Vector3();
    private direction = new Vector3();

    constructor(
        private readonly world: World,
        public readonly camera: Camera
    ) {
        super(undefined, undefined, 0, 10);
    }

    /**
     * Todo: Performance!
     */
    public intersectWorld(): Block | undefined {
        this.set(this.camera.getWorldPosition(this.origin), this.camera.getWorldDirection(this.direction));

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

        let block = undefined;

        while (!block && distance-- > 0) {
            if (toX < toY) {
                if (toX < toZ) {
                    x += stepX;
                    toX += dtX;
                } else {
                    z += stepZ;
                    toZ += dtZ;
                }
            } else {
                if (toY < toZ) {
                    y += stepY;
                    toY += dtY;
                } else {
                    z += stepZ;
                    toZ += dtZ;
                }
            }

            block = this.world.getBlock(x, y, z);

            if (block) {
                return block;
            }
        }

        return block;
    }

    private testBlock(x: number, y: number, z: number) {

    }
}