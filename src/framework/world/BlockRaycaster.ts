import { Camera, Vector3 } from 'three';
import World from './World.ts';
import { ChunkDirections } from '../../../data/chunk-faces.ts';
import { BlockIds } from '../../../data/block-ids.ts';

export interface RaycastResult {
    block: number;
    position: Vector3;
    face: number;
}

export default class BlockRaycaster {
    private origin = new Vector3();
    private direction = new Vector3();
    private world: World;
    private camera: Camera;
    private far: number;

    constructor(world: World, camera: Camera, far = 10) {
        this.world = world;
        this.camera = camera;
        this.far = far;
    }

    public async intersectWorld(): Promise<RaycastResult | null> {
        this.camera.updateMatrixWorld(true);
        this.origin.setFromMatrixPosition(this.camera.matrixWorld);
        this.direction.copy(this.camera.getWorldDirection(new Vector3())).normalize();

        const pos = this.origin.clone();
        const dir = this.direction.clone();

        const step = new Vector3(
            Math.sign(dir.x),
            Math.sign(dir.y),
            Math.sign(dir.z)
        );

        let voxel = new Vector3(
            Math.round(pos.x),
            Math.round(pos.y),
            Math.round(pos.z)
        );

        const tDelta = new Vector3(
            Math.abs(1 / (dir.x || 1e-8)),
            Math.abs(1 / (dir.y || 1e-8)),
            Math.abs(1 / (dir.z || 1e-8))
        );

        const tMax = new Vector3(
            ((step.x > 0 ? voxel.x + 0.5 - pos.x : pos.x - (voxel.x - 0.5)) || 0.000001) * tDelta.x,
            ((step.y > 0 ? voxel.y + 0.5 - pos.y : pos.y - (voxel.y - 0.5)) || 0.000001) * tDelta.y,
            ((step.z > 0 ? voxel.z + 0.5 - pos.z : pos.z - (voxel.z - 0.5)) || 0.000001) * tDelta.z
        );

        let face = -1;
        let dist = 0;

        for (let i = 0; i < this.far * 3; i++) {
            const block = this.world.getBlockSync(voxel.x, voxel.y, voxel.z);
            if (block !== BlockIds.AIR) {
                return {
                    block,
                    position: voxel.clone(),
                    face,
                };
            }

            if (tMax.x < tMax.y && tMax.x < tMax.z) {
                voxel.x += step.x;
                dist = tMax.x;
                tMax.x += tDelta.x;
                face = step.x > 0 ? ChunkDirections.WEST : ChunkDirections.EAST;
            } else if (tMax.y < tMax.z) {
                voxel.y += step.y;
                dist = tMax.y;
                tMax.y += tDelta.y;
                face = step.y > 0 ? ChunkDirections.DOWN : ChunkDirections.UP;
            } else {
                voxel.z += step.z;
                dist = tMax.z;
                tMax.z += tDelta.z;
                face = step.z > 0 ? ChunkDirections.SOUTH : ChunkDirections.NORTH;
            }

            if (dist > this.far) break;
        }

        return null;
    }
}
