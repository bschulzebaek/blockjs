import BlockId from './BlockId';
import { TRANSPARENT_BLOCKS } from '@/core/world/Block/block-data';

interface BiomeData {
    continentalness: number;
    humidity: number;
    temperature: number;
}

export default class Block {
    private transparent = TRANSPARENT_BLOCKS.includes(this.id);
    private biomeData: BiomeData;

    constructor(
        private readonly x: number,
        private readonly y: number,
        private readonly z: number,
        private id: BlockId,
        continentalness: number = 0.5,
        humidity: number = 0.5,
        temperature: number = 0.5,
    ) {
        this.biomeData = {
            continentalness,
            humidity,
            temperature,
        };
    }

    public getId() {
        return this.id;
    }

    public setId(id: BlockId) {
        this.id = id;
    }

    public isTransparent() {
        return this.transparent
    }

    public getBiomeData() {
        return this.biomeData;
    }
}