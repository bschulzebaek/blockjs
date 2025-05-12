import { Vector3, MeshBasicMaterial, Mesh, BoxGeometry, Object3D, Color } from "three";
import Cube from "./Cube";

export default class FollowCube extends Cube {
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
} 