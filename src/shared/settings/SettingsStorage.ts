import { DEFAULT_SETTINGS } from '@/shared/settings/default-settings';
import Settings from '@/shared/settings/Settings';

export default class SettingsStorage {
    static LS_KEY = 'settings';

    static get() {
        const settings = JSON.parse(localStorage.getItem(SettingsStorage.LS_KEY) || '{}');

        return Settings.fromObject({
            ...DEFAULT_SETTINGS,
            ...settings,
        });
    }

    static save(settings: Settings) {
        localStorage.setItem(SettingsStorage.LS_KEY, JSON.stringify(settings.toObject()));
    }
}