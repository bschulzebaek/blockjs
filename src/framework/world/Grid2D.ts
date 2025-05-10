export default function Grid2D(distance: number, centerX: number, centerZ: number): [number, number][] {
    if (distance < 1) {
        return [[centerX, centerZ]];
    } else if (distance === 1) {
        return [
            [centerX, centerZ - 1],
            [centerX - 1, centerZ],
            [centerX, centerZ],
            [centerX + 1, centerZ],
            [centerX, centerZ + 1],
        ];
    }

    const result: [number, number][] = [];

    for (let x = -distance; x <= distance + 1; x++) {
        for (let z = -distance; z <= distance + 1; z++) {
            const hypotenuse = Math.sqrt(x * x + z * z);

            if (hypotenuse <= distance) {
                result.push([centerX + x, centerZ + z]);
            }
        }
    }

    return result;
}