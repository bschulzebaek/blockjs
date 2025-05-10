type Face = {
    shade: number;
    pos: number[];
    norm: number[];
    uv: number[];
};

export const Faces: Face[] = [
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