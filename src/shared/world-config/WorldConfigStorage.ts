import generateUUID from '@/shared/utility/generate-uuid';
import generateSeed from '@/shared/utility/generate-seed';
import WorldConfig from '@/shared/world-config/WorldConfig';

export default class WorldConfigStorage {
    static LS_KEY = 'world-config';

    static async create(name: string, seed: string): Promise<string> {
        const configs: {
            [uuid: string]: WorldConfig
        } = JSON.parse(localStorage.getItem(WorldConfigStorage.LS_KEY) || '{}');
        const uuid = generateUUID();

        configs[uuid] = new WorldConfig(uuid, name, seed);

        localStorage.setItem(WorldConfigStorage.LS_KEY, JSON.stringify(configs));

        return uuid;
    }

    static async get(uuid: string): Promise<WorldConfig> {
        const configs: {
            [uuid: string]: {
                uuid: string,
                name: string,
                seed: string
            }
        } = JSON.parse(localStorage.getItem(WorldConfigStorage.LS_KEY) || '{}');

        const config = configs[uuid] ?? {
            uuid: generateUUID(),
            name: 'New World',
            seed: generateSeed(),
        };

        if (!config) {
            throw new Error('Config not found!');
        }

        return WorldConfig.fromObject(config);
    }

    static async getAll(): Promise<WorldConfig[]> {
        const configs: {
            [uuid: string]: {
                uuid: string,
                name: string,
                seed: string
            }
        } = JSON.parse(localStorage.getItem(WorldConfigStorage.LS_KEY) || '{}');

        return Object.values(configs).map(WorldConfig.fromObject);
    }

    static async delete(uuid: string): Promise<void> {
        const configs: {
            [uuid: string]: {
                uuid: string,
                name: string,
                seed: string
            }
        } = JSON.parse(localStorage.getItem(WorldConfigStorage.LS_KEY) || '{}');

        delete configs[uuid];

        localStorage.setItem(WorldConfigStorage.LS_KEY, JSON.stringify(configs));
    }
}