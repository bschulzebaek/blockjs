import { BlockMap } from '@/core/world/chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV2 from '@/core/world/generation/v2';

export default function generate(blockMap: BlockMap, chunkId: string, seed: string) {
    let generator = null;

    switch (WORLD_GENERATION_VERSION) {
        case 1:
            // generator = generationV1(blockMap, chunkId, seed);
            break;
        case 2:
            generator = generationV2(blockMap, chunkId, seed);
            break;
        case 3:
            // generator = generationV3(blockMap, chunkId, seed);
            break;
        default:
            throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
    }

    return generator;
}