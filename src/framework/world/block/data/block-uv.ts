import BlockId from '@/framework/world/block/BlockId';

export const BlockUV: Record<string, [number, number, number, number, number, number, number, number, number, number, number, number]> = {
    [BlockId.STONE]: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [BlockId.GRASS]: [3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 2, 0],
    [BlockId.DIRT]: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [BlockId.COBBLESTONE]: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [BlockId.PLANKS]: [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0],
    [BlockId.SAPLING]: [15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0],
    [BlockId.BEDROCK]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [BlockId.FLOWING_WATER]: [14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0],
    [BlockId.WATER]: [14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0],
    [BlockId.FLOWING_LAVA]: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    [BlockId.LAVA]: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    [BlockId.SAND]: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [BlockId.GRAVEL]: [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1],
    [BlockId.GOLD_ORE]: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [BlockId.IRON_ORE]: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [BlockId.COAL_ORE]: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [BlockId.LOG]: [4, 1, 4, 1, 4, 1, 4, 1, 5, 1, 5, 1],
    [BlockId.LEAVES]: [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
    [BlockId.SPONGE]: [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [BlockId.GLASS]: [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
    [BlockId.LAPIS_ORE]: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
    [BlockId.LAPIS_BLOCK]: [0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9],
    [BlockId.DISPENSER]: [14, 2, 13, 2, 13, 2, 13, 2, 14, 3, 14, 3],
    [BlockId.SANDSTONE]: [0, 12, 0, 12, 0, 12, 0, 12, 0, 11, 0, 13],
    [BlockId.NOTEBLOCK]: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4],
    [BlockId.BED + ':1']: [5, 9, 6, 9, 6, 9, 6, 9, 6, 8, 0, 4],
    [BlockId.BED + ':2']: [5, 9, 7, 9, 8, 9, 7, 9, 7, 8, 0, 4],


    [BlockId.WEB]: [11, 0, 11, 0, 11, 0, 11, 0, 11, 0, 11, 0],


    [BlockId.WOOL]: [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],


    [BlockId.STONE_SLAB]: [5, 0, 5, 0, 5, 0, 5, 0, 6, 0, 6, 0],


    [BlockId.BOOKSHELF]: [3, 2, 3, 2, 3, 2, 3, 2, 4, 0, 4, 0],


    [BlockId.CHEST]: [11, 1, 10, 1, 10, 1, 10, 1, 9, 1, 9, 1],


    [BlockId.CRAFTING_TABLE]: [12, 3, 11, 3, 12, 3, 11, 3, 11, 2, 11, 2],


    [BlockId.WOODEN_DOOR + ':1']: [1, 5, 4, 0, 1, 5, 4, 0, 4, 0, 4, 0],
    [BlockId.WOODEN_DOOR + ':2']: [1, 6, 4, 0, 1, 6, 4, 0, 4, 0, 4, 0],
};