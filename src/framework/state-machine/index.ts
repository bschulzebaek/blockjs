import { useSessionState } from "../../interface/composables/useSessionState";
import ReservedFileNames from "../storage/reserved-file-names";
import { defaultSettings } from "../storage/Settings";
import { StateMachine as _StateMachine, type StateConfig } from "./StateMachine";

const { setState } = useSessionState();

export const STATES = {
    APP_INIT: 'APP_INIT' as const,
    APP_READY: 'APP_READY' as const,
    SCENE_INIT: 'SCENE_INIT' as const,
    SCENE_LOADING: 'SCENE_INIT' as const,
    SCENE_ACTIVE: 'SCENE_ACTIVE' as const,
    SCENE_PAUSED: 'SCENE_PAUSED' as const,
    SCENE_DESTROY: 'SCENE_DESTROY' as const,
} as const;

export type BlockJSState =
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
        transitions: ['SCENE_ACTIVE', 'SCENE_PAUSED'],
        onEnter: async () => {
            if (!BlockJS.id || !BlockJS.canvas) { 
                throw new Error('BlockJS.id or BlockJS.canvas is not set!');
            }

            setState(STATES.SCENE_INIT);
            
            BlockJS.container.FileService.setWorldId(BlockJS.id);

            const fileContent = await BlockJS.container.FileService.readWorldFile(ReservedFileNames.META);
            BlockJS.meta = JSON.parse(fileContent);

            await BlockJS.container.EntityManager.loadEntities();

            BlockJS.container.World.updateCenter(BlockJS.container.Player.position);

            await Promise.all([
                BlockJS.container.World.init(),
                BlockJS.container.AssetService.init(),
                BlockJS.container.PointerLockHelper.init(),
                BlockJS.container.Skybox.load(),
            ]);

            BlockJS.container.Scene.frame();
         },
    },
    SCENE_ACTIVE: {
        transitions: ['SCENE_PAUSED', 'SCENE_DESTROY'],
        onEnter: async () => {
            await BlockJS.container.PointerLockHelper.lock();

            BlockJS.container.Scene.start();
            BlockJS.container.InputMapper.start(); 

            setState(STATES.SCENE_ACTIVE);
        },
        onExit: async () => {
            BlockJS.container.InputMapper.stop();
            BlockJS.container.Scene.stop();
            await BlockJS.container.EntityManager.saveEntities();
        },
    },
    SCENE_PAUSED: {
        transitions: ['SCENE_ACTIVE', 'SCENE_DESTROY'],
        onEnter: async () => {
            setState(STATES.SCENE_PAUSED);
        },
    },
    SCENE_DESTROY: {
        transitions: ['APP_READY'],
        onEnter: async () => {
            BlockJS.id = null;
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