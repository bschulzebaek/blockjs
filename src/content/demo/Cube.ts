import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from "three";
import type { SerializableEntity, EntityState } from "../../framework/scene/SerializableEntity";
import { vector3ToTuple, tupleToVector3 } from "../../lib/VectorUtils";

// Static shared resources
const sharedGeometry = new BoxGeometry(1, 1, 1);
const sharedMaterial = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

export default class Cube extends Object3D implements SerializableEntity {
    public type = 'Cube';
    public persist = false;

    private mesh: Mesh;

    constructor() {
        super();

        // Reuse the shared geometry and material
        this.mesh = new Mesh(sharedGeometry, sharedMaterial);
        this.add(this.mesh);
    }

    public update = () => {
        this.rotation.y += 0.01;
        sharedMaterial.color.set(Math.sin(this.rotation.y), Math.cos(this.rotation.y), 0.5);

        // Randomly move around the origin
        this.position.x += Math.random() * 0.1 - 0.05;
        this.position.y += Math.random() * 0.1 - 0.05;
        this.position.z += Math.random() * 0.1 - 0.05;
    };

    public serialize(): EntityState {
        return {
            id: this.uuid,
            type: this.type,
            position: vector3ToTuple(this.position),
            rotation: [this.rotation.x, this.rotation.y, this.rotation.z],
        };
    }

    public deserialize(state: EntityState): void {
        tupleToVector3(this.position, state.position);
        this.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2], 'XYZ');
    }
}