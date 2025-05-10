import * as THREE from 'three';
import EventHelper from '../events/EventHelper.ts';
import SceneCollectEvent from '../events/scene/SceneCollectEvent.ts';
import PlayerContainer from './player/PlayerContainer.ts';
import Cursor from './player/Cursor.ts';

// Adding demo content to the scene
EventHelper.subscribe(SceneCollectEvent.NAME, async () => {
    const scene = BlockJS.scene!;
    const cursor = new Cursor();
    const player = new PlayerContainer(scene.camera, cursor);
    player.position.set(4, 16, 8);

    const direction = new THREE.Vector3();
    scene.camera.getWorldDirection(direction);
    direction.multiplyScalar(3);

    scene.dynamicEntities.add(player, cursor);
});
