import EventHelper from '../../events/EventHelper.ts';
import SceneCollectEvent from '../../events/scene/SceneCollectEvent.ts';


EventHelper.subscribe(SceneCollectEvent.NAME, async () => {
    await BlockJS.world?.hydrate();
    BlockJS.scene!.add(BlockJS.world!);
});