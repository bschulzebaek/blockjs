export interface RawStorageObject {
    id: string;
    [key: string]: unknown;
}

export default interface StorageObject {
    toStorage(): RawStorageObject;
}