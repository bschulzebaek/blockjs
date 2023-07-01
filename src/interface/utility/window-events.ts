import ViewTransitions from '../ViewTransitions';
import SettingsStorage from '@/shared/settings/SettingsStorage';

function _onFullScreenChange() {
    if (!document.fullscreenElement || !document.pointerLockElement) {
        // ViewTransitions.to_MainMenu();
    } else {

    }
}

function _onResize() {
    const canvas = document.querySelector('canvas')!;
    const settings = SettingsStorage.get();

    canvas.style.aspectRatio = `${settings.getResolutionX()} / ${settings.getResolutionY()}`;
}

function addWindowEvents() {
    addEventListener('fullscreenchange', _onFullScreenChange);
    addEventListener('resize', _onResize);
}

function removeWindowEvents() {
    removeEventListener('fullscreenchange', _onFullScreenChange);
    removeEventListener('resize', _onResize);
}

export {
    addWindowEvents,
    removeWindowEvents,
}