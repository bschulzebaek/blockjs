import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import EventHelper from '../../events/EventHelper.ts';
import World from './World.ts';

EventHelper.subscribe(SceneLoadEvent.NAME, async () => {
    BlockJS.world = new World();
    
    await BlockJS.world.init();
}); 