import Chunk from '@/world/chunk/Chunk';
import ChunkPayload from '@/world/generation/worker/ChunkPayload';
import ChunkFactory from '@/world/chunk/ChunkFactory';
import createChunkGrid from '@/world/create-chunk-grid';
import ChunkUtils from '@/world/chunk/ChunkUtils';
import { WORLD_GENERATION_WORKERS } from '@/configuration';
import keepCacheLimit from '@/world/generation/worker/keep-cache-limit';
import GlobalState from '@/engine/worker/states/GlobalState';
import WorldMessages from '@/world/WorldMessages';

const _cache = new Map<string, Chunk>();

export default class WorldGenerator {
    private promises: Map<string, Promise<Chunk>> = new Map();

    private readonly workers: Worker[] = [];
    private chunkToWorkerMap: Map<string, number> = new Map();
    private readonly seed: string = GlobalState.getConfig().getSeed();
    private readonly uuid: string = GlobalState.getConfig().getUUID();

    constructor() {
        for (let i = 0; i < WORLD_GENERATION_WORKERS; i++) {
            const worker = new Worker(new URL('./worker/index.ts', import.meta.url));
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
                action: WorldMessages.CHUNK_INVALIDATE,
                payload: {
                    id: chunkId,
                },
            });
        });

        _cache.delete(chunkId);
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
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
                action: WorldMessages.CHUNK_GENERATE,
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