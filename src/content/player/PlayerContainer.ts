import { type Camera, Object3D, Vector3 } from 'three';
import CreativeControls from './CreativeControls.ts';
import { CHUNK, PLACED_BLOCK_ID } from '../../defaults.const.ts';
import type Cursor from './Cursor.ts';
import { BlockIds } from '../../../data/block-ids.ts';
import { ChunkFaces } from '../../../data/chunk-faces.ts';

export default class PlayerContainer extends Object3D {
    public readonly type = 'Player';
    public readonly name = 'Player';

    private chunkPosition = new Vector3(0, 0, 0);

    private readonly controls: CreativeControls;
    private readonly cursor: Cursor;

    constructor(camera: Camera, cursor: Cursor) {
        super();

        this.cursor = cursor;
        this.controls = new CreativeControls(this, camera);

        BlockJS.input.bindLeftClick(this.onLeftClick);
        BlockJS.input.bindRightClick(this.onRightClick);

        camera.position.y = 1.8;
        camera.updateWorldMatrix(true, true);
        
        this.add(camera);

        // this.addDebugGui();
    }

    public onLeftClick = (_: MouseEvent) => {
        if (!this.cursor.visible) {
            return;
        }

        console.log('Player left click at ', this.cursor.position);
        BlockJS.world!.setBlock(this.cursor.position.x, this.cursor.position.y, this.cursor.position.z, BlockIds.AIR);
    }

    public onRightClick = (_: MouseEvent) => {
        if (!this.cursor.visible) {
            return;
        }

        console.log('Player right click at ', this.cursor.position);
        const world = BlockJS.world;
        const position = this.cursor.position;
        const dir = this.cursor.result!.face;
        const target = position.clone();
        
        const n = ChunkFaces[dir].n;
        
        target.x = position.x + n[0];
        target.y = position.y + n[1];
        target.z = position.z + n[2];
        
        world!.setBlock(target.x, target.y, target.z, PLACED_BLOCK_ID);
    }

    public async update() {
        const chunkX = Math.floor(this.position.x / CHUNK.WIDTH);
        const chunkY = Math.floor(this.position.y / CHUNK.HEIGHT);
        const chunkZ = Math.floor(this.position.z / CHUNK.WIDTH);

        if (
            chunkX !== this.chunkPosition.x ||
            chunkZ !== this.chunkPosition.z ||
            chunkY !== this.chunkPosition.y
        ) {
            this.chunkPosition.set(chunkX, chunkY, chunkZ);
            
            // Update world center and trigger chunk loading/unloading
            await BlockJS.world!.updateCenter(this.position);
        }

        this.controls.update();
    }

    // private addDebugGui() {
    //     const gui = window.BlockJS.ServiceContainer.DebugHelper.gui.addFolder('Player');
    //
    //     gui.add(this.position, 'x').name('Position X').listen();
    //     gui.add(this.position, 'y').name('Position Y').listen();
    //     gui.add(this.position, 'z').name('Position Z').listen();
    //
    //     gui.add(this.controls, 'movementSpeedMultiplier').name('Movement Speed').min(0.1).max(10).step(0.1);
    //
    //     gui.add(this.cursor.position, 'x').name('Looking at X').listen();
    //     gui.add(this.cursor.position, 'y').name('Looking at Y').listen();
    //     gui.add(this.cursor.position, 'z').name('Looking at Z').listen();
    //     gui.add(this.cursor, 'block').name('Block ID').listen();
    //     gui.add(this.cursor, 'facing').name('Side').listen();
    //
    //     gui.close();
    // }
}