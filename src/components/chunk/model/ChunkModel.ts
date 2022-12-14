import buildFaces from './build-faces';
import { getFaceFn, getSkipFn} from './add-face-fn';
import Chunk from '../Chunk';
import Model3D from '../../../shared/model/Model3D';
import Mesh from '../../../shared/model/Mesh';
import BlockID from '../../../data/block-id';
import { ChunkFaces } from '../../../data/chunk-faces';
import BlockUV from '../../../data/block-model';
import { ShaderName } from '../../../framework/shader/shader-names';

export enum ChunkModelType {
    SOLID = 'solid',
    GLASS = 'glass',
}

export default class ChunkModel {

    static create(chunk: Chunk, type: ChunkModelType): Model3D {
        const model = new Model3D(
            `${chunk.getId()}-${type}`,
            ChunkModel.buildMesh(
                chunk,
                getFaceFn(type),
                getSkipFn(type),
                [],
                [],
                [],
                [],
                [],
                []
            ),
            `chunk-${type}` as ShaderName,
        );

        // @ts-ignore
        model.position.set(chunk.getBlockX(), 0, chunk.getBlockZ());

        model.update();

        return model;
    }

    static buildMesh(chunk: Chunk, addFaceFn: (blockId: BlockID) => boolean, skipBlockFn: (blockId: BlockID) => boolean, verts: number[], inds: number[], uvs: number[], normals: number[], faces: number[], arrayObject: number[]): Mesh {
        // chunk.getBlocks().forEach(({ id }, position) => {
        //     const [x, y, z] = position.split(':');

        //     if (skipBlockFn(id)) {
        //         return;
        //     }

        //     let xf, yf;

        //     for (let j = 0; j < ChunkFaces.length; j++) {
        //         xf = BlockUV[id][j * 2];
        //         yf = BlockUV[id][j * 2 + 1];

        //         if (addFaceFn(chunk.getFacingBlockId(x, y, z, j))) {
        //             buildFaces(chunk, index, faces, verts, inds, uvs, normals, arrayObject, j, x, y, z, xf, yf);
        //         }
        //     }
        // });

        const size = Chunk.HEIGHT * Chunk.WIDTH * Chunk.LENGTH;

        for (let index = 0; index < size; index++) {

            const x = index % Chunk.WIDTH,
                  z = ((index / Chunk.WIDTH) | 0) % Chunk.LENGTH,
                  y = (index / (Chunk.WIDTH * Chunk.LENGTH)) | 0;

            const blockId = chunk.getBlockId(x, y, z);

            if (skipBlockFn(blockId)) {
                continue;
            }

            let xf, yf;

            for (let j = 0; j < ChunkFaces.length; j++) {
                xf = BlockUV[blockId][j * 2];
                yf = BlockUV[blockId][j * 2 + 1];

                if (addFaceFn(chunk.getFacingBlockId(x, y, z, j))) {
                    buildFaces(chunk, index, faces, verts, inds, uvs, normals, arrayObject, j, x, y, z, xf, yf);
                }
            }
        }

        return new Mesh(inds, verts, normals, uvs, faces, arrayObject);
    }
}