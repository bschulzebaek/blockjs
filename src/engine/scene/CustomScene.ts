import Player from '@/components/player/Player';
import World from '@/world/World';
import { Camera, Object3D } from 'three';
import ComponentRegistry, { DynamicComponent, StaticComponent } from '@/engine/scene/ComponentRegistry';

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

    public add(...object: Object3D[]): this {
        super.add(...object);

        object.forEach((obj) => {
            // @ts-ignore
            if (obj.update) {
                this.components.addDynamic(obj as unknown as DynamicComponent);
            } else {
                this.components.addStatic(obj as unknown as StaticComponent);
            }
        });

        return this;
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

    public getWorld() {
        const world = this.getObjectByName('world');

        if (!world) {
            throw new Error('World not found!');
        }

        return world as World;
    }

    public getPlayer() {
        const player = this.getObjectByName('player');

        if (!player) {
            throw new Error('Player not found!');
        }

        return player as Player;
    }
}