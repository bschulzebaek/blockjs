enum Features {
    INVENTORY = 'INVENTORY',
    DEBUG = 'DEBUG',
    CURSOR = 'CURSOR',
    LIGHT = 'LIGHT',
}

const _features = {
    DEBUG: false,
    INVENTORY: true,
    CURSOR: true,
    LIGHT: false,
}

class FeatureFlags {
    static get(flag: Features) {
        return _features[flag];
    }

    static set(flag: Features, value: boolean) {
        _features[flag] = value;
    }

    static setFromSearchParams(params: URLSearchParams) {
        Array.from(params.entries()).forEach(([key, value]) => {
            if (key in _features) {
                _features[key as Features] = value === 'true';
            }
        });
    }
}

export {
    FeatureFlags as default,
    Features,
};