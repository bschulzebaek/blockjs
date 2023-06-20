export default class Chunk {
    static WIDTH = 16;
    static LENGTH = 16;

    constructor(
        private readonly x: number,
        private readonly z: number,
        private readonly blocks: Map<string, number>,
    ) {

    }

    public getX(): number {
        return this.x;
    }

    public getZ(): number {
        return this.z;
    }

    public getBlocks(): Map<string, any> {
        return this.blocks;
    }

    public iterateBlocks(callback: (x: number, y: number, z: number, block: number) => void) {
        this.blocks.forEach((block, key) => {
            const [x, y, z] = key.split(':').map((number) => parseInt(number, 10));

            callback(x * this.x + this.x, y, z * this.z + this.z, block);
        });
    }

    static getEmptyBlocks() {
        return new Map();
    }
}