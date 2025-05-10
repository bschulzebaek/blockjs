import EventHelper from '../../events/EventHelper.ts';
import AppInitEvent from '../../events/app/AppInitEvent.ts';
import { defaultSettings } from './Settings.ts';
import ReservedFileNames from './reserved-file-names.ts';

EventHelper.subscribe(AppInitEvent.NAME, async () => {
    await BlockJS.fs.init();
    
    const fileContent = await BlockJS.fs.readFile(ReservedFileNames.SETTINGS, undefined, true);
    BlockJS.settings = fileContent ? JSON.parse(fileContent) : defaultSettings;
}); 