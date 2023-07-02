import LightLevel from '@/framework/light/LightLevel';
import BlockId from './BlockId';

export interface BiomeData {
    continentalness: number;
    humidity: number;
    temperature: number;
}

export default interface Block {
    id: BlockId;
    transparent: boolean;
    changed?: boolean;
    biomeData?: BiomeData;
    lightLevel: LightLevel;
}