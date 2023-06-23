export default interface SceneComponentInterface {
    getName(): string;
    update?(delta: number): void;
    getMesh?(): any;
}