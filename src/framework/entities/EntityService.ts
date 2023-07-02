import Player from '@/components/player/Player';
import PlayerFactory from '@/components/player/PlayerFactory';
import { CHUNK_SIZE } from '@/configuration';
import GlobalState from '@/engine/worker/states/GlobalState';
import Entity from '@/framework/entities/Entity';
import EntityFactory from '@/framework/entities/EntityFactory';
import EntityRepository from '@/framework/entities/EntityRepository';
import { Vector3 } from 'three';

export default class EntityService {
    private readonly repository: EntityRepository;

    private registry = new Map<string, Entity>();

    constructor() {
        this.repository = new EntityRepository(GlobalState.getConfig().getUUID());
    }

    public async setup() {
        const scene = GlobalState.getScene();
        const entities = await this.repository.readAll();

        await Promise.all(entities.map(async (entity) => {
            const _entity = await EntityFactory.fromStorageObject(entity);

            if (!_entity) {
                throw new Error(`Unknown entity of type "${entity.type}"`);
            }

            this.registry.set(entity.id, _entity);
        }));

        if (!this.registry.has('player')) {
            this.registry.set('player', await PlayerFactory.createNew());
        }

        Array.from(this.registry.values()).forEach((entity) => {
            scene.add(entity);
        });
    }

    public async saveAll() {
        const entities = Array.from(this.registry.values());

        await this.repository.writeList(entities);
    }

    public async getLastPlayerChunk() {
        const obj = await this.repository.read('player');

        if (!obj) {
            return new Vector3(0, 0, 0);
        }

        return new Vector3(Math.floor(obj.position.x / CHUNK_SIZE), 0, Math.floor(obj.position.z / CHUNK_SIZE));
    }
}