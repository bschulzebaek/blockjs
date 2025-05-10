import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import EventHelper from '../../events/EventHelper.ts';
import ReservedFileNames from './reserved-file-names.ts';

EventHelper.subscribe(SceneLoadEvent.NAME, async () => {
    const fileContent = await BlockJS.fs.readFile(ReservedFileNames.META, BlockJS.id!);
    BlockJS.meta = JSON.parse(fileContent);
}); 