import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import World from '@/core/world/World';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default async function initScene(canvas: HTMLCanvasElement, config: WorldConfig): Promise<void> {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);

    const world = new World(config.getSeed());
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    world.getChunks().forEach((chunk) => {
        if (!chunk) {
            return;
        }

        chunk.iterateBlocks((x, y, z, block) => {
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                wireframe: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x + 0.5, y + 0.5, z + 0.5);

            scene.add(mesh);
        });
    });

    scene.background = new THREE.Color(0xb0ddf9);
    scene.add(new THREE.AmbientLight());
    scene.add(new THREE.AxesHelper(256));

    camera.position.set(-4, 8, -4);
    camera.lookAt(16, 0, 16);

    function animation(time: number) {
        renderer.render(scene, camera);
        controls.update();
    }
}