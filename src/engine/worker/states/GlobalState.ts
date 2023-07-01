import CustomRenderer from '@/engine/renderer/CustomRenderer';
import Loop from '@/engine/renderer/Loop';
import CustomScene from '@/engine/scene/CustomScene';
import WorldConfig from '@/shared/world-config/WorldConfig';
import Settings from '@/shared/settings/Settings';
import World from '@/world/World';

class GlobalState {
    private settings!: Settings;
    private config!: WorldConfig;
    private renderer!: CustomRenderer;
    private scene!: CustomScene;
    private loop!: Loop;
    private world!: World;

    constructor() {
        // @ts-ignore
        globalThis.__state = this;
    }

    public setSettings = (settings: Settings) => this.settings = settings;

    public getSettings = () => this.settings;

    public setConfig = (config: WorldConfig) => this.config = config;

    public getConfig = () => this.config;

    public setRenderer = (renderer: CustomRenderer) => this.renderer = renderer;

    public getRenderer = () => this.renderer;

    public setScene = (scene: CustomScene) => this.scene = scene;

    public getScene = () => this.scene;

    public setLoop = (loop: Loop) => this.loop = loop;

    public getLoop = () => this.loop;

    public setWorld = (world: World) => this.world = world;

    public getWorld = () => this.world
}

export default new GlobalState();