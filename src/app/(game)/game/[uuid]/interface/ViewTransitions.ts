import { AppViews } from '@/app/(game)/game/ViewContext';
import Fullscreen from '@/app/(game)/game/[uuid]/interface/utility/Fullscreen';
import PointerLock from '@/app/(game)/game/[uuid]/interface/utility/PointerLock';
import { closeEventTunnel, openEventTunnel } from '@/app/(game)/game/[uuid]/interface/utility/event-tunnel';
import { addWindowEvents, removeWindowEvents } from '@/app/(game)/game/[uuid]/interface/utility/window-events';
import { bindUIControls, releaseUIControls } from '@/app/(game)/game/[uuid]/interface/utility/ui-controls';
import { preventDefaults, releaseDefaults } from '@/app/(game)/game/[uuid]/interface/utility/prevent-defaults';
import WorkerAdapter from '@/app/(game)/game/[uuid]/WorkerAdapter';

class ViewTransitions {
    private view: AppViews = AppViews.SETUP;
    private contextSetterFn: (view: AppViews) => void = () => null;

    public setView(view: AppViews) {
        this.view = view;
    }

    public getView() {
        return this.view;
    }

    private debug = (payload: any) => {
        console.debug(`[ViewTransition] ${payload}`);
    }

    public __setupInterface() {
        addWindowEvents();
        bindUIControls();
        preventDefaults();
    }

    public __discardInterface() {
        releaseDefaults();
        releaseUIControls();
        removeWindowEvents();
    }

    public contextSetter(fn: (view: AppViews) => void) {
        this.contextSetterFn = fn;
    }

    public to_Ready = () => {
        this.debug('to_Ready');
        this.contextSetterFn(AppViews.READY);
    }

    public Ready_enter = (adapter: WorkerAdapter) => {
        this.debug('Ready_enter');
        adapter.renderFrame();
    }

    public Default_enter = (adapter: WorkerAdapter) => {
        this.debug('Default_enter');

        if (!Fullscreen.active() || !PointerLock.active()) {
            return this.to_MainMenu();
        }

        openEventTunnel(adapter);

        adapter.start();
    }

    public Default_exit = (adapter: WorkerAdapter) => {
        this.debug('Default_exit');

        adapter.stop();

        closeEventTunnel();
        PointerLock.exit();
    }

    public to_Default = async () => {
        this.debug('to_Default');

        await PointerLock.enter();
        await Fullscreen.enter();

        this.contextSetterFn(AppViews.DEFAULT);
    }

    public to_Teardown = () => {
        this.debug('to_Teardown');
        this.contextSetterFn(AppViews.TEARDOWN);
    }

    public to_MainMenu = () => {
        this.debug('to_MainMenu');
        this.contextSetterFn(AppViews.MAIN_MENU);
    }
}

export default new ViewTransitions()