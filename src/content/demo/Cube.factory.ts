import * as THREE from 'three';

export default function CubeFactory() {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    
    // @ts-ignore
    cube.update = () => {
        cube.rotation.y += 0.01;
    };

    return cube;
}