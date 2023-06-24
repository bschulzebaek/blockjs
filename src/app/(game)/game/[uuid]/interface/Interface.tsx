'use client';
import { useContext, useEffect } from 'react';
import StateSetup from '@/app/(game)/game/[uuid]/interface/states/Setup';
import StateDefault from '@/app/(game)/game/[uuid]/interface/states/Default';
import StateMainMenu from '@/app/(game)/game/[uuid]/interface/states/MainMenu';
import ViewContext, { AppViews } from '@/app/(game)/game/ViewContext';
import StateReady from '@/app/(game)/game/[uuid]/interface/states/Ready';
import StateTeardown from '@/app/(game)/game/[uuid]/interface/states/Teardown';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';

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
            return <StateSetup />;
        case AppViews.READY:
            return <StateReady />;
        case AppViews.DEFAULT:
            return <StateDefault />;
        case AppViews.MAIN_MENU:
            return <StateMainMenu />;
        case AppViews.TEARDOWN:
            return <StateTeardown />;
        default:
            throw new Error(`Unknown app view "${view}"!`);
    }
}