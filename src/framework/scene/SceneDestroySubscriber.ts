import SceneDestroyEvent from '../../events/scene/SceneDestroyEvent.ts';
import EventHelper from '../../events/EventHelper.ts';

EventHelper.subscribe(SceneDestroyEvent.NAME, () => {
    BlockJS.scene?.stop();
    BlockJS.scene = null;
});