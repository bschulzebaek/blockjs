import BlockId from './BlockId';

interface BiomeData {
    continentalness: number;
    humidity: number;
    temperature: number;
}

export default interface Block {
    biomeData?: BiomeData;
    id: BlockId;
    x: number;
    y: number;
    z: number;
}