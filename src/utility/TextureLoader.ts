import { LinearFilter, NearestFilter, RepeatWrapping, Texture } from 'three';

export default class CustomTextureLoader {
    public load(src: string) {
        const texture = new Texture();

        texture.minFilter = LinearFilter;
        texture.magFilter = NearestFilter;

        this.loadImage(src).then((bitmap) => {
            this.updateTexture(texture, bitmap);
        });

        return texture;
    }

    private loadImage(src: string): Promise<ImageBitmap> {
        return new Promise(async (resolve) => {
            const response = await fetch(src),
                blob = await response.blob();

            resolve(await createImageBitmap(blob));
        });
    }

    private updateTexture(texture: Texture, bitmap: ImageBitmap) {
        texture.image = bitmap;
        texture.needsUpdate = true;
        return texture;
    }
}