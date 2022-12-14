import RawRenderObjectInterface from './RawRenderObjectInterface';
import { ShaderName } from './shader-names';
import RenderObjectReadyEvent from '../../threads/render/events/RenderObjectReadyEvent';

enum ATTRIBUTE_LOCATIONS {
    POSITION = 0,
    NORMAL = 1,
    UV = 2,
    FACES = 3,
    ARRAY_OBJECT = 4,
}

export default class RenderObject {
    public id: string;
    public shader: ShaderName;
    public view: Float32Array;
    public vao: WebGLVertexArrayObject;

    public indexCount = 0;
    public vertexCount = 0;
    public vertexComponentSize = 3;

    constructor(context: WebGL2RenderingContext, config: RawRenderObjectInterface) {
        const { id, shader, view, arrayObj, faces, indices, normals, uvs, vertices } = config;

        this.id = id!;
        this.shader = shader;
        this.view = view;

        this.vao = context.createVertexArray()!;
        context.bindVertexArray(this.vao);

        this.bindIndices(context, indices);
        this.bindVertices(context, vertices);
        this.bindNormals(context, normals);
        this.bindUvs(context, uvs);
        this.bindFaces(context, faces);
        this.bindArrayObject(context, arrayObj);

        context.bindVertexArray(null);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

        dispatchEvent(new RenderObjectReadyEvent(this));
    }

    private bindIndices(context: WebGL2RenderingContext, indices: Uint16Array) {
        if (!indices) {
            return;
        }

        this.indexCount = indices.length;

        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, indices, context.STATIC_DRAW);
    }

    private bindVertices(context: WebGL2RenderingContext, vertices: Float32Array) {
        if (!vertices) {
            return;
        }
        this.vertexCount = vertices.length / this.vertexComponentSize;

        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
        context.enableVertexAttribArray(ATTRIBUTE_LOCATIONS.POSITION);
        context.vertexAttribPointer(ATTRIBUTE_LOCATIONS.POSITION, this.vertexComponentSize, context.FLOAT, false, 0, 0);
    }

    private bindNormals(context: WebGL2RenderingContext, normals: Float32Array) {
        if (!normals) {
            return;
        }

        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, normals, context.STATIC_DRAW);
        context.enableVertexAttribArray(ATTRIBUTE_LOCATIONS.NORMAL);
        context.vertexAttribPointer(ATTRIBUTE_LOCATIONS.NORMAL, 3, context.FLOAT, false, 0, 0);
    }

    private bindUvs(context: WebGL2RenderingContext, uvs: Float32Array) {
        if (!uvs) {
            return;
        }

        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, uvs, context.STATIC_DRAW);
        context.enableVertexAttribArray(ATTRIBUTE_LOCATIONS.UV);
        context.vertexAttribPointer(ATTRIBUTE_LOCATIONS.UV, 2, context.FLOAT, false, 0, 0);
    }

    private bindFaces(context: WebGL2RenderingContext, faces: Float32Array) {
        if (!faces) {
            return;
        }

        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, faces, context.STATIC_DRAW);
        context.enableVertexAttribArray(ATTRIBUTE_LOCATIONS.FACES);
        context.vertexAttribPointer(ATTRIBUTE_LOCATIONS.FACES, 2, context.FLOAT, false, 0, 0);
    }

    private bindArrayObject(context: WebGL2RenderingContext, arrayObject: Float32Array) {
        if (!arrayObject) {
            return;
        }

        context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
        context.bufferData(context.ARRAY_BUFFER, arrayObject, context.STATIC_DRAW);
        context.enableVertexAttribArray(ATTRIBUTE_LOCATIONS.ARRAY_OBJECT);
        context.vertexAttribPointer(ATTRIBUTE_LOCATIONS.ARRAY_OBJECT, 1, context.FLOAT, false, 0, 0);
    }
}