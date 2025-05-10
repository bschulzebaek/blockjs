import SceneStartEvent from '../../events/scene/SceneStartEvent.ts';
import EventHelper from '../../events/EventHelper.ts';

EventHelper.subscribe(SceneStartEvent.NAME, () => {
    BlockJS.scene?.start();
});
    
    
