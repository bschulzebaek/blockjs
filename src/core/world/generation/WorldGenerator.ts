import Chunk from '@/core/world/Chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import WorkerContext from '@/core/engine/WorkerContext';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';
import createChunkMap from '@/core/world/create-chunk-map';
import { RENDER_DISTANCE } from '@/settings';

export default class WorldGenerator {
    private worker: Worker;
    private queue: Map<string, Function> = new Map();
    private seed = WorkerContext.config!.getSeed();

    constructor() {
        this.worker = new Worker(new URL('./worker/generation-worker.ts', import.meta.url));
        this.worker.onmessage = this.receiveChunk.bind(this);
    }

    public createMap() {
        return createChunkMap(RENDER_DISTANCE, 0, 0);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        return new Promise((resolve) => {
            this.queue.set(`${x}:${z}`, resolve);

            this.worker.postMessage({
                x,
                z,
                seed: this.seed,
            });
        });
    }

    private receiveChunk(event: MessageEvent<ChunkPayload>) {
        const chunk = ChunkFactory.createFromPayload(event.data);
        const callback = this.queue.get(chunk.getId());

        if (!callback) {
            console.debug(event.data);
            throw new Error('Unknown chunk received');
        }

        callback(chunk);
    }
}