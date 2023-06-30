'use client';
import { useContext, useEffect } from 'react';
import ViewContext, { AppViews } from '@/app/(game)/[uuid]/ViewContext';
import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';

import SetupView from '@/app/(game)/[uuid]/interface/views/SetupView';
import MainMenuView from '@/app/(game)/[uuid]/interface/views/MainMenuView';
import DefaultView from '@/app/(game)/[uuid]/interface/views/DefaultView';
import ReadyView from '@/app/(game)/[uuid]/interface/views/ReadyView';
import InventoryView from '@/core/components/inventory/ui/InventoryView';
import TeardownView from '@/app/(game)/[uuid]/interface/views/TeardownView';

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