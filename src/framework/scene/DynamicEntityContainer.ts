import { Group } from 'three';

type DynamicEntity = {
    update?: () => void | Promise<void>;
} & Group;

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