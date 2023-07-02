import Chunk from '@/framework/world/chunk/Chunk';
import { LocalChunkCache } from '@/framework/world/generation/LocalChunkCache';
import ChunkPayload from '@/framework/world/generation/worker/ChunkPayload';
import ChunkFactory from '@/framework/world/chunk/ChunkFactory';
import createChunkGrid from '@/framework/world/create-chunk-grid';
import ChunkUtils from '@/framework/world/chunk/ChunkUtils';
import { WORLD_GENERATION_WORKERS } from '@/configuration';
import keepCacheLimit from '@/framework/world/generation/worker/keep-cache-limit';
import GlobalState from '@/engine/worker/states/GlobalState';
import WorldMessages from '@/framework/world/WorldMessages';
import { Vector3 } from 'three';

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

    static createMap(offset: Vector3 = new Vector3(0, 0, 0)) {
        return createChunkGrid(GlobalState.getSettings().getRenderDistance(), offset.x, offset.z);
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
    }

    public generateChunk(x: string, z: string): Promise<Chunk> {
        const id = ChunkUtils.chunkCoordinatesToChunkId(x, z);
        const chunk = LocalChunkCache.get(id);

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

        this.promises.set(id, promise);

        return promise;
    }

    private receiveChunk(event: MessageEvent<ChunkPayload>) {
        const chunkId = ChunkUtils.chunkCoordinatesToChunkId(event.data.x, event.data.z);

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
                LocalChunkCache.set(chunkId, chunk);

                // @ts-ignore
                promise.resolver(chunk);

                keepCacheLimit(LocalChunkCache);
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