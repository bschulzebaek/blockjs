import { CubeTexture, CubeTextureLoader, Scene } from 'three';

export default class Skybox {
    private texture = new CubeTexture();

    constructor(scene: Scene) {
        scene.background = this.texture;
    }

    public async load(): Promise<void> {
        const loader = new CubeTextureLoader();
        loader.setPath('/assets/skybox/');

        this.texture.copy(await loader.loadAsync([
            'right.png',  // x
            'left.png',   // -x
            'top.png',    // y
            'bottom.png', // -y
            'front.png',  // z
            'back.png'    // -z
        ]));
    }
} 