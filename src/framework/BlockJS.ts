import FileService from './storage/FileService.ts';
import AssetService from './asset/AssetService.ts';
import WorldService from './world/WorldService.ts';
import type MetaInformation from './storage/MetaInformation.ts';
import type Settings from './storage/Settings.ts';
import Scene from './scene/Scene.ts';

class BlockJS {
    public static VERSION = '0.0.1';

    public canvas: HTMLCanvasElement | null = null;
    public settings: Settings | null = null;
    public meta: MetaInformation | null = null;
    public scene: Scene | null = null;
    
    public fs = new FileService();
    public assets = new AssetService();
    public world = new WorldService();
}

declare global {
    const BlockJS: BlockJS;
}

// @ts-ignore
window.BlockJS = new BlockJS();