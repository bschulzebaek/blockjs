import PointerLock from '@/app/(game)/game/[uuid]/interface/utility/PointerLock';

let _worker: Worker | null = null;

export function openEventTunnel(worker: Worker) {
    _worker = worker;

    addEventListener('keypress', passKeyboardEvent);
    addEventListener('keydown', passKeyboardEvent);
    addEventListener('keyup', passKeyboardEvent);
    addEventListener('click', passPointerEvent);
    addEventListener('contextmenu', passPointerEvent);
    addEventListener('mousemove', passMouseEvent);
}

export function closeEventTunnel() {
    _worker = null;

    removeEventListener('keypress', passKeyboardEvent);
    removeEventListener('keydown', passKeyboardEvent);
    removeEventListener('keyup', passKeyboardEvent);
    removeEventListener('click', passPointerEvent);
    removeEventListener('contextmenu', passPointerEvent);
    removeEventListener('mousemove', passMouseEvent);
}

const RESERVED_KEYS = ['Escape', 'e'];

function passKeyboardEvent(event: KeyboardEvent) {
    if (!PointerLock.active() || RESERVED_KEYS.includes(event.key)) {
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
    if (!PointerLock.active()) {
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
    if (!PointerLock.active()) {
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