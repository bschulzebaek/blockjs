import { Camera, Object3D } from 'three';
import ComponentRegistry from '@/core/engine/scene/ComponentRegistry';

export default class CustomScene extends Object3D {
    private readonly components = new ComponentRegistry();
    private _mainCamera!: Camera;

    constructor() {
        super();
    }

    public update(delta: number) {
        this.components.iterateDynamic((component) => {
            component.update(delta);
        });
    }

    public getComponents() {
        return this.components;
    }

    public setMainCamera(camera: Camera) {
        this._mainCamera = camera;
    }

    public getMainCamera() {
        return this._mainCamera;
    }
}