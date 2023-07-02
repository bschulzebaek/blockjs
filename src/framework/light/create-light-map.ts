import { WORLD_HEIGHT } from '@/configuration';
import FeatureFlags, { Features } from '@/framework/feature-flags/FeatureFlags';
import LightLevel from '@/framework/light/LightLevel';
import LightMap from '@/framework/light/LightMap';
import Block from '@/framework/world/block/Block';
import Chunk from '@/framework/world/chunk/Chunk';
import { iterateChunk2D, iterateChunk3D } from '@/framework/world/iterate-coordinates';
import WorldAccessor from '@/framework/world/WorldAccessor';
import ProcessingQueue from '@/shared/utility/ProcessingQueue';

interface LightNodeTask {
    x: number;
    y: number;
    z: number;
    chunk: Chunk;
    lightMap: LightMap;
}

const queue = new ProcessingQueue<LightNodeTask>(propagateNeighbours);

export default async function createLightMap(chunk: Chunk, accessor: WorldAccessor) {
    if (!FeatureFlags.get(Features.LIGHT_MAP)) {
        return setFallbackLight(chunk);
    }

    const start = performance.now();

    applySkyMask(chunk);
    await queue.start();

    console.debug(`[LightMap] Chunk ${chunk.getChunkId()} -> Created in ${((performance.now() - start) / 1000).toFixed(3)}s`);
}

function applySkyMask(chunk: Chunk) {
    const lightMap = chunk.getLightMap();
    const blocks = chunk.getBlocks();

    let position = '';
    let transparent = true;
    let currentY = 0;
    let block: Block | undefined = undefined;
    let level: LightLevel = 0;

    let _position = '';
    let _transparent = true;
    let _block: Block | undefined = undefined;

    iterateChunk2D((x, z) => {
        currentY = WORLD_HEIGHT - 1;

        do {
            position = `${x}:${currentY}:${z}`;
            block = blocks.get(position);
            transparent = !block || block.transparent;

            level = transparent ? 15 : 0;

            lightMap.set(position, level);

            if (!transparent) {
                break;
            }

            const facing = [
                [x, currentY, z + 1],
                [x, currentY, z - 1],
                [x + 1, currentY, z],
                [x - 1, currentY, z],
            ];

            // TODO: Get LightLevel from neighbouring chunks, and potentially update their LightMap too !
            // TODO: LightLevel should be lowered by 1, if surrounded by at least 2 opaque blocks ?
            facing.forEach(([_x, _y, _z]) => {
                _position = `${_x}:${_y}:${_z}`;
                _block = blocks.get(_position);
                _transparent = !_block || _block.transparent;

                if (!transparent) {
                    lightMap.set(_position, 0);
                    return;
                }

                let _level = lightMap.get(_position);

                if (!_level || _level < level - 1) {
                    _level = level - 1 as LightLevel;
                }

                lightMap.set(_position, _level);


                queue.addDataBeforeStart({
                    x: _x,
                    y: _y,
                    z: _z,
                    lightMap,
                    chunk,
                });
            });
        } while (currentY--);
    });
}

function propagateNeighbours({ x, y, z, lightMap, chunk }: {
    x: number,
    y: number,
    z: number,
    lightMap: LightMap,
    chunk: Chunk
}) {
    const facing = [
        [x, y, z + 1],
        [x, y, z - 1],
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
    ];
    const targetLevel = lightMap.get(`${x}:${y}:${z}`)! - 1 as LightLevel;
    const blocks = chunk.getBlocks();
    let position = '';
    let block: Block | undefined = undefined;
    let transparent = false;

    let payloads: any[] = [];

    facing.forEach(([_x, _y, _z]) => {
        position = `${_x}:${_y}:${_z}`;
        block = blocks.get(position);
        transparent = !block || block.transparent;

        if (!transparent) {
            lightMap.set(position, 0);
            return;
        }

        const localLevel = lightMap.get(position) ?? 0;

        if (localLevel >= targetLevel) {
            return;
        }

        lightMap.set(position, targetLevel);

        payloads.push({
            x: _x,
            y: _y,
            z: _z,
            lightMap,
            chunk,
        });
    });

    queue.addData(...payloads);
}

function setFallbackLight(chunk: Chunk) {
    const lightMap = chunk.getLightMap();

    iterateChunk3D((x, y, z) => {
        lightMap.set(`${x}:${y}:${z}`, 15);
    });
}