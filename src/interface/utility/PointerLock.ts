export default class PointerLock {
    static enter() {
        if (PointerLock.active()) {
            return;
        }

        return document.body.requestPointerLock();
    }

    static exit() {
        if (!PointerLock.active()) {
            return;
        }

        document.exitPointerLock();
    }

    static active() {
        return !!document.pointerLockElement;
    }
}