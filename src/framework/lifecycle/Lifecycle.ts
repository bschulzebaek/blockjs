import AppInitEvent from './app/AppInitEvent.ts';
import SessionLoadEvent from './session/SessionLoadEvent.ts';
import SessionStartEvent from './session/SessionStartEvent.ts';
import SessionDestroyEvent from './session/SessionDestroyEvent.ts';
import SessionStopEvent from './session/SessionStopEvent.ts';
import ReservedFileNames from '../storage/reserved-file-names.ts';
import { defaultSettings } from '../storage/Settings.ts';

export default class Lifecycle {
    public static initApp = async () => {
        console.debug('[Lifecycle] initApp');
        
        const event = new AppInitEvent();
        window.dispatchEvent(event);
        await Promise.all(event.tasks);

        const fileContent = await BlockJS.fs.readFile(ReservedFileNames.SETTINGS, undefined, true);
        BlockJS.settings = fileContent ? JSON.parse(fileContent) : defaultSettings;
    }
    
    public static initSession = async (id: string, canvas: HTMLCanvasElement) => {
        console.debug('[Lifecycle] initSession');
        
        const fileContent = await BlockJS.fs.readFile(ReservedFileNames.META, id);
        BlockJS.meta = JSON.parse(fileContent);
        BlockJS.canvas = canvas;
        
        const loadEvent = new SessionLoadEvent();
        window.dispatchEvent(loadEvent);
        await Promise.all(loadEvent.tasks);
    }

    public static startSession = async () => {
        console.debug('[Lifecycle] startSession');
        window.dispatchEvent(new SessionStartEvent());
    }
    
    public static stopSession = async () => {
        console.debug('[Lifecycle] stopSession');
        window.dispatchEvent(new SessionStopEvent());
    }
    
    public static destroySession = async () => {
        console.debug('[Lifecycle] destroySession');
        window.dispatchEvent(new SessionDestroyEvent());
        
        BlockJS.meta = null;
        BlockJS.canvas = null;
    }
}