import { Scene as ThreeScene, WebGLRenderer, PerspectiveCamera } from 'three';
import DynamicEntityContainer from './DynamicEntityContainer.ts';

export default class Scene extends ThreeScene {
    public dynamicEntities: DynamicEntityContainer; 
    public camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
    public renderer = new WebGLRenderer({
        canvas: BlockJS.canvas as HTMLCanvasElement,
        antialias: true,
    });
    
    constructor() {
        super();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.dynamicEntities = new DynamicEntityContainer();
        this.add(this.dynamicEntities);
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