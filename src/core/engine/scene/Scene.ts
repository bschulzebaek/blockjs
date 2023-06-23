import SceneComponentInterface from '@/core/engine/scene/SceneComponentInterface';

export default class Scene {
    private components: Map<string, SceneComponentInterface> = new Map();
    private updates: Map<string, (delta: number) => void> = new Map();
    private meshGroups: Map<string, any[]> = new Map();

    constructor() {

    }

    public update(delta: number) {
        this.updates.forEach(updateFn => updateFn(delta));
    }

    public getMeshes() {
        return this.meshGroups;
    }

    public addComponent(...components: SceneComponentInterface[]) {
        components.forEach((component) => {
            this.components.set(component.getName(), component);

            if (component.update) {
                this.updates.set(component.getName(), component.update);
            }

            if (component.getMesh) {
                const mesh = component.getMesh();

                // todo: group meshes by shader
                this.meshGroups.set(mesh.getShader(), mesh);
            }
        });
    }

    public removeComponent(...components: SceneComponentInterface[]) {
        components.forEach((component) => {
            this.components.delete(component.getName());
            this.updates.delete(component.getName());
            // this.meshGroups.delete(component.getName());
        });
    }
}