import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import EventHelper from '../../events/EventHelper.ts';

EventHelper.subscribe(SceneLoadEvent.NAME, async () => {
    await BlockJS.assets.preload();
}); 