import World from '@/core/world/World';
import WorldGenerator from '@/core/world/generation/WorldGenerator';
import postGenerationProgress from '@/core/messages/out/post-generation-progress';

class WorldService {
    private generator!: WorldGenerator;
    private world!: World;

    constructor() {

    }

    public getWorld() {
        if (!this.world) {
            throw new Error('World not initialized');
        }

        return this.world;
    }

    public async setupWorld(uuid: string, seed: string) {
        const start = performance.now();
        const map = WorldGenerator.createMap();

        this.generator = new WorldGenerator(seed, uuid);
        this.world = new World(map); // Todo: Provide current Player Chunk as offset

        await this.loadPendingChunks();

        console.debug(`[World generated in ${((performance.now() - start) / 1000).toFixed(3)}s`);
        console.debug(this.world.getStats());
    }


    public async loadPendingChunks() {
        await Promise.all(Array.from(this.world.getPendingChunks().keys()).map(this.loadChunk));
    }

    public loadChunk = async (chunkId: string) => {
        const [x, z] = chunkId.split(':');
        const chunk = await this.generator.generateChunk(x, z);
        const pendingChunks = this.world.getPendingChunks();

        /**
         * Ignore this Chunk if multiple Promises are pending (e.g. Player is moving fast and triggers multiple GridUpdate events)
         */
        if (!pendingChunks.has(chunk.getChunkId())) {
            return;
        }

        this.world.add(chunk);

        this.postProgress();
    }

    public unloadChunks(chunkIds: string[]) {
        const chunks = this.world.getChunks();

        chunkIds.forEach((chunkId) => {
            const chunk = chunks.get(chunkId);

            if (!chunk) {
                return;
            }

            this.world.remove(chunk);
        });
    }

    private postProgress() {
        const pending = this.world.getPendingChunks();
        const ready = this.world.getChunks();

        postGenerationProgress({
            total: pending.size + ready.size,
            ready: ready.size,
        });
    }
}

export default new WorldService();