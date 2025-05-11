import Controls from './Controls.ts';

export default class CreativeControls extends Controls {
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

        let currentSpeed = Controls.MOVEMENT_SPEED * this.movementSpeedMultiplier;

        if (this.sprint && (this.forward || this.backward || this.left || this.right)) {
            currentSpeed *= this.sprintMultiplier;
        }

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