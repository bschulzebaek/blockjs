import { type Camera, Object3D, Vector3 } from 'three';
import { CHUNK } from '../../defaults.const.ts';
import { BlockIds } from '../../../data/block-ids.ts';
import { ChunkFaces } from '../../../data/chunk-faces.ts';
import { PLAYER_CONTROLS } from '../../defaults.const.ts';
import type Controls from './Controls.ts';
import type Cursor from './Cursor.ts';
import { InputAction, type default as InputMapper } from '../../framework/input/InputMapper.ts';
import type World from '../../framework/world/World.ts';
import type { EntityState, SerializableEntity } from '../../framework/scene/SerializableEntity.ts';
import { vector3ToTuple, tupleToVector3 } from '../../lib/VectorUtils.ts';

export default class Player extends Object3D implements SerializableEntity {
    public readonly type = 'Player';
    public readonly isSerializable = true;
    public readonly persist = true;

    private chunkPosition = new Vector3(0, 0, 0);

    public inventory: number[] = [
        BlockIds.STONE,
        BlockIds.GRASS,
        BlockIds.DIRT,
        BlockIds.COBBLESTONE,
        BlockIds.PLANKS,
        BlockIds.BRICK_BLOCK,
        BlockIds.GLASS,
        BlockIds.LOG,
        BlockIds.LEAVES,
        BlockIds.TNT,
    ];

    public selectedSlot = 0;

    private readonly cursor: Cursor;
    private readonly controls: Controls;
    private readonly world: World;
    private readonly camera: Camera;

    constructor(camera: Camera, cursor: Cursor, input: InputMapper, world: World) {
        super();

        this.camera = camera;
        this.controls = new PLAYER_CONTROLS(this, camera);
        this.cursor = cursor;
        this.world = world;

        input.bindLeftClick(this.onLeftClick);
        input.bindRightClick(this.onRightClick);

        input.bindAction(InputAction.HOTBAR_1, () => this.selectSlot(0));
        input.bindAction(InputAction.HOTBAR_2, () => this.selectSlot(1));
        input.bindAction(InputAction.HOTBAR_3, () => this.selectSlot(2));
        input.bindAction(InputAction.HOTBAR_4, () => this.selectSlot(3));
        input.bindAction(InputAction.HOTBAR_5, () => this.selectSlot(4));
        input.bindAction(InputAction.HOTBAR_6, () => this.selectSlot(5));
        input.bindAction(InputAction.HOTBAR_7, () => this.selectSlot(6));
        input.bindAction(InputAction.HOTBAR_8, () => this.selectSlot(7));
        input.bindAction(InputAction.HOTBAR_9, () => this.selectSlot(8));
        input.bindAction(InputAction.HOTBAR_10, () => this.selectSlot(9));

        input.bindWheel(this.onWheel);

        camera.rotation.copy(this.rotation);
        camera.position.y = 1.8;

        camera.updateWorldMatrix(true, true);

        this.add(camera);

        this.updateChunkPosition();
    }

    public serialize(): EntityState {
        return {
            id: this.uuid,
            type: this.type,
            position: vector3ToTuple(this.position),
            rotation: [this.rotation.x, this.rotation.y, this.rotation.z],
            data: {
                cameraPitch: this.camera.rotation.x
            }
        };
    }

    public deserialize(state: EntityState): void {
        tupleToVector3(this.position, state.position);
        this.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2], 'XYZ');

        if (state.data?.cameraPitch) {
            this.camera.rotation.x = state.data.cameraPitch as number;
        }

        this.updateChunkPosition();
    }

    public selectSlot(index: number) {
        this.selectedSlot = index;
    }

    public selectNextSlot() {
        this.selectedSlot = (this.selectedSlot + 1) % this.inventory.length;
    }

    public selectPrevSlot() {
        this.selectedSlot = (this.selectedSlot - 1 + this.inventory.length) % this.inventory.length;
    }

    private onWheel = (event: WheelEvent) => {
        if (event.deltaY > 0) {
            this.selectNextSlot();
        } else if (event.deltaY < 0) {
            this.selectPrevSlot();
        }
    }

    private updateChunkPosition(): void {
        const chunkX = Math.floor(this.position.x / CHUNK.WIDTH);
        const chunkY = Math.floor(this.position.y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(this.position.z / CHUNK.WIDTH);
        this.chunkPosition.set(chunkX, chunkY, chunkZ);
        this.world.updateCenter(this.position);
    }

    public onLeftClick = (_: MouseEvent) => {
        console.debug('[Player] Left click at ', this.cursor.position);

        if (!this.cursor.visible) {
            return;
        }

        void this.world.setBlock(this.cursor.position.x, this.cursor.position.y, this.cursor.position.z, BlockIds.AIR);
    }

    public onRightClick = (_: MouseEvent) => {
        console.debug('[Player] Right click at ', this.cursor.position);

        if (!this.cursor.visible) {
            return;
        }

        const position = this.cursor.position;
        const dir = this.cursor.result!.face;
        const target = position.clone();

        const n = ChunkFaces[dir].n;

        target.x = position.x + n[0];
        target.y = position.y + n[1];
        target.z = position.z + n[2];

        this.world.setBlock(target.x, target.y, target.z, this.inventory[this.selectedSlot]);
    }

    public update() {
        this.controls.update();

        const chunkX = Math.floor(this.position.x / CHUNK.WIDTH);
        const chunkY = Math.floor(this.position.y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(this.position.z / CHUNK.WIDTH);

        const chunkChanged =
            chunkX !== this.chunkPosition.x ||
            chunkZ !== this.chunkPosition.z ||
            chunkY !== this.chunkPosition.y;

        if (chunkChanged) {
            this.chunkPosition.set(chunkX, chunkY, chunkZ);
            this.world.updateCenter(this.position);
        }
    }
}