import * as THREE from 'three';
import EventHelper from '../events/EventHelper.ts';
import SceneCollectEvent from '../events/scene/SceneCollectEvent.ts';
import PlayerContainer from './player/PlayerContainer.ts';
import Cursor from './player/Cursor.ts';

// Adding demo content to the scene
EventHelper.subscribe(SceneCollectEvent.NAME, async () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // @ts-ignore
    cube.update = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    };

    const scene = BlockJS.scene!;
    const cursor = new Cursor();
    const player = new PlayerContainer(scene.camera, cursor);
    player.position.set(4, 16, 8);

    const direction = new THREE.Vector3();
    scene.camera.getWorldDirection(direction);
    direction.multiplyScalar(3);
    cube.position.copy(player.position).add(direction);

    scene.dynamicEntities.add(player, cube, cursor);
});
