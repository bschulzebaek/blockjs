import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import EventHelper from '../../events/EventHelper.ts';
import Scene from './Scene.ts';

EventHelper.subscribe(SceneLoadEvent.NAME, async () => {
    BlockJS.scene = new Scene();
}); 