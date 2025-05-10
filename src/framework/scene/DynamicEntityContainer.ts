import { Group, Object3D } from 'three';

type DynamicEntity = Object3D & {
    update: () => void | Promise<void>;
}

export default class DynamicEntityContainer extends Group {
    public readonly type = 'DynamicEntityContainer';
    public readonly name = 'DynamicEntityContainer';
    public children: DynamicEntity[] = [];

    public async update() {
        const promises: Promise<void>[] = [];
        
        this.children.forEach((entity) => {
            if (typeof entity.update === 'function') {
                promises.push(Promise.resolve(entity.update()));
            }
        });
        
        await Promise.all(promises);
    }
}