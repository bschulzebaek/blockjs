import { Scene as ThreeScene, WebGLRenderer, Object3D, PerspectiveCamera } from 'three';
import DynamicEntityContainer from './DynamicEntityContainer.ts';

export default class Scene extends ThreeScene {
    public camera: PerspectiveCamera;

    private readonly renderer = new WebGLRenderer({
        canvas: BlockJS.canvas as HTMLCanvasElement,
        antialias: true,
    });
    private readonly dynamicEntities = new DynamicEntityContainer();
    
    constructor(camera: PerspectiveCamera) {
        super();

        const { clientWidth, clientHeight } = BlockJS.canvas as HTMLCanvasElement;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();

        this.camera = camera;
        
        this.renderer.setSize(clientWidth, clientHeight);
        this.add(this.dynamicEntities);
    }

    public addDynamicEntity = (entity: Object3D) => {
        this.dynamicEntities.add(entity);
    }

    public start = async () => {
        this.renderer.setAnimationLoop(this.renderLoop);
    }

    public stop = async () => {
        this.renderer.setAnimationLoop(null);
    }

    private renderLoop = () => {
        this.dynamicEntities.update();
        this.renderer.render(this, this.camera);
    }
    
    public frame() {
        this.renderer.render(this, this.camera);
    }
}