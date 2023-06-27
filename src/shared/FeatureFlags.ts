enum Features {
    INVENTORY = 'INVENTORY',
    DEBUG = 'DEBUG',
    CURSOR = 'CURSOR',
}

const _features = {
    INVENTORY: false,
    DEBUG: false,
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