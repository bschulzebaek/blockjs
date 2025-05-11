import { type Camera, Euler, type Object3D, Vector3 } from "three";
import { InputAction } from "../../framework/input/InputMapper";

const PI_2 = Math.PI / 2;

const _eulerCamera = new Euler(0, 0, 0, 'YXZ');
const _eulerPlayer = new Euler(0, 0, 0, 'YXZ');

export default class Controls {
    static MOVEMENT_SPEED = 200;

    public movementSpeedMultiplier = 1;
    protected sprintMultiplier = 2;

    protected pointerSpeed = 1;
    protected minPolarAngle = 0;
    protected maxPolarAngle = Math.PI;

    protected object: Object3D;
    protected camera: Camera;

    protected forward: boolean = false;
    protected backward: boolean = false;
    protected left: boolean = false;
    protected right: boolean = false;
    protected up: boolean = false;
    protected down: boolean = false;

    protected sprint: boolean = false;

    protected velocity = new Vector3();
    protected direction = new Vector3();
    protected prevTime = 0;

    constructor(object: Object3D, camera: Camera) {
        this.object = object;
        this.camera = camera;

        this.bindInput();
    }

    private bindInput() {
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === BlockJS.canvas) {
                return;
            }

            this.forward = false;
            this.backward = false;
            this.left = false;
            this.right = false;
            this.up = false;
            this.down = false;
        });

        const input = BlockJS.container.InputMapper;

        input.bindMouseMove('camera', this.onMouseMove.bind(this));
        input.bindAction(InputAction.MOVE_FORWARD, () => this.forward = true, () => this.forward = false);
        input.bindAction(InputAction.MOVE_BACKWARD, () => this.backward = true, () => this.backward = false);
        input.bindAction(InputAction.MOVE_LEFT, () => this.left = true, () => this.left = false);
        input.bindAction(InputAction.MOVE_RIGHT, () => this.right = true, () => this.right = false);
        input.bindAction(InputAction.MOVE_UP, () => this.up = true, () => this.up = false);
        input.bindAction(InputAction.MOVE_DOWN, () => this.down = true, () => this.down = false);
        input.bindAction(InputAction.SPRINT, () => this.sprint = true, () => this.sprint = false);
    }

    public update() {
        throw new Error('Not implemented');
    }

    private onMouseMove(event: MouseEvent) {
        const { movementX, movementY } = event;

        _eulerPlayer.setFromQuaternion(this.object.quaternion);
        _eulerPlayer.y -= movementX * 0.002 * this.pointerSpeed;
        this.object.quaternion.setFromEuler(_eulerPlayer);

        _eulerCamera.setFromQuaternion(this.camera.quaternion);
        _eulerCamera.x -= movementY * 0.002 * this.pointerSpeed;
        _eulerCamera.x = Math.max(PI_2 - this.maxPolarAngle, Math.min(PI_2 - this.minPolarAngle, _eulerCamera.x));
        this.camera.quaternion.setFromEuler(_eulerCamera);
    }
}
