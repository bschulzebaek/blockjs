import Chunk from '@/core/world/chunk/Chunk';
import ChunkPayload from '@/core/world/generation/worker/ChunkPayload';
import ChunkFactory from '@/core/world/chunk/ChunkFactory';
import createChunkGrid from '@/core/world/create-chunk-grid';
import FeatureFlags, { Features } from '@/shared/FeatureFlags';
import ChunkUtils from '@/core/world/chunk/ChunkUtils';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import { WORLD_GENERATION_WORKERS } from '@/configuration';
import keepCacheLimit from '@/core/world/generation/worker/keep-cache-limit';
import GlobalState from '@/core/GlobalState';

const _cache = new Map<string, Chunk>();

export default class WorldGenerator {
    private promises: Map<string, Promise<Chunk>> = new Map();

    private readonly workers: Worker[] = [];
    private chunkToWorkerMap: Map<string, number> = new Map();

    constructor(
        private readonly seed: string,
        private readonly uuid: string,
    ) {
        for (let i = 0; i < WORLD_GENERATION_WORKERS; i++) {
            const worker = new Worker(new URL('./worker/generation-worker.ts', import.meta.url));
            worker.onmessage = this.receiveChunk.bind(this);
            this.workers.push(worker);
        }
    }

    static createMap(offsetX: number = 0, offsetZ: number = 0) {
        return createChunkGrid(GlobalState.getSettings().getRenderDistance(), offsetX, offsetZ);
    }

    public invalidate(chunkId: string) {
        this.workers.forEach((worker) => {
            worker.postMessage({
                action: CoreWorkerMessages.CHUNK_INVALIDATE,
                payload: {
                    id: chunkId,
                },
            });
        });

        _cache.delete(chunkId);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[generateChunk] ${x}:${z}`);
        }

        const id = ChunkUtils.toId(x, z);
        const chunk = _cache.get(id);

        if (chunk) {
            return Promise.resolve(chunk);
        }

        if (this.promises.has(id)) {
            return this.promises.get(id)!;
        }

        let resolver, rejector;

        const promise: Promise<Chunk> = new Promise((resolve, reject) => {
            resolver = resolve;
            rejector = reject;

            this.getWorker(id).postMessage({
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
        promise.rejector = rejector;

        this.promises.set(`${x}:${z}`, promise);

        return promise;
    }

    private receiveChunk(event: MessageEvent<ChunkPayload>) {
        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[receiveChunk]`, event);
        }

        const chunkId = ChunkUtils.toId(event.data.x, event.data.z);

        setTimeout(() => {
            try {
                const promise = this.promises.get(chunkId);

                if (!promise) {
                    console.debug(event.data);
                    throw new Error('Unknown chunk received');
                }

                this.promises.delete(chunkId);

                if (event.data.failed) {
                    // @ts-ignore
                    promise.rejector();
                    return;
                }

                const chunk = ChunkFactory.createFromPayload(event.data);
                _cache.set(chunkId, chunk);

                // @ts-ignore
                promise.resolver(chunk);

                keepCacheLimit(_cache);
            } catch (e) {
                console.error(e);
            }
        });
    }

    private getWorker(chunkId: string) {
        const workerIndex = this.chunkToWorkerMap.get(chunkId);

        if (workerIndex !== undefined) {
            return this.workers[workerIndex];
        }

        const worker = this.workers[Math.floor(Math.random() * this.workers.length)];
        this.chunkToWorkerMap.set(chunkId, this.workers.indexOf(worker));

        return worker;
    }
}