import BlockId from './BlockId';
import { TRANSPARENT_BLOCKS } from '@/core/world/Block/block-data';
import { Vector3 } from 'three';

interface BiomeData {
    continentalness: number;
    humidity: number;
    temperature: number;
}

export default interface Block {
    biomeData: BiomeData;
    id: BlockId;
    x: number;
    y: number;
    z: number;
}