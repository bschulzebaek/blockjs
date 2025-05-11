import ReservedFileNames from "../storage/reserved-file-names";
import { defaultSettings } from "../storage/Settings";
import { StateMachine as _StateMachine, type StateConfig } from "./StateMachine";

type BlockJSState =
    | 'APP_INIT'
    | 'APP_READY'
    | 'SCENE_INIT'
    | 'SCENE_ACTIVE'
    | 'SCENE_PAUSED'
    | 'SCENE_DESTROY';

const config: StateConfig<BlockJSState> = {
    APP_INIT: {
        transitions: ['APP_READY'],
    },
    APP_READY: {
        transitions: ['SCENE_INIT'],
        onEnter: async () => {
            await BlockJS.container.FileService.init();
            const settings = await BlockJS.container.FileService.readFile(ReservedFileNames.SETTINGS, true);
            BlockJS.settings = settings ? JSON.parse(settings) : defaultSettings;
        },
    },
    SCENE_INIT: {
        transitions: ['SCENE_ACTIVE'],
        onEnter: async () => {
            if (!BlockJS.id || !BlockJS.canvas) { 
                throw new Error('BlockJS.id or BlockJS.canvas is not set!');
            }
            
            const fileContent = await BlockJS.container.FileService.readWorldFile(ReservedFileNames.META);
            BlockJS.meta = JSON.parse(fileContent);

            await Promise.all([
                BlockJS.container.AssetService.init(),
                BlockJS.container.World.init(),
                BlockJS.container.PointerLockHelper.init(),
                BlockJS.container.Skybox.load(),
            ]);

            // BlockJS.worldDataStorage = new WorldDataStorage();
            // await BlockJS.worldDataStorage.init();

            // const playerState = await BlockJS.worldDataStorage.getPlayerData();
         },
    },
    SCENE_ACTIVE: {
        transitions: ['SCENE_PAUSED', 'SCENE_DESTROY'],
        onEnter: async () => {
            BlockJS.container.Scene.start();
            BlockJS.container.InputMapper.start(); 
        },
        onExit: async () => {
            BlockJS.container.InputMapper.stop();
            BlockJS.container.Scene.stop();
        },
    },
    SCENE_PAUSED: {
        transitions: ['SCENE_ACTIVE', 'SCENE_DESTROY'],
    },
    SCENE_DESTROY: {
        transitions: ['APP_READY'],
        onEnter: async () => {
            BlockJS.meta = null;
            BlockJS.canvas = null;
            
            BlockJS.bottle.resetProviders();
        },
    },
};

const stateMachine = new _StateMachine<BlockJSState>('APP_INIT', config);

declare global {
    // @ts-ignore
    const StateMachine: _StateMachine<BlockJSState>;
}

// @ts-ignore
window.StateMachine = stateMachine;