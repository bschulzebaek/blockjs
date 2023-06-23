export default function loadTexture(src: string) {
    return new Promise(async (resolve) => {
        const image = new Image();

        image.src = src;

        image.onload = () => {
            resolve(image);
        };
    });
}