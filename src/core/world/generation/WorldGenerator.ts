import Chunk from '@/core/world/Chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import WorkerContext from '@/core/engine/WorkerContext';
import ChunkFactory from '@/core/world/Chunk/ChunkFactory';
import createChunkMap from '@/core/world/create-chunk-map';
import { RENDER_DISTANCE } from '@/settings';
import { MAX_CHUNK_CACHE } from '@/configuration';

const _cache = new Map<string, Chunk>();

// todo: Pre-generate chunks around current map

export default class WorldGenerator {
    private promises: Map<string, Promise<Chunk>> = new Map();
    private seed = WorkerContext.config!.getSeed();

    static createMap(offsetX: number = 0, offsetZ: number = 0) {
        return createChunkMap(RENDER_DISTANCE, offsetX, offsetZ);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        const id = Chunk.toId(x, z);
        const chunk = _cache.get(id);

        if (chunk) {
            return Promise.resolve(_cache.get(Chunk.toId(x, z))!);
        }

        if (this.promises.has(id)) {
            return this.promises.get(id)!;
        }

        let resolver;

        const promise: Promise<Chunk> = new Promise((resolve) => {
            resolver = resolve;

            const worker = new Worker(new URL('./worker/generation-worker.ts', import.meta.url));
            worker.onmessage = this.receiveChunk.bind(this);
            worker.postMessage({
                x,
                z,
                seed: this.seed,
            });
        });

        // @ts-ignore
        promise.resolver = resolver;
        this.promises.set(`${x}:${z}`, promise);

        return promise;
    }

    private receiveChunk(event: MessageEvent<ChunkPayload>) {
        setTimeout(() => {
            const chunk = ChunkFactory.createFromPayload(event.data);
            const promise = this.promises.get(chunk.getId());

            _cache.set(chunk.getId(), chunk);

            this.keepCacheLimit();

            if (!promise) {
                console.debug(event.data);
                throw new Error('Unknown chunk received');
            }

            // @ts-ignore
            promise.resolver(chunk);
        });
    }

    private keepCacheLimit() {
        if (_cache.size > MAX_CHUNK_CACHE) {
            const keys = Array.from(_cache.keys());
            const key = keys[Math.floor(Math.random() * keys.length)]; // todO: remove distant chunks first!
            _cache.delete(key);
        }
    }
}