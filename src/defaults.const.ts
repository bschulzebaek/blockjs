import type Controls from './content/player/Controls.ts';
import CreativeControls from './content/player/CreativeControls.ts';
import DemoGenerator from './framework/world/generator/DemoGenerator.ts';

export const WORLD_MAX_CHUNK_Y = 2; // 1 + WORLD_MAX_CHUNK_Y vertical Chunks
export const RENDER_DISTANCE_VERTICAL = 10;
export const CHUNK_GENERATOR = new DemoGenerator();
export const CHUNK_PERSIST = true;
export const PLAYER_CONTROLS: typeof Controls = CreativeControls;

export const CHUNK= {
    WIDTH: 16,
    HEIGHT: 16,
};

