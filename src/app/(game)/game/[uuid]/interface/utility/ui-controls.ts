import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import { AppViews } from '@/app/(game)/game/ViewContext';

const keyMap: Map<string, boolean> = new Map();

enum MAPPED_ACTIONS {
    MAIN_MENU = 'Escape',
    INVENTORY = 'e',
}

function onMenuKey() {
    const currentView = ViewTransitions.getView();
    switch (currentView) {
        case AppViews.DEFAULT:
            ViewTransitions.to_MainMenu();
            break;
        default:
            ViewTransitions.to_Default();
    }
}

function onInventoryKey() {

}

function _onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    if (keyMap.has(key)) {
        return;
    }

    keyMap.set(key, true);

    switch (key) {
        case MAPPED_ACTIONS.MAIN_MENU:
            onMenuKey();
            break;
        case MAPPED_ACTIONS.INVENTORY:
            onInventoryKey();
            break;
    }
}

function _onKeyUp(event: KeyboardEvent) {
    if (!keyMap.has(event.key)) {
        return;
    }

    keyMap.delete(event.key);
}


function bindUIControls() {
    addEventListener('keydown', _onKeyDown);
    addEventListener('keyup', _onKeyUp);
}

function releaseUIControls() {
    removeEventListener('keydown', _onKeyDown);
    removeEventListener('keyup', _onKeyUp);
}

export {
    bindUIControls,
    releaseUIControls,
}