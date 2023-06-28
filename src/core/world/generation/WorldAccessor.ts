import ChunkRepository from '@/core/world/chunk/ChunkRepository';
import StorageAdapter from '@/core/engine/storage/StorageAdapter';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import { BlockMap } from '@/core/world/chunk/Chunk';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import Block from '@/core/world/block/Block';
import { CHUNK_SIZE } from '@/configuration';
import strictModulo from '@/utility/strict-modulo';

export default class WorldAccessor {
    private readonly repository = new ChunkRepository(new StorageAdapter(this.config.uuid));

    private chunkMap: Map<string, BlockMap> = new Map();
    private mainId!: string;

    constructor(
        private readonly config: GeneratorMessagePayload
    ) {

    }

    public getChunkMap() {
        return this.chunkMap;
    }

    public async createMap() {
        const { x, z } = this.config;
        const xInt = parseInt(x);
        const zInt = parseInt(z);

        this.mainId = `${xInt}:${zInt}`;

        const map = new Set([
            this.mainId,
            `${xInt + 1}:${zInt}`,
            `${xInt - 1}:${zInt}`,
            `${xInt}:${zInt + 1}`,
            `${xInt}:${zInt - 1}`,
        ]);

        await Promise.all(Array.from(map.keys()).map(async (chunkId) => {
            const [_x, _z] = chunkId.split(':');

            // @ts-ignore
            const blocks: BlockMap = (await this.repository.read(ChunkUtils.toId(_x, _z)))?.blocks ?? ChunkUtils.getEmptyBlockMap();

            this.chunkMap.set(chunkId, blocks);
        }));
    }

    public getMainChunk() {
        return this.chunkMap.get(this.mainId) as BlockMap;
    }

    public getBlock(x: number, y: number, z: number): Block | undefined {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const blockMap = this.chunkMap.get(ChunkUtils.toId(chunkX, chunkZ));

        if (!blockMap) {
            return undefined;
        }

        return blockMap.get(`${strictModulo(x, CHUNK_SIZE)}:${y}:${strictModulo(z, CHUNK_SIZE)}`);
    }
}