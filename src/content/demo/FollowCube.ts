import { Vector3, MeshBasicMaterial, Mesh, BoxGeometry, Object3D, Color } from "three";
import Cube from "./Cube";
import type { EntityState, SerializableEntity } from "../../framework/scene/SerializableEntity";
import { tupleToVector3, vector3ToTuple } from "../../lib/VectorUtils";

type FollowCubeData = {
    [key: string]: unknown;
    baseColor: number;
    currentColor: number;
}

export default class FollowCube extends Cube implements SerializableEntity {
    public type = 'FollowCube';
    public persist = true;

    private readonly followSpeed = 0.05;
    private readonly maxDistance = 20;
    private readonly minDistance = 3;

    private readonly tempVec = new Vector3();
    private readonly material: MeshBasicMaterial;
    private readonly baseColor: Color;

    private readonly followObject: Object3D;

    constructor(followObject: Object3D) {
        super();

        this.followObject = followObject;

        this.baseColor = new Color(Math.random() * 0xffffff);
        this.material = new MeshBasicMaterial({ color: this.baseColor, wireframe: false });
        
        const mesh = new Mesh(new BoxGeometry(1, 1, 1), this.material);
        this.clear();
        this.add(mesh);
    }

    public update = () => {
        this.tempVec.copy(this.followObject.position);

        const distance = this.position.distanceTo(this.tempVec);

        if (distance > this.minDistance && distance < this.maxDistance) {
            this.tempVec.sub(this.position).normalize().multiplyScalar(this.followSpeed);
            this.position.add(this.tempVec);
        }

        this.rotation.y += 0.01;

        const t = this.rotation.y;
        this.material.color.setRGB(
            this.baseColor.r * (0.7 + 0.3 * Math.sin(t)),
            this.baseColor.g * (0.7 + 0.3 * Math.cos(t)),
            this.baseColor.b * (0.7 + 0.3 * Math.sin(t + Math.PI/3))
        );
    };

    public serialize(): EntityState {
        return {
            id: this.uuid,
            type: this.type,
            position: vector3ToTuple(this.position),
            rotation: [this.rotation.x, this.rotation.y, this.rotation.z],
            data: {
                baseColor: this.baseColor.getHex(),
                currentColor: this.material.color.getHex(),
            } as FollowCubeData,
        };
    }

    public deserialize(state: EntityState): void {
        tupleToVector3(this.position, state.position);
        this.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2], 'XYZ');

        const data = state.data as FollowCubeData | undefined;
        const baseColor = data?.baseColor ?? 0x00ff00;
        const currentColor = data?.currentColor ?? baseColor;
        
        this.baseColor.setHex(baseColor);
        this.material.color.setHex(currentColor);
    }
} 