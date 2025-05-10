import EventHelper from '../../events/EventHelper.ts';
import SceneDestroyEvent from '../../events/scene/SceneDestroyEvent.ts';

EventHelper.subscribe(SceneDestroyEvent.NAME, async () => {
    BlockJS.meta = null;
}); 