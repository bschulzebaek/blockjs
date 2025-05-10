import type GenerationInterface from './GeneratorInterface.ts';
import { CHUNK } from '../../../defaults.const.ts';
import { BlockIds } from '../../../../data/block-ids.ts';
import CoordinatesHelper from '../CoordinatesHelper.ts';

export default class DemoGenerator implements GenerationInterface {
    public generate(_x: number, _y: number, _z: number): Uint8Array {
        const blocks = new Uint8Array(CHUNK.WIDTH * CHUNK.HEIGHT * CHUNK.WIDTH);

        for (let x = 0; x < CHUNK.WIDTH; x++) {
            for (let z = 0; z < CHUNK.WIDTH; z++) {
                for (let y = 0; y < CHUNK.HEIGHT; y++) {
                    const absolutY = _y * CHUNK.HEIGHT + y;
                    let blockId = BlockIds.AIR;

                    // 0:0 -> Diamond
                    // 15:0 -> Iron
                    // 15:15 -> Lapis
                    // 0:15 -> Gold

                    if (absolutY < 18) {
                        if (x === 0 && z === 0) {
                            blockId = BlockIds.DIAMOND_BLOCK;
                        } else if (x === 0 && z === CHUNK.WIDTH - 1) {
                            blockId = BlockIds.GOLD_BLOCK;
                        } else if (x === CHUNK.WIDTH - 1 && z === 0) {
                            blockId = BlockIds.IRON_BLOCK;
                        } else if (x === CHUNK.WIDTH -1 && z === CHUNK.WIDTH - 1) {
                            blockId = BlockIds.LAPIS_BLOCK;
                        } else if (absolutY === 0) {
                            blockId = BlockIds.BEDROCK;
                        } else if (absolutY < 16) {
                            blockId = BlockIds.STONE;
                        } else if (absolutY < 18) {
                            blockId = BlockIds.GRASS;
                        }
                    }

                    blocks[CoordinatesHelper.ChunkCoordsToIndex(x, y, z)] = blockId;
                }
            }
        }

        return blocks;
    }
}