import type { Vector3 } from "three";

/**
 * Helper function to convert Vector3 to tuple
 */
export function vector3ToTuple(vector: Vector3): [number, number, number] {
    return [vector.x, vector.y, vector.z];
}

/**
 * Helper function to apply tuple to Vector3
 */
export function tupleToVector3(vector: Vector3, tuple: [number, number, number]): void {
    vector.set(tuple[0], tuple[1], tuple[2]);
} 