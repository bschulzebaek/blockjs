import { WebGLRenderer } from 'three';

export default class CustomRenderer extends WebGLRenderer {
    constructor(canvas: OffscreenCanvas | HTMLCanvasElement) {
        super({
            canvas,
            powerPreference: 'high-performance',
            precision: 'lowp',
            antialias: true,
        });

        this.setClearColor(0xb0ddf9, 1);
    }
}