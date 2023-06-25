import { BoxGeometry, Camera, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import World from '@/core/world/World';
import BlockRaycaster from '@/core/world/Block/BlockRaycaster';
import BlockId from '@/core/world/Block/BlockId';

const geometry = new BoxGeometry(1.001, 1.001, 1.001);
const material = new MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
});
const mesh = new Mesh(geometry, material);

const CURSOR_OFFSET = new Vector3(0.5, 0.5, 0.5);

const NON_HIGHLIGHTABLE_BLOCKS = [
    BlockId.AIR,
    BlockId.WATER,
    BlockId.FLOWING_WATER,
    BlockId.LAVA,
    BlockId.FLOWING_LAVA,
];

export default class Cursor extends Object3D {
    private readonly raycaster: BlockRaycaster;

    constructor(
        private readonly camera: Camera,
        private readonly world: World,
    ) {
        super();

        this.name = 'cursor';
        this.add(mesh);

        this.raycaster = new BlockRaycaster(world, camera);
    }

    public update() {
        const block = this.raycaster.intersectWorld();

        if (!block || NON_HIGHLIGHTABLE_BLOCKS.includes(block.getId())) {
            return this.hide();
        }

        this.updatePosition(block.getPosition());
        this.show();
    }

    private updatePosition(position: Vector3) {


        this.position.copy(position.clone().add(CURSOR_OFFSET));
    }

    private hide() {
        this.visible = false;
    }

    private show() {
        this.visible = true;
    }
}