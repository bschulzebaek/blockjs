import * as THREE from 'three';
import type Scene from './Scene.ts';

export default function demoScene(scene: Scene) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
   
    // @ts-ignore
    cube.update = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    scene.camera.position.set(0, 0, 5);
    scene.dynamicEntities.add(cube);
}