import { Texture} from 'three';

export const AssetName = {
    BLOCK_ATLAS: 'block-atlas',
    SKYBOX_RIGHT: 'skybox-right',
    SKYBOX_LEFT: 'skybox-left',
    SKYBOX_TOP: 'skybox-top',
    SKYBOX_BOTTOM: 'skybox-bottom',
    SKYBOX_FRONT: 'skybox-front',
    SKYBOX_BACK: 'skybox-back',
}

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
    path: 'textures.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_RIGHT,
    path: 'skybox/right.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_LEFT,
    path: 'skybox/left.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_TOP,
    path: 'skybox/top.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_BOTTOM,
    path: 'skybox/bottom.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_FRONT,
    path: 'skybox/front.png',
    type: AssetType.TEXTURE,
}, {
    name: AssetName.SKYBOX_BACK,
    path: 'skybox/back.png',
    type: AssetType.TEXTURE,
}];

export default class AssetService {
    static DIRECTORY = '/assets/';
    
    private assets = new Map<AssetNameType, Texture>();

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

    public async init(): Promise<void> {
        await Promise.all(assets.map(this.loadTexture));
    }

    private loadTexture = async ({ name, path }: Asset) => {
        try {
            if (!this.assets.has(name)) {
                throw new Error(`Asset not found: ${name}!`);
            }

            const texture = this.assets.get(name)!;
            const src = this.getPath(path);

            const response = await fetch(src),
                blob = await response.blob();

            texture.image = await createImageBitmap(blob);
            texture.needsUpdate = true;
        } catch(e) {
            console.error(`Failed to load asset: ${name}!`);
            console.error(e);
        }
    }

    private getPath(path: string) {
        return `${AssetService.DIRECTORY}${path}`;
    }
    
    public get = (name: AssetNameType) => {
        return this.assets.get(name)!;
    }
}