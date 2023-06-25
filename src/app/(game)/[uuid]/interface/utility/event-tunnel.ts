import PointerLock from '@/app/(game)/[uuid]/interface/utility/PointerLock';
import WorkerAdapter from '@/app/(game)/[uuid]/WorkerAdapter';
import InputPayload from '@/core/engine/messages/InputPayload';

let _adapter: WorkerAdapter | null = null;

export function openEventTunnel(adapter: WorkerAdapter) {
    _adapter = adapter;

    addEventListener('keypress', passKeyboardEvent);
    addEventListener('keydown', passKeyboardEvent);
    addEventListener('keyup', passKeyboardEvent);
    addEventListener('click', passPointerEvent);
    addEventListener('mousemove', passMouseEvent);
}

export function closeEventTunnel() {
    _adapter = null;

    removeEventListener('keypress', passKeyboardEvent);
    removeEventListener('keydown', passKeyboardEvent);
    removeEventListener('keyup', passKeyboardEvent);
    removeEventListener('click', passPointerEvent);
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

function sendInputEvent(eventDetail: unknown) {
    // Don't wrap in if, since it will be checked on every mousemove event!
    _adapter!.input(eventDetail as InputPayload);
}