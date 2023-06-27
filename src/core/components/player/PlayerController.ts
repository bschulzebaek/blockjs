import { Camera, Euler, Object3D, Quaternion, Vector3 } from 'three';
import InputMapper from '@/core/engine/helper/InputMapper';

export enum MovementMode {
    NORMAL = 0,
    FLY = 1,
}

const PI_2 = Math.PI / 2;

const _eulerCamera = new Euler( 0, 0, 0, 'YXZ' );
const _eulerPlayer = new Euler( 0, 0, 0, 'YXZ' );

export default class PlayerController {
    static MOUSEMOVE_SPEED = 0.002;

    public name = 'player-controller';

    private speed = 200;
    private pointerSpeed = 1;
    private minPolarAngle = 0;
    private maxPolarAngle = Math.PI;

    private velocity = new Vector3();
    private direction = new Vector3();
    private pitchObject = new Object3D();

    private forward = false;
    private backward = false;
    private left = false;
    private right = false;
    private up = false;
    private down = false;

    private canJump = false;
    private sprint = false;

    constructor(
        private readonly pivot: Object3D,
        private readonly camera: Camera,
    ) {
        camera.rotation.set(0, 0, 0);
        this.pitchObject.add(camera);
        this.pitchObject.name = 'camera-controller-pitch-object';
        this.pivot.add(this.pitchObject);

        this.bindInput();
    }

    public update(delta: number) {
        const {
            velocity,
            direction,
            forward,
            backward,
            left,
            right,
            speed,
            sprint,
            up,
            down,
        } = this;

        // velocity.y -= 9.8 * 100.0 * delta;

        velocity.y -= velocity.y * 10.0 * delta;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(forward) - Number(backward);
        direction.x = Number(left) - Number(right);
        direction.y = Number(up) - Number(down);

        direction.normalize();

        let currentSpeed = speed;

        if (sprint && (forward || backward || left || right)) {
            currentSpeed *= 1.1;
        }

        if (forward || backward) velocity.z -= direction.z * currentSpeed * delta;
        if (left || right) velocity.x += direction.x * currentSpeed * delta;
        if (up || down) velocity.y += direction.y * currentSpeed * delta;

        this.pivot.translateX(-velocity.x * delta);
        this.pivot.translateZ(velocity.z * delta);
        this.pivot.translateY(velocity.y * delta);

        // this.pivot.position.y += (velocity.y * delta);
    }

    private onMouseMove(movementX: number, movementY: number) {
        const camera = this.camera;
        const pivot = this.pivot;

        _eulerCamera.setFromQuaternion( camera.quaternion );
        _eulerPlayer.setFromQuaternion( pivot.quaternion );

        _eulerPlayer.y -= movementX * 0.002 * this.pointerSpeed;
        _eulerCamera.x -= movementY * 0.002 * this.pointerSpeed;

        _eulerCamera.x = Math.max( PI_2 - this.maxPolarAngle, Math.min( PI_2 - this.minPolarAngle, _eulerCamera.x ) );

        camera.quaternion.setFromEuler( _eulerCamera );
        pivot.quaternion.setFromEuler( _eulerPlayer );
    }

    private bindInput() {
        InputMapper.subscribeMouseMove(this.onMouseMove.bind(this));

        InputMapper.subscribeKeyDown('w', () => {
            this.forward = true;
        });
        InputMapper.subscribeKeyUp('w', () => {
            this.forward = false;
        });
        InputMapper.subscribeKeyDown('s', () => {
            this.backward = true;
        });
        InputMapper.subscribeKeyUp('s', () => {
            this.backward = false;
        });
        InputMapper.subscribeKeyDown('a', () => {
            this.left = true;
        });
        InputMapper.subscribeKeyUp('a', () => {
            this.left = false;
        });
        InputMapper.subscribeKeyDown('d', () => {
            this.right = true;
        });
        InputMapper.subscribeKeyUp('d', () => {
            this.right = false;
        });
        InputMapper.subscribeKeyDown(' ', () => {
            this.up = true;
        });
        InputMapper.subscribeKeyUp(' ', () => {
            this.up = false;
        });
        InputMapper.subscribeKeyDown('shift', () => {
            this.down = true;
        });
        InputMapper.subscribeKeyUp('shift', () => {
            this.down = false;
        });
    }
}