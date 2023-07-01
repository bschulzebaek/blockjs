import { BlockMap } from '@/world/chunk/Chunk';
import { WORLD_GENERATION_VERSION } from '@/configuration';
import generationV1 from '@/world/generation/v1';
import generationV2 from '@/world/generation/v2';
import generationV3 from '@/world/generation/v3';

export default function generate(blockMap: BlockMap, chunkId: string, seed: string) {
    switch (WORLD_GENERATION_VERSION) {
        case 1:
            return generationV1(blockMap, chunkId, seed);
        case 2:
            return generationV2(blockMap, chunkId, seed);
        case 3:
            return generationV3(blockMap, chunkId, seed);
        default:
            throw new Error(`Unknown world generation version: ${WORLD_GENERATION_VERSION}`);
    }
}