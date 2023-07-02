import { DEFAULT_SETTINGS } from '@/shared/settings/default-settings';
import Settings from '@/shared/settings/Settings';

export default class SettingsStorage {
    static LS_KEY = 'settings';

    static get() {
        if (typeof localStorage === 'undefined') {
            return Settings.fromObject(DEFAULT_SETTINGS);
        }

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