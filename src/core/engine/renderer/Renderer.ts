import Scene from '@/core/engine/scene/Scene';
import Camera from '@/core/components/Camera';

export default class Renderer {
    private gl: WebGL2RenderingContext = this.canvas.getContext('webgl2')!;

    constructor(private readonly canvas: OffscreenCanvas) {

    }

    public render(scene: Scene, camera: THREE.Camera) {
        // const { projection, view } = this;
        //
        // // ToDo: Set proj and view uniforms before render loop, not per shader execution!
        // scene.getMeshes().forEach((mesh) => {
        //
        // });
        //
        // groupByShader(this.renderObjects).forEach((ros, shader) => {
        //     this.shaderRegistry.get(shader)!.run(ros, projection, view);
        // });
    }
}