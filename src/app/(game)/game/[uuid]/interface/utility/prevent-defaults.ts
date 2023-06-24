function _wheelListener(event: WheelEvent) {
    event.preventDefault();
}

function _contextmenuListener(event: MouseEvent) {
    event.preventDefault();
}

function preventDefaults() {
    // @ts-ignore
    navigator.keyboard?.lock(['Escape']);

    addEventListener('wheel', _wheelListener, { passive: false });
    addEventListener('contextmenu', _contextmenuListener);
}

function releaseDefaults() {
    // @ts-ignore
    navigator.keyboard?.unlock(['Escape']);

    removeEventListener('wheel', _wheelListener);
    removeEventListener('contextmenu', _contextmenuListener);
}

export {
    preventDefaults,
    releaseDefaults,
}