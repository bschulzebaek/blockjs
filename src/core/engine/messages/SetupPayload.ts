import { WorldConfig } from '@/core/WorldConfigStorage';

export default interface SetupPayload {
    canvas: OffscreenCanvas;
    config: WorldConfig | {
        uuid: string;
        name: string;
        seed: string;
    };
    parameters: string;
}