import FeatureFlags, { Features } from '@/framework/feature-flags/FeatureFlags';
import { AppViews } from './context/ViewContext';
import { closeEventTunnel, openEventTunnel } from './utility/event-tunnel';
import Fullscreen from './utility/Fullscreen';
import PointerLock from './utility/PointerLock';
import { preventDefaults, releaseDefaults } from './utility/prevent-defaults';
import { bindUIControls, releaseUIControls } from './utility/ui-controls';
import { addWindowEvents, removeWindowEvents } from './utility/window-events';
import WorkerAdapter from './WorkerAdapter';

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
        if (FeatureFlags.get(Features.DEBUG)) {
            console.debug(`[ViewTransition] ${payload}`);
        }
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

    public to_Inventory = () => {
        this.debug('to_Inventory');
        this.contextSetterFn(AppViews.INVENTORY);
    }
}

export default new ViewTransitions()