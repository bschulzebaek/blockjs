import { Context, createContext } from 'react';

enum AppViews {
    TEARDOWN = -2,
    SETUP = -1,
    READY = 0,
    DEFAULT = 1,
    MAIN_MENU = 2,
    INVENTORY = 3,
}

type ViewContextType = Context<{view: AppViews, setView: (view: AppViews) => void}>;

// @ts-ignore
const ViewContext: ViewContextType = createContext({
    view: AppViews.SETUP,
    setView: (view: AppViews) => {},
});

export {
    ViewContext as default,
    AppViews,
}