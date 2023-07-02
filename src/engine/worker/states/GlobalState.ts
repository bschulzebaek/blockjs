import Loop from '@/engine/renderer/Loop';
import CustomScene from '@/engine/scene/CustomScene';
import WorldGenerator from '@/framework/world/generation/WorldGenerator';
import WorldConfig from '@/shared/world-config/WorldConfig';
import Settings from '@/shared/settings/Settings';
import World from '@/framework/world/World';

class GlobalState {
    private settings!: Settings;
    private config!: WorldConfig;
    private scene!: CustomScene;
    private loop!: Loop;
    private world!: World;
    private generator!: WorldGenerator;

    constructor() {
        // @ts-ignore
        globalThis.__state = this;
    }

    public setSettings = (settings: Settings) => this.settings = settings;

    public getSettings = () => this.settings;

    public setConfig = (config: WorldConfig) => this.config = config;

    public getConfig = () => this.config;

    public setScene = (scene: CustomScene) => this.scene = scene;

    public getScene = () => this.scene;

    public setLoop = (loop: Loop) => this.loop = loop;

    public getLoop = () => this.loop;

    public setWorld = (world: World) => this.world = world;

    public getWorld = () => this.world;

    public setGenerator = (generator: WorldGenerator) => this.generator = generator;

    public getGenerator = () => this.generator;
}

export default new GlobalState();