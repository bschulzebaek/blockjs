import FileService from './storage/FileService.ts';
import AssetService from './asset/AssetService.ts';
import World from './world/World.ts';
import type MetaInformation from './storage/MetaInformation.ts';
import type Settings from './storage/Settings.ts';
import Scene from './scene/Scene.ts';
import InputMapper from './input/InputMapper.ts';
import PointerLockHelper from './input/PointerLockHelper.ts';

class BlockJS {
    public static VERSION = '0.0.1';

    public settings: Settings | null = null;
    
    public id: string | null = null;
    public canvas: HTMLCanvasElement | null = null;
    public meta: MetaInformation | null = null;
    public scene: Scene | null = null;
    public world: World | null = null;

    public fs = new FileService();
    public assets = new AssetService();
    public input = new InputMapper();
    public pointerLock = new PointerLockHelper();
}

declare global {
    const BlockJS: BlockJS;
}

// @ts-ignore
window.BlockJS = new BlockJS();