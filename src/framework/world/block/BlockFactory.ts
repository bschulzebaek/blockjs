import Block, { BiomeData } from '@/framework/world/block/Block';
import { TRANSPARENT_BLOCKS } from '@/framework/world/block/block-data';
import BlockId from '@/framework/world/block/BlockId';

export interface BlockParameter {
    id: BlockId;
    biomeData?: BiomeData;
    changed?: boolean;
}

export default class BlockFactory {
    static create(parameter: BlockParameter): Block {
        return {
            ...parameter,
            transparent: TRANSPARENT_BLOCKS.includes(parameter.id),
            lightLevel: 0,
        }
    }

    static update(block: Block, parameter: BlockParameter) {
        return {
            ...block,
            ...parameter,
            transparent: TRANSPARENT_BLOCKS.includes(parameter.id),
        };
    }
}