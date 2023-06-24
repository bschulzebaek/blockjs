export enum Features {
    INVENTORY = 'INVENTORY',
    DEBUG_HELPERS = 'DEBUG_HELPERS',
    CURSOR = 'CURSOR',
}

const _features = {
    INVENTORY: false,
    DEBUG_HELPERS: true,
    CURSOR: false,
}

class FeatureFlags {
    static get(flag: Features) {
        return _features[flag];
    }

    static set(flag: Features, value: boolean) {
        _features[flag] = value;
    }
}

// @ts-ignore
globalThis.__FeatureFlags = FeatureFlags;

export default FeatureFlags;