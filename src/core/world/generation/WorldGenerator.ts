import Chunk from '@/core/world/Chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import WorkerContext from '@/core/engine/WorkerContext';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';
import createChunkMap from '@/core/world/create-chunk-map';
import { RENDER_DISTANCE } from '@/settings';
import { MAX_CHUNK_CACHE } from '@/configuration';

const _cache = new Map<string, Chunk>();

export default class WorldGenerator {
    private worker: Worker;
    private queue: Map<string, Function> = new Map();
    private seed = WorkerContext.config!.getSeed();

    constructor() {
        this.worker = new Worker(new URL('./worker/generation-worker.ts', import.meta.url));
        this.worker.onmessage = this.receiveChunk.bind(this);
    }

    static createMap(offsetX: number = 0, offsetZ: number = 0) {
        return createChunkMap(RENDER_DISTANCE, offsetX, offsetZ);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        return new Promise((resolve) => {
            if (_cache.has(Chunk.toId(x, z))) {
                resolve(_cache.get(Chunk.toId(x, z))!);
            }

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

        _cache.set(chunk.getId(), chunk);

        this.keepCacheLimit();

        if (!callback) {
            console.debug(event.data);
            throw new Error('Unknown chunk received');
        }

        callback(chunk);
    }

    private keepCacheLimit() {
        if (_cache.size > MAX_CHUNK_CACHE) {
            const keys = Array.from(_cache.keys());
            const key = keys[Math.floor(Math.random() * keys.length)]; // todO: remove distant chunks first!
            _cache.delete(key);
        }
    }
}