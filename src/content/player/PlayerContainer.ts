import { type Camera, Object3D, Vector3 } from 'three';
import { CHUNK, PLACED_BLOCK_ID } from '../../defaults.const.ts';
import { BlockIds } from '../../../data/block-ids.ts';
import { ChunkFaces } from '../../../data/chunk-faces.ts';
import { PLAYER_CONTROLS } from '../../defaults.const.ts';
import type Controls from './Controls.ts';
import type Cursor from './Cursor.ts';
import type InputMapper from '../../framework/input/InputMapper.ts';
import type World from '../../framework/world/World.ts';

export default class PlayerContainer extends Object3D {
    public readonly type = 'player';

    private chunkPosition = new Vector3(0, 0, 0);
    
    private readonly cursor: Cursor;
    private readonly controls: Controls;
    private readonly world: World;

    constructor(camera: Camera, cursor: Cursor, input: InputMapper, world: World) {
        super();

        this.controls = new PLAYER_CONTROLS(this, camera);
        this.cursor = cursor;
        this.world = world;

        input.bindLeftClick(this.onLeftClick);
        input.bindRightClick(this.onRightClick);

        camera.rotation.copy(this.rotation);
        camera.position.y = 1.8;
        
        camera.updateWorldMatrix(true, true);
        
        this.add(camera);
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
        
        this.world.setBlock(target.x, target.y, target.z, PLACED_BLOCK_ID);
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