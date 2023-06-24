import { BoxGeometry, Camera, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import World from '@/core/world/World';
import getBlockFromRay from '@/utility/get-block-from-ray';

const geometry = new BoxGeometry(1.001, 1.001, 1.001);
const material = new MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
});
const mesh = new Mesh(geometry, material);

const CURSOR_OFFSET = 0.5;

export default class Cursor extends Object3D {

    constructor(
        private readonly camera: Camera,
        private readonly world: World,
    ) {
        super();

        this.name = 'cursor';
        this.add(mesh);
    }

    public update() {
        const result = getBlockFromRay(
            this.world,
            this.camera,
        );

        if (!result || result.block.getId() < 1) {
            return this.hide();
        }

        this.updatePosition(result.position);
        this.show();
    }

    private updatePosition(position: Vector3) {
        // position.add(new Vector3(CURSOR_OFFSET, CURSOR_OFFSET, CURSOR_OFFSET));

        this.position.copy(position);
    }

    private hide() {
        this.visible = false;
    }

    private show() {
        this.visible = true;
    }
}