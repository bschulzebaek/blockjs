import WorldConfig from '@/shared/WorldConfig';
import SettingsObject from '@/shared/settings/SettingsObject';

export default interface SetupPayload {
    canvas: OffscreenCanvas;
    config: WorldConfig | {
        uuid: string;
        name: string;
        seed: string;
    };
    parameters: string;
    settings: SettingsObject;
}