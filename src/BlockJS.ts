import type MetaInformation from './framework/storage/MetaInformation.ts';
import type Settings from './framework/storage/Settings.ts';

import bottle from './container';

class BlockJS {
    public bottle = bottle;
    public container = bottle.container;

    public settings: Settings | null = null;
    
    public id: string | null = null;
    public canvas: HTMLCanvasElement | null = null;
    public meta: MetaInformation | null = null;
    
    public getWorldId() {
        if (!this.id) {
            throw new Error('BlockJS.id is not set');
        }
        
        return this.id;
    }
    
    public getByName(name: string) {
        return this.container.Scene.getObjectByName(name);
    }
    
    public getByType(type: string) {
        return this.container.Scene.getObjectsByProperty('type', type);
    }
    
}

declare global {
    const BlockJS: BlockJS;
}

// @ts-ignore
window.BlockJS = new BlockJS();