'use client';
import { useContext, useEffect } from 'react';
import ViewContext, { AppViews } from './context/ViewContext';
import ViewTransitions from './ViewTransitions';

import SetupView from './views/setup/SetupView';
import MainMenuView from './views/main-menu/MainMenuView';
import DefaultView from './views/default/DefaultView';
import ReadyView from './views/ready/ReadyView';
import InventoryView from './views/inventory/InventoryView';
import TeardownView from './views/teardown/TeardownView';

export default function Interface() {
    const { view } = useContext(ViewContext);

    useEffect(() => {
        ViewTransitions.__setupInterface();

        return () => {
            ViewTransitions.__discardInterface();
        }
    }, []);

    switch (view) {
        case AppViews.SETUP:
            return <SetupView />;
        case AppViews.READY:
            return <ReadyView />;
        case AppViews.DEFAULT:
            return <DefaultView />;
        case AppViews.INVENTORY:
            return <InventoryView />;
        case AppViews.MAIN_MENU:
            return <MainMenuView />;
        case AppViews.TEARDOWN:
            return <TeardownView />;
        default:
            throw new Error(`Unknown app view "${view}"!`);
    }
}