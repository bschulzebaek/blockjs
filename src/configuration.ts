import { Vector3 } from 'three';

export const WORLD_HEIGHT = 64;
export const CHUNK_SIZE = 16;

export const WORLD_GENERATION_VERSION: 1 | 2 | 3 = 2;

export const WORLD_GENERATION_WORKERS = 8;

export const CHUNK_CACHE_LIMIT = 128;

export const PLAYER_START = new Vector3(0, WORLD_HEIGHT / 2, 0);