import { Texture } from 'three';

const AssetName = {
    BLOCK_ATLAS: 'block-atlas',
};

type AssetNameType = typeof AssetName[keyof typeof AssetName];

const AssetType = { 
    TEXTURE: 'texture',
};

type Asset = {
    name: typeof AssetName[keyof typeof AssetName];
    type: typeof AssetType[keyof typeof AssetType];
    path: string;
}

const assets: Asset[] = [{
    name: AssetName.BLOCK_ATLAS,
    path: './textures.png',
    type: AssetType.TEXTURE,
}];

class AssetService {
    static DIRECTORY = '/assets/';
    
    private assets: Map<string, Texture> = new Map();
    
    constructor() {
        this.initAssets();
    }
    
    private initAssets() {
        assets.forEach((asset) => {
            switch (asset.type) {
                case AssetType.TEXTURE:
                    this.assets.set(asset.name, new Texture());
                    break;
                default:
                    throw new Error(`Asset type ${asset.type} not supported`);
            }
        });
    }

    public preload = async () => {
        let promises: Promise<void>[] = [];

        assets.forEach((asset) => {
            switch (asset.type) {
                case AssetType.TEXTURE:
                    promises.push(this.loadTexture(asset));
                    break;
                default:
                    throw new Error(`Unknown asset loader: ${asset.type}!`);
            }
        });

        return Promise.all(promises);
    }

    private async loadTexture(asset: Asset) {
        try {
            if (!this.assets.has(asset.name)) {
                throw new Error(`Asset not found: ${asset.name}!`);
            }

            const texture = this.assets.get(asset.name)!;
            const src = this.getPath(asset);

            const response = await fetch(src),
                blob = await response.blob();

            texture.image = await createImageBitmap(blob);
            texture.needsUpdate = true;
        } catch(e) {
            console.error(`Failed to load asset: ${asset.name}!`);
            console.error(e);
        }
    }

    private getPath(asset: Asset) {
        return `${AssetService.DIRECTORY}${asset.path}`;
    }
    
    public get = (name: AssetNameType) => {
        return this.assets.get(name)!;
    }
}

export {
    AssetService as default,
    AssetName,
    
}