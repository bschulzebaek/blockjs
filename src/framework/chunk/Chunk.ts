import {
    BufferGeometry, DoubleSide,
    Float32BufferAttribute,
    Mesh, MeshBasicMaterial,
    NearestFilter,
    NearestMipMapLinearFilter,
    Object3D
} from 'three';
import { CHUNK } from '../../defaults.const.ts';
import { type BlockId, BlockIds } from '../../../data/block-ids.ts';
import CoordinatesHelper from '../../lib/CoordinatesHelper.ts';
import type ChunkData from './ChunkData.ts';
import type ChunkGeometry from './ChunkGeometry.ts';
import type ChunkMesh from './ChunkMesh.ts';
import { AssetName } from '../asset/AssetService.ts';

type MaterialName = 'opaque' | 'transparent';

type ChunkMaterials = {
    [x in MaterialName]: MeshBasicMaterial;
}

let materials: ChunkMaterials | null = null;

export default class Chunk extends Object3D {
    static MESH_OPAQUE = 'opaque';
    static MESH_TRANSPARENT = 'transparent';

    public readonly type = 'chunk';
    public readonly name: string;

    public blocks = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH);
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    public readonly castShadow = false;
    public readonly receiveShadow = false;

    constructor(x: number, y: number, z: number) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
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

    public hydrate(data: ChunkData) {
        this.getObjectByName(Chunk.MESH_OPAQUE)?.removeFromParent();
        this.getObjectByName(Chunk.MESH_TRANSPARENT)?.removeFromParent();

        const meshes = Chunk.createMesh(data);

        this.blocks.set(data.blocks);
        this.add(meshes.transparent, meshes.opaque);
    }

    public destroy() {
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
    
    static createMesh(chunkGeometry: ChunkGeometry): ChunkMesh {
        let meshes: { [x: string]: Mesh } = {};

        Object.entries(chunkGeometry).forEach(([type, geometry]) => {
            const bufferGeometry = new BufferGeometry();

            bufferGeometry.setAttribute('position', new Float32BufferAttribute(geometry.positions, 3));
            bufferGeometry.setAttribute('normal', new Float32BufferAttribute(geometry.normals, 3));
            bufferGeometry.setAttribute('uv', new Float32BufferAttribute(geometry.uvs, 2));
            bufferGeometry.setAttribute('color', new Float32BufferAttribute(geometry.colors, 3));

            meshes[type] = new Mesh(bufferGeometry, Chunk.getMaterials()[type as MaterialName]);
            meshes[type].name = type;
        });

        return meshes as ChunkMesh;
    }
    
    static getMaterials(): ChunkMaterials {
        if (materials) {
            return materials;
        }

        const texture = BlockJS.container.AssetService.get(AssetName.BLOCK_ATLAS);

        texture.flipY = false;
        texture.minFilter = NearestMipMapLinearFilter;
        texture.magFilter = NearestFilter;

        const materialOptions = {
            map: texture,
            vertexColors: true,
        };

        materials = {
            opaque: new MeshBasicMaterial(materialOptions),
            transparent: new MeshBasicMaterial({
                ...materialOptions,
                transparent: true,
                opacity: 1.0,
                side: DoubleSide,
                premultipliedAlpha: true,
                // alphaTest: 0.5,
                // depthWrite: false,
                // depthTest: false,
            }),
        };

        // materials.opaque.wireframe = true;

        return materials;
    }
}