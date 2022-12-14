function compileShader(context: WebGL2RenderingContext, src: string, type: number): WebGLShader {
    const shader = context.createShader(type) as WebGLShader;

    context.shaderSource(shader, src);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        throw new Error(context.getShaderInfoLog(shader)!);
    }

    return shader;
}

export default function createShaderProgram(context: WebGL2RenderingContext, vss: string, fss: string): WebGLProgram {
    const program = context.createProgram() as WebGLProgram,
        vs = compileShader(context, vss, context.VERTEX_SHADER),
        fs = compileShader(context, fss, context.FRAGMENT_SHADER);

    context.attachShader(program, vs);
    context.attachShader(program, fs);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        throw new Error(context.getProgramInfoLog(program)!);
    }

    return program;
}