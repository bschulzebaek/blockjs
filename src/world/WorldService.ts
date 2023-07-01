import GlobalState from '@/engine/worker/states/GlobalState';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';
import World from '@/world/World';
import WorldGenerator from '@/world/generation/WorldGenerator';
import postGenerationProgress from '@/engine/worker/out/post-generation-progress';

export default class WorldService {
    private generator!: WorldGenerator;
    private world!: World;

    public async setup() {
        const start = performance.now();
        const centerChunk = await ServiceRegistry.getEntityService().getLastPlayerChunk();
        const map = WorldGenerator.createMap(centerChunk.x, centerChunk.z);

        this.generator = new WorldGenerator();
        this.world = GlobalState.getWorld(); // Todo: Provide current Player Chunk as offset

        this.world.setPendingChunks(map);

        await this.loadPendingChunks();

        console.debug(`[World] generated in ${((performance.now() - start) / 1000).toFixed(3)}s`);
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
         * Ignore this Chunk if multiple Promises were pending (e.g. Player is moving fast and triggers multiple GridUpdate events)
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

    public invalidate(id: string) {
        this.generator.invalidate(id);
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