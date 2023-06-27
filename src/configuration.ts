import BlockId from '@/core/world/block/BlockId';
import { Vector3 } from 'three';

export const WORLD_HEIGHT = 24;
export const CHUNK_SIZE = 16;

export const WORLD_GENERATION_VERSION: 1 | 2 | 3 = 2;

export const MAX_CHUNK_CACHE = 1024;

export const DEFAULT_BLOCK_PLACEMENT = BlockId.GOLD_ORE;

export const PLAYER_START = new Vector3(0, 20, 0); // TODO: Get player position from IndexedDB