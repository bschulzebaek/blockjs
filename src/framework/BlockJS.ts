import FileService from './storage/FileService.ts';
import AssetService from './asset/AssetService.ts';
import WorldService from './world/WorldService.ts';
import SceneManager from './scene/SceneManager.ts';
import type MetaInformation from './storage/MetaInformation.ts';
import type Settings from './storage/Settings.ts';

class BlockJS {
    public static VERSION = '0.0.1';

    public canvas: HTMLCanvasElement | null = null;
    public settings: Settings | null = null;
    public meta: MetaInformation | null = null;
    
    public fs = new FileService();
    public assets = new AssetService();
    public world = new WorldService();
    public sceneManager = new SceneManager();
}

declare global {
    const BlockJS: BlockJS;
}

// @ts-ignore
window.BlockJS = new BlockJS();