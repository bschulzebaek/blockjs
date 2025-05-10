import {
    DoubleSide,
    MeshBasicMaterial,
    NearestFilter,
    NearestMipMapLinearFilter,
} from 'three';
import { AssetName } from '../../asset/AssetService.ts';

type MaterialName = 'opaque' | 'transparent';

type ChunkMaterials = {
    [x in MaterialName]: MeshBasicMaterial;
}

let materials: ChunkMaterials | null = null;

function getMaterials(): ChunkMaterials {
    if (materials) {
        return materials;
    }
    
    const texture = BlockJS.assets.get(AssetName.BLOCK_ATLAS);
    
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

export {
    type MaterialName,
    getMaterials as default,
}