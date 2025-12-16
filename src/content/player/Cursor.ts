import { type BlockId, BlockIds } from '../../../data/block-ids.ts';
import { BoxGeometry, BoxHelper, Mesh, MeshStandardMaterial, Object3D } from 'three';
import BlockRaycaster, { type RaycastResult } from '../../framework/world/BlockRaycaster.ts';

const NON_HIGHLIGHTABLE_BLOCKS: number[] = [
    BlockIds.AIR,
    BlockIds.WATER,
    BlockIds.FLOWING_WATER,
    BlockIds.LAVA,
    BlockIds.FLOWING_LAVA,
];

const faceNames = {
    '-1': 'None',
    0: 'North',
    1: 'East',
    2: 'South',
    3: 'West',
    4: 'Up',
    5: 'Down',
}

export default class Cursor extends Object3D {
    public readonly type = 'cursor';

    public visible = false;
    public result: RaycastResult | null = null;

    public block: BlockId = BlockIds.AIR;
    public facing = faceNames['-1'];

    private raycaster: BlockRaycaster;

    constructor(raycaster: BlockRaycaster) {
        super();

        this.raycaster = raycaster;

        const geometry = new BoxGeometry(1.001, 1.001, 1.001);
        const material = new MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
            depthTest: true,
        });
        const mesh = new Mesh(geometry, material);
        const outline = new BoxHelper(mesh, 0x333333);

        this.add(mesh, outline);
    }

    public async update() {
        this.result = await this.raycaster.intersectWorld();

        if (!this.result || NON_HIGHLIGHTABLE_BLOCKS.includes(this.result.block)) {
            this.visible = false;
            this.block = BlockIds.AIR;
            this.facing = faceNames['-1'];
            return;
        }

        this.position.copy(this.result.position.clone());
        this.visible = true;

        // @ts-ignore
        this.facing = faceNames[this.result.face];
        this.block = this.result.block;
    }
}
