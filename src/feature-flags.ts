export enum Features {
    INVENTORY = 'INVENTORY',
    DEBUG_HELPERS = 'DEBUG_HELPERS',
    CURSOR = 'CURSOR',
}

const _features = {
    INVENTORY: false,
    DEBUG_HELPERS: true,
    CURSOR: true,
}

class FeatureFlags {
    static get(flag: Features) {
        return _features[flag];
    }

    static set(flag: Features, value: boolean) {
        _features[flag] = value;
    }

    static setFromSearchParams(params: URLSearchParams) {
        for (const [key, value] of params.entries()) {
            if (key in _features) {
                _features[key as Features] = value === 'true';
            }
        }
    }
}

export default FeatureFlags;