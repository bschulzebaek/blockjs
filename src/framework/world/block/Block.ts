import BlockId from './BlockId';

interface BiomeData {
    continentalness: number;
    humidity: number;
    temperature: number;
}

export default interface Block {
    id: BlockId;
    changed?: true;
    biomeData?: BiomeData;
}