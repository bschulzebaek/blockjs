import { LinearFilter, NearestFilter, NearestMipMapLinearFilter, Texture } from 'three';

export default class CustomTextureLoader {

    static load(src: string) {
        const texture = new Texture();

        texture.minFilter = NearestMipMapLinearFilter; // LinearFilter;
        texture.magFilter = NearestFilter;

        setTimeout(async () => {
            const response = await fetch(src),
                blob = await response.blob();

            texture.image = await createImageBitmap(blob);
            texture.needsUpdate = true;
        });

        return texture;
    }
}