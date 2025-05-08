import { Group, Object3D } from 'three';

type DynamicEntity = Object3D & {
    update: () => void;
}

export default class DynamicEntityContainer extends Group {
    public children: DynamicEntity[] = [];
    
    public update = () => {
        this.children.forEach(entity => entity.update());
    }
}