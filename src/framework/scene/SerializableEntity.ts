import { Object3D } from 'three';

/**
 * Represents the serialized state of an entity
 */
export interface EntityState {
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    data?: {
        [key: string]: unknown;
    };
}

/**
 * Interface for objects that can be serialized to/from a file.
 * Extends Object3D to ensure we have access to uuid and type.
 */
export interface SerializableEntity extends Object3D {
    persist: boolean;
    /**
     * Serialize the entity's state to a JSON-compatible format
     */
    serialize(): EntityState;

    /**
     * Restore the entity's state from a previously serialized state
     */
    deserialize(state: EntityState): void;
}
