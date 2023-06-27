import { Vector3 } from 'three';

export default class UpdateGridEvent extends Event {
    static NAME = 'world/update-grid';

    private readonly position: Vector3;

    constructor(
        x: number,
        z: number
    ) {
        super(UpdateGridEvent.NAME);

        this.position = new Vector3(x, 0, z);
    }

    public getPosition = () => this.position;
}