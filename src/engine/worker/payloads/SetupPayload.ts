import WorldConfig from '@/shared/world-config/WorldConfig';
import SettingsObject from '@/shared/settings/SettingsObject';

export default interface SetupPayload {
    canvas: OffscreenCanvas;
    config: {
        uuid: string;
        name: string;
        seed: string;
    };
    parameters: string;
    settings: SettingsObject;
}