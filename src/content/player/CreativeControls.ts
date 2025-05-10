import { type Camera, Euler, type Object3D, Vector3 } from 'three';
import { InputAction } from '../../framework/input/InputMapper.ts';

const PI_2 = Math.PI / 2;

const _eulerCamera = new Euler(0, 0, 0, 'YXZ');
const _eulerPlayer = new Euler(0, 0, 0, 'YXZ');

export default class CreativeControls {
    static MOVEMENT_SPEED = 200;

    public movementSpeedMultiplier = 1;

    private pointerSpeed = 1;
    private minPolarAngle = 0;
    private maxPolarAngle = Math.PI;

    private forward: boolean = false;
    private backward: boolean = false;
    private left: boolean = false;
    private right: boolean = false;
    private up: boolean = false;
    private down: boolean = false;

    private object: Object3D;
    private camera: Camera;
    
    private velocity = new Vector3();
    private direction = new Vector3();
    private prevTime = 0;

    constructor(object: Object3D, camera: Camera) {
        this.object = object;
        this.camera = camera;
        
        camera.rotation.copy(object.rotation);
        camera.position.copy(object.position);

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
            this.velocity.set(0, 0, 0);
        });

        const { input } = BlockJS;

        input.bindMouseMove('camera', this.onMouseMove.bind(this));
        input.bindAction(InputAction.MOVE_FORWARD, () => this.forward = true, () => this.forward = false);
        input.bindAction(InputAction.MOVE_BACKWARD, () => this.backward = true, () => this.backward = false);
        input.bindAction(InputAction.MOVE_LEFT, () => this.left = true, () => this.left = false);
        input.bindAction(InputAction.MOVE_RIGHT, () => this.right = true, () => this.right = false);
        input.bindAction(InputAction.MOVE_UP, () => this.up = true, () => this.up = false);
        input.bindAction(InputAction.MOVE_DOWN, () => this.down = true, () => this.down = false);
    }

    private onMouseMove(event: MouseEvent) {
        const { movementX, movementY } = event;

        _eulerCamera.setFromQuaternion(this.camera.quaternion);
        _eulerPlayer.setFromQuaternion(this.object.quaternion);

        _eulerPlayer.y -= movementX * 0.002 * this.pointerSpeed;
        _eulerCamera.x -= movementY * 0.002 * this.pointerSpeed;

        _eulerCamera.x = Math.max(PI_2 - this.maxPolarAngle, Math.min(PI_2 - this.minPolarAngle, _eulerCamera.x));

        this.camera.quaternion.setFromEuler(_eulerCamera);
        this.object.quaternion.setFromEuler(_eulerPlayer);
    }

    public update = () => {
        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;

        this.velocity.y -= this.velocity.y * 10.0 * delta;
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.forward) - Number(this.backward);
        this.direction.x = Number(this.left) - Number(this.right);
        this.direction.y = Number(this.up) - Number(this.down);

        this.direction.normalize();

        let currentSpeed = CreativeControls.MOVEMENT_SPEED * this.movementSpeedMultiplier;

        // if (sprint && (forward || backward || left || right)) {
        //     currentSpeed *= 1.1;
        // }

        if (this.forward || this.backward) {
            this.velocity.z -= this.direction.z * currentSpeed * delta;
        }

        if (this.left || this.right) {
            this.velocity.x += this.direction.x * currentSpeed * delta;
        }

        if (this.up || this.down) {
            this.velocity.y += this.direction.y * currentSpeed * delta;
        }

        this.object.translateX(-this.velocity.x * delta);
        this.object.translateZ(this.velocity.z * delta);
        this.object.translateY(this.velocity.y * delta);

        this.prevTime = time;
    }
}