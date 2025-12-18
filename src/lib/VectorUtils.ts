import type { Vector3 } from "three";

export function vector3ToTuple(vector: Vector3): [number, number, number] {
    return [vector.x, vector.y, vector.z];
}

export function tupleToVector3(vector: Vector3, tuple: [number, number, number]): void {
    vector.set(tuple[0], tuple[1], tuple[2]);
} 