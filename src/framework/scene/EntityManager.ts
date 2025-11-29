import type FileService from "../storage/FileService";
import type Scene from "./Scene";
import type { EntityState, SerializableEntity } from "./SerializableEntity";
// import { v4 as uuidv4 } from 'uuid';

export default class EntityManager {
    static FILE_NAME = 'entities';

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
            const decompressedContent = await this.decompressData(fileContent);
            entities = JSON.parse(decompressedContent);
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
        const jsonData = JSON.stringify(entityStates);
        const compressedData = await this.compressData(jsonData);

        await this.fileService.writeFile(EntityManager.FILE_NAME, compressedData, BlockJS.getWorldId());
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

        // for (let i = 0; i < 10; i++) {
        //     entities.push({
        //         id: uuidv4(),
        //         type: 'FollowCube',
        //         position: [Math.random() * 100, 20, Math.random() * 100],
        //         rotation: [0, 0, 0],
        //         data: {
        //             baseColor: Math.random() * 0xffffff,
        //             currentColor: Math.random() * 0xffffff,
        //         },
        //     });
        // }
        
        return entities;
    }

    private async compressData(data: string): Promise<string> {
        const compressed = new CompressionStream('gzip');
        const writer = compressed.writable.getWriter();
        const chunks: Uint8Array[] = [];
        
        writer.write(new TextEncoder().encode(data));
        writer.close();

        const reader = compressed.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return btoa(String.fromCharCode(...result));
    }

    private async decompressData(base64: string): Promise<string> {
        const compressed = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const decompressed = new DecompressionStream('gzip');
        const writer = decompressed.writable.getWriter();
        const chunks: Uint8Array[] = [];

        writer.write(compressed);
        writer.close();

        const reader = decompressed.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(result);
    }
}
