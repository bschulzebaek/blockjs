import { BlockIds  } from './block-ids';


// 4x Sides, Top, Bottom
export const BlockUV: Record<number, [number, number, number, number, number, number, number, number, number, number, number, number]> = {
    [BlockIds.STONE]: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [BlockIds.GRASS]: [3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 2, 0],
    [BlockIds.DIRT]: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [BlockIds.COBBLESTONE]: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [BlockIds.PLANKS]: [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0],
    [BlockIds.SAPLING]: [15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0],
    [BlockIds.BEDROCK]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [BlockIds.FLOWING_WATER]: [14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0],
    [BlockIds.WATER]: [14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0],
    [BlockIds.FLOWING_LAVA]: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    [BlockIds.LAVA]: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    [BlockIds.SAND]: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [BlockIds.GRAVEL]: [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1],
    [BlockIds.GOLD_ORE]: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [BlockIds.IRON_ORE]: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [BlockIds.COAL_ORE]: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [BlockIds.DIAMOND_ORE]: [2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3],
    [BlockIds.LOG]: [4, 1, 4, 1, 4, 1, 4, 1, 5, 1, 5, 1],
    [BlockIds.LEAVES]: [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
    [BlockIds.SPONGE]: [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [BlockIds.GLASS]: [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
    [BlockIds.LAPIS_ORE]: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
    [BlockIds.LAPIS_BLOCK]: [0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9],
    [BlockIds.IRON_BLOCK]: [6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1],
    [BlockIds.GOLD_BLOCK]: [7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1],
    [BlockIds.DIAMOND_BLOCK]: [8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1],
    [BlockIds.DISPENSER]: [14, 2, 13, 2, 13, 2, 13, 2, 14, 3, 14, 3],
    [BlockIds.SANDSTONE]: [0, 12, 0, 12, 0, 12, 0, 12, 0, 11, 0, 13],
    [BlockIds.NOTEBLOCK]: [10, 4, 10, 4, 10, 4, 10, 4, 10, 4, 10, 4],
    [BlockIds.BED_A]: [5, 9, 6, 9, 6, 9, 6, 9, 6, 8, 0, 4],
    [BlockIds.BED_B]: [5, 9, 7, 9, 8, 9, 7, 9, 7, 8, 0, 4],
    [BlockIds.BRICK_BLOCK]: [7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0],


    [BlockIds.WEB]: [11, 0, 11, 0, 11, 0, 11, 0, 11, 0, 11, 0],


    [BlockIds.WOOL]: [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],


    [BlockIds.STONE_SLAB]: [5, 0, 5, 0, 5, 0, 5, 0, 6, 0, 6, 0],


    [BlockIds.BOOKSHELF]: [3, 2, 3, 2, 3, 2, 3, 2, 4, 0, 4, 0],


    [BlockIds.CHEST]: [11, 1, 10, 1, 10, 1, 10, 1, 9, 1, 9, 1],


    [BlockIds.CRAFTING_TABLE]: [12, 3, 11, 3, 12, 3, 11, 3, 11, 2, 11, 2],


    [BlockIds.WOODEN_DOOR_A]: [1, 5, 4, 0, 1, 5, 4, 0, 4, 0, 4, 0],
    [BlockIds.WOODEN_DOOR_B]: [1, 6, 4, 0, 1, 6, 4, 0, 4, 0, 4, 0],
    [BlockIds.TNT]: [8, 0, 8, 0, 8, 0, 8, 0, 9, 0, 10, 0],
};