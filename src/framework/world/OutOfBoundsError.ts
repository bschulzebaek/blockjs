export default class OutOfBoundsError extends Error {
    public constructor(x: number, y: number, z: number) {
        super(`${x}, ${y}, ${z}`);
    }
}