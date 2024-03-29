import { DynamicComponent } from '@/engine/scene/ComponentRegistry';
import {
    BoxGeometry,
    BoxHelper,
    Camera,
    Mesh,
    Vector3,
    Group,
    MeshBasicMaterial,
} from 'three';
import type World from '@/framework/world/World';
import BlockRaycaster from '@/framework/world/block/BlockRaycaster';
import BlockId from '@/framework/world/block/BlockId';

const CURSOR_OFFSET = new Vector3(0.5, 0.5, 0.5);

const NON_HIGHLIGHTABLE_BLOCKS: BlockId[] = [
    BlockId.AIR,
    BlockId.WATER,
    BlockId.FLOWING_WATER,
    BlockId.LAVA,
    BlockId.FLOWING_LAVA,
];

export default class Cursor extends Group implements DynamicComponent {
    private readonly raycaster: BlockRaycaster;

    constructor(
        private readonly camera: Camera,
        private readonly world: World,
    ) {
        super();

        const geometry = new BoxGeometry(1.001, 1.001, 1.001);
        const material = new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.05,
        });
        const mesh = new Mesh(geometry, material);
        const outline =  new BoxHelper(mesh, 0x333333);

        this.name = 'cursor';
        this.add(mesh, outline);

        this.raycaster = new BlockRaycaster(world, camera);
    }

    public update() {
        const result = this.raycaster.intersectWorld();

        if (!result || NON_HIGHLIGHTABLE_BLOCKS.includes(result.block.id)) {
            return this.hide();
        }

        this.updatePosition(new Vector3(result.position.x, result.position.y, result.position.z));
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