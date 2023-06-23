let _worker: Worker | null = null;

export function createEventTunnel(worker: Worker) {
    _worker = worker;

    addEventListener('keypress', passKeyboardEvent);
    addEventListener('keydown', passKeyboardEvent);
    addEventListener('keyup', passKeyboardEvent);
    addEventListener('click', passPointerEvent);
    addEventListener('contextmenu', passPointerEvent);
    addEventListener('mousemove', passMouseEvent);
}

export function discardEventTunnel() {
    _worker = null;

    removeEventListener('keypress', passKeyboardEvent);
    removeEventListener('keydown', passKeyboardEvent);
    removeEventListener('keyup', passKeyboardEvent);
    removeEventListener('click', passPointerEvent);
    removeEventListener('contextmenu', passPointerEvent);
    removeEventListener('mousemove', passMouseEvent);
}

function passKeyboardEvent(event: KeyboardEvent) {
    if (!document.pointerLockElement) {
        return;
    } else {
        event.preventDefault();
    }

    const { type, key, shiftKey } = event;

    sendInputEvent({
        type,
        key: key.toLowerCase(),
        shiftKey,
    });
}

function passPointerEvent(event: MouseEvent) {
    if (!document.pointerLockElement) {
        return;
    } else {
        event.preventDefault();
    }

    const { type, button, shiftKey } = event;

    sendInputEvent({
        type,
        button,
        shiftKey,
    });
}

function passMouseEvent(event: MouseEvent) {
    if (!document.pointerLockElement) {
        return;
    } else {
        event.preventDefault();
    }

    const { type, movementX, movementY } = event;

    sendInputEvent({
        type,
        movementX,
        movementY
    });
}

function sendInputEvent(eventDetail: object) {
    _worker!.postMessage({
        action: 'input-event',
        data: eventDetail
    });
}