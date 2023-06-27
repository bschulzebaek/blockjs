import WorldConfig from '@/shared/WorldConfig';

export default interface SetupPayload {
    canvas: OffscreenCanvas;
    config: WorldConfig | {
        uuid: string;
        name: string;
        seed: string;
    };
    parameters: string;
}