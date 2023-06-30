import Chunk from '@/core/world/chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import createChunkGrid from '@/core/world/create-chunk-grid';
import { RENDER_DISTANCE } from '@/settings';
import FeatureFlags, { Features } from '@/shared/FeatureFlags';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import keepCacheLimit from '@/core/world/generation/keep-cache-limit';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

const _cache = new Map<string, Chunk>();

export default class WorldGenerator {
    private promises: Map<string, Promise<Chunk>> = new Map();
    private readonly worker: Worker = new Worker(new URL('./worker/generation-worker.ts', import.meta.url));

    constructor(
        private readonly seed: string,
        private readonly uuid: string,
    ) {
        this.worker.onmessage = this.receiveChunk.bind(this);
    }

    static createMap(offsetX: number = 0, offsetZ: number = 0) {
        return createChunkGrid(RENDER_DISTANCE, offsetX, offsetZ);
    }

    public invalidate(chunkId: string) {
        this.worker.postMessage({
            action: CoreWorkerMessages.CHUNK_INVALIDATE,
            payload: {
                id: chunkId,
            },
        });
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        const start = performance.now();
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

            this.worker.postMessage({
                action: CoreWorkerMessages.CHUNK_GENERATE,
                payload: {
                    id,
                    uuid: this.uuid,
                    x,
                    z,
                    seed: this.seed,
                },
            });
        });

        // @ts-ignore
        promise.resolver = resolver;
        // @ts-ignore
        promise.start = start;

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

                keepCacheLimit(_cache);

                if (!promise) {
                    console.debug(event.data);
                    throw new Error('Unknown chunk received');
                }

                // @ts-ignore
                promise.resolver(chunk);

                // @ts-ignore
                console.debug(`[Chunk ${chunkId}] generated in ${((performance.now() - promise.start) / 1000).toFixed(3)}s`);
            } catch (e) {
                if (chunkId) {
                    _cache.delete(chunkId);
                    this.promises.delete(chunkId);
                }

                console.error(e);
            }
        });
    }
}