import CreativeControls from './content/player/CreativeControls.ts';
import GeneratorV1 from './framework/world/generator/GeneratorV1.ts';
import type Controls from './content/player/Controls.ts';

export const CHUNK_GENERATOR = new GeneratorV1();
export const CHUNK_PERSIST = true;
export const PLAYER_CONTROLS: typeof Controls = CreativeControls;

export * from './config.ts';

