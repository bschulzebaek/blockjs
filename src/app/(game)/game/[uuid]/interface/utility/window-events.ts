import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';

function _onFullScreenChange() {
    if (!document.fullscreenElement || !document.pointerLockElement) {
        // ViewTransitions.to_MainMenu();
    } else {

    }
}

function addWindowEvents() {
    addEventListener('fullscreenchange', _onFullScreenChange);
}

function removeWindowEvents() {
    removeEventListener('fullscreenchange', _onFullScreenChange);
}

export {
    addWindowEvents,
    removeWindowEvents,
}