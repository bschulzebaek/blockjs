import SessionLoadEvent from './session/SessionLoadEvent.ts';
import SessionStartEvent from './session/SessionStartEvent.ts';
import ReservedFileNames from '../storage/reserved-file-names.ts';
import { defaultSettings } from '../storage/Settings.ts';

export default class Lifecycle {
    public static initApp = async () => {
        await BlockJS.fs.init()
        const fileContent = await BlockJS.fs.readFile(ReservedFileNames.SETTINGS, undefined, true);
        
        BlockJS.settings = fileContent ? JSON.parse(fileContent) : defaultSettings;
    }
    
    public static initSession = async (id: string, canvas: HTMLCanvasElement) => {
        const fileContent = await BlockJS.fs.readFile(ReservedFileNames.META, id);
        BlockJS.meta = JSON.parse(fileContent);
        BlockJS.canvas = canvas;
        
        const loadEvent = new SessionLoadEvent();
        window.dispatchEvent(loadEvent);

        await Promise.all(loadEvent.tasks);

        window.dispatchEvent(new SessionStartEvent());
    }
    
    public static destroySession = async () => {
        BlockJS.meta = null;
        BlockJS.canvas = null;
    }
}