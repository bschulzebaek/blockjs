import CustomTextureLoader from '@/shared/textures/TextureLoader';
import { DoubleSide, MeshBasicMaterial } from 'three';

const texture = CustomTextureLoader.load('/engine/textures.png');

const materialOptions = {
    map: texture,
    vertexColors: true,
};

const materials = {
    opaque: new MeshBasicMaterial(materialOptions),
    transparent: new MeshBasicMaterial({
        ...materialOptions,
        transparent: true,
        opacity: 1.0,
        side: DoubleSide,
    }),
};

export type MaterialName = 'opaque' | 'transparent';

export default materials;