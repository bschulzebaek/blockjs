import { BlockIds } from '../data/block-ids.ts';
import DemoGenerator from './framework/world/generator/DemoGenerator.ts';

export const WORLD_MAX_CHUNK_Y = 2; // 1 + WORLD_MAX_CHUNK_Y vertical Chunks
export const RENDER_DISTANCE_VERTICAL = 10;
export const PLACED_BLOCK_ID = BlockIds.BRICK_BLOCK;
export const CHUNK_GENERATOR = new DemoGenerator();
export const CHUNKS_PERSIST = true;

export const CHUNK= {
    WIDTH: 16,
    HEIGHT: 16,
};