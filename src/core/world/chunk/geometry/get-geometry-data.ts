import BlockId from '@/core/world/block/BlockId';
import { BlockUV } from '@/core/world/block/data/block-uv';

const data = [
    // front
    { shade: 1, pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 1] },
    { shade: 1, pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 1] },
    { shade: 1, pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 0] },

    { shade: 1, pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 0] },
    { shade: 1, pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 1] },
    { shade: 1, pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 0] },

    // right
    { shade: 2, pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 1] },
    { shade: 2, pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 1] },
    { shade: 2, pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },

    { shade: 2, pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },
    { shade: 2, pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 1] },
    { shade: 2, pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 0] },

    // back
    { shade: 1, pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 1] },
    { shade: 1, pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 1] },
    { shade: 1, pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 0] },

    { shade: 1, pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 0] },
    { shade: 1, pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 1] },
    { shade: 1, pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 0] },

    // left
    { shade: 2, pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 1] },
    { shade: 2, pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    { shade: 2, pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 0] },

    { shade: 2, pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 0] },
    { shade: 2, pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    { shade: 2, pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 0] },

    // top
    { shade: 0, pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 1] },
    { shade: 0, pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 1] },
    { shade: 0, pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },

    { shade: 0, pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },
    { shade: 0, pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 1] },
    { shade: 0, pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 0] },

    // bottom
    { shade: 3, pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 1] },
    { shade: 3, pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 1] },
    { shade: 3, pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 0] },

    { shade: 3, pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 0] },
    { shade: 3, pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 1] },
    { shade: 3, pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 0] },
];

// todo: Performance!
export default function getGeometryData(
    x: number,
    y: number,
    z: number,
    faces: boolean[],
    blockId: BlockId,
) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const colors = [];

    for (let face = 0; face < 6; face++) {

        if (!faces[face]) {
            continue;
        }

        for (let j = 0; j < 6; j++) {
            const vertex = data[face * 6 + j];
            positions.push(...vertex.pos.map((v, i) => v / 2 + [x, y, z][i]));
            normals.push(...vertex.norm);

            const [u1, v1, u2, v2] = getUVs(blockId, face);

            let [u, v] = vertex.uv;
            u = u ? u2 : u1;
            v = v ? v2 : v1;

            uvs.push(u / 16, v / 16);

            const shade = [1, 0.8, 0.5, 0.3][vertex.shade];
            colors.push(shade, shade, shade);
        }
    }
    return { positions, normals, uvs, colors };
}

function getUVs(blockId: BlockId, face: number): [ u1: number, u2: number, v1: number, v2: number ] {
    const [u, v] = [
        BlockUV[blockId][face * 2],
        BlockUV[blockId][face * 2 + 1]
    ];

    return [u, v, u + 1, v + 1];
}