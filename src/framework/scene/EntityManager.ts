import type FileService from "../storage/FileService";
import type Scene from "./Scene";
import type { EntityState, SerializableEntity } from "./SerializableEntity";
import { v4 as uuidv4 } from 'uuid';

export default class EntityManager {
    static FILE_NAME = 'entities.json';

    private scene: Scene;
    private fileService: FileService;

    constructor(scene: Scene, fileService: FileService) {
        this.scene = scene;
        this.fileService = fileService;
    }

    public async loadEntities() {
        let entities: EntityState[] = [];

        try {
            const fileContent = await this.fileService.readWorldFile(EntityManager.FILE_NAME);
            entities = JSON.parse(fileContent);
        } catch (e) {
            entities = this.getDefaultEntityStates();
        } finally {
            entities.forEach((entityState: EntityState) => {
                this.addToScene(entityState);
            });
        }
    }

    private addToScene(state: EntityState) {
        const containerEntry = BlockJS.container[state.type];

        const instance = containerEntry.instance ? containerEntry.instance() : containerEntry;

        instance.deserialize(state);
        this.scene.addDynamicEntity(instance);
    }

    public async saveEntities() {
        const entities = this.getSerializableEntities();
        const entityStates = entities.map((entity) => entity.serialize());

        await this.fileService.writeFile(EntityManager.FILE_NAME, JSON.stringify(entityStates), BlockJS.getWorldId());
    }

    public getSerializableEntities(): SerializableEntity[] {
        const entities = this.scene.getObjectsByProperty('persist', true);

        // @ts-ignore
        return (entities.filter((entity) => entity.serialize) as unknown as SerializableEntity[]);
    }

    private getDefaultEntityStates(): EntityState[] {
        let entities: EntityState[] = [{
            id: 'player',
            type: 'Player',
            position: [0, 20, 0],
            rotation: [0, 0, 0],
        }];

        for (let i = 0; i < 10; i++) {
            entities.push({
                id: uuidv4(),
                type: 'FollowCube',
                position: [Math.random() * 100, 20, Math.random() * 100],
                rotation: [0, 0, 0],
            });
        }
        return entities;
    }
}
