import { Object3D, Mesh, Material, BufferGeometry } from 'three';
import { CHUNK } from '../../defaults.const.ts';
import type GenerationResponse from './worker/GenerationResponse.ts';
import createMesh from './geometry/create-mesh.ts';
import { type BlockId, BlockIds } from '../../../data/block-ids.ts';
import CoordinatesHelper from './CoordinatesHelper.ts';

export default class Chunk extends Object3D {
    static MESH_OPAQUE = 'opaque';
    static MESH_TRANSPARENT = 'transparent';

    public readonly type = 'Chunk';
    public readonly name: string;

    public blocks = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH);
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    public readonly castShadow = false;
    public readonly receiveShadow = false;

    constructor(x: number, y: number, z: number, blocks: Uint8Array = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH)) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.blocks = blocks;
        this.name = Chunk.getId(x, y, z);
        this.position.set(this.getOffsetX(), this.getOffsetY(), this.getOffsetZ());

        this.updateWorldMatrix(false, false);
    }

    static getId(x: number, y: number, z: number): string {
        return `${x}:${y}:${z}`;
    }

    public getId() {
        return this.name;
    }

    public getOffsetX(): number {
        return this.x * CHUNK.WIDTH;
    }

    public getOffsetY(): number {
        return this.y * CHUNK.HEIGHT;
    }

    public getOffsetZ(): number {
        return this.z * CHUNK.WIDTH;
    }

    public hydrate(data: GenerationResponse) {
        this.getObjectByName(Chunk.MESH_OPAQUE)?.removeFromParent();
        this.getObjectByName(Chunk.MESH_TRANSPARENT)?.removeFromParent();

        const meshes = createMesh(data);

        this.blocks = data.blocks;
        this.add(meshes.transparent, meshes.opaque);
    }

    public destroy() {
        // Remove and dispose of opaque mesh
        const opaqueMesh = this.getObjectByName(Chunk.MESH_OPAQUE) as Mesh<BufferGeometry, Material | Material[]>;
        if (opaqueMesh) {
            opaqueMesh.removeFromParent();
            if (opaqueMesh.geometry) {
                opaqueMesh.geometry.dispose();
            }
            if (opaqueMesh.material) {
                if (Array.isArray(opaqueMesh.material)) {
                    opaqueMesh.material.forEach(material => material.dispose());
                } else {
                    opaqueMesh.material.dispose();
                }
            }
        }

        // Remove and dispose of transparent mesh
        const transparentMesh = this.getObjectByName(Chunk.MESH_TRANSPARENT) as Mesh<BufferGeometry, Material | Material[]>;
        if (transparentMesh) {
            transparentMesh.removeFromParent();
            if (transparentMesh.geometry) {
                transparentMesh.geometry.dispose();
            }
            if (transparentMesh.material) {
                if (Array.isArray(transparentMesh.material)) {
                    transparentMesh.material.forEach(material => material.dispose());
                } else {
                    transparentMesh.material.dispose();
                }
            }
        }

        // Clear the blocks array
        this.blocks = new Uint8Array(0);

        // Remove from parent
        this.removeFromParent();
    }

    public getBlockLocal = (x: number, y: number, z: number): BlockId => {
        if (x < 0 || x >= CHUNK.WIDTH || y < 0 || y >= CHUNK.HEIGHT || z < 0 || z >= CHUNK.WIDTH) {
            // throw new LogicError('Tried to access block outside of Chunk bounds!');
            throw new Error('Tried to access block outside of Chunk bounds!');
        }

        const index = CoordinatesHelper.ChunkCoordsToIndex(x, y, z);

        return this.blocks[index] ?? BlockIds.AIR;
    }

    public getBlockAbsolute = (x: number, y: number, z: number): BlockId => {
        const xLocal = x - this.getOffsetX();
        const yLocal = y - this.getOffsetY();
        const zLocal = z - this.getOffsetZ();

        return this.getBlockLocal(xLocal, yLocal, zLocal);
    }
}