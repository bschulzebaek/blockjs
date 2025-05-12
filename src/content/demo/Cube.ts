import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from "three";

const sharedGeometry = new BoxGeometry(1, 1, 1);
const sharedMaterial = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

export default class Cube extends Object3D {
    public type = 'Cube';
    private mesh: Mesh;

    constructor() {
        super();

        this.mesh = new Mesh(sharedGeometry, sharedMaterial);
        this.add(this.mesh);
    }

    public update = () => {
        this.rotation.y += 0.01;
    };

}