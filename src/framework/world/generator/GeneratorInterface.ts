export default interface GeneratorInterface {
    generate(x: number, y: number, z: number): Uint8Array;
}