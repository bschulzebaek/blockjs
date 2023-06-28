import Chunk from '@/core/world/chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import createChunkGrid from '@/core/world/create-chunk-grid';
import { RENDER_DISTANCE } from '@/settings';
import { MAX_CHUNK_CACHE } from '@/configuration';
import FeatureFlags, { Features } from '@/shared/FeatureFlags';
import GeneratorMessagePayload from '@/core/world/generation/worker/GeneratorMessagePayload';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';

const _cache = new Map<string, Chunk>();

// todo: Pre-generate chunks around current map when idle

export default class WorldGenerator {
    private promises: Map<string, Promise<Chunk>> = new Map();

    constructor(
        private readonly seed: string,
        private readonly uuid: string,
    ) {
    }

    static createMap(offsetX: number = 0, offsetZ: number = 0) {
        return createChunkGrid(RENDER_DISTANCE, offsetX, offsetZ);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[generateChunk] ${x}:${z}`);
        }

        const id = ChunkUtils.toId(x, z);
        const chunk = _cache.get(id);

        if (chunk) {
            return Promise.resolve(_cache.get(ChunkUtils.toId(x, z))!);
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
                uuid: this.uuid,
                x,
                z,
                seed: this.seed,
            } as GeneratorMessagePayload);
        });

        // @ts-ignore
        promise.resolver = resolver;
        this.promises.set(`${x}:${z}`, promise);

        return promise;
    }

    private receiveChunk(event: MessageEvent<ChunkPayload>) {
        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[receiveChunk]`, event);
        }

        let chunkId: string | undefined = undefined;

        setTimeout(() => {
            try {
                const chunk = ChunkFactory.createFromPayload(event.data);
                chunkId = chunk.getChunkId();

                const promise = this.promises.get(chunk.getChunkId());

                _cache.set(chunk.getChunkId(), chunk);

                this.keepCacheLimit();

                if (!promise) {
                    console.debug(event.data);
                    throw new Error('Unknown chunk received');
                }

                // @ts-ignore
                promise.resolver(chunk);
            } catch(e) {
                if (chunkId) {
                    _cache.delete(chunkId);
                    this.promises.delete(chunkId);
                }

                console.error(e);
            }
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