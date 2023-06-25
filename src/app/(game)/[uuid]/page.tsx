'use client';
import { useEffect, useState } from 'react';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import ViewContext, { AppViews } from '@/app/(game)/[uuid]/ViewContext';
import CanvasContext from '@/app/(game)/[uuid]/CanvasContext';
import Interface from '@/app/(game)/[uuid]/interface/Interface';
import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';
import FeatureFlags from '@/feature-flags';
import WorkerAdapter from '@/app/(game)/[uuid]/WorkerAdapter';

export default function GamePage() {
    const [adapter, setAdapter] = useState(null as unknown as WorkerAdapter);
    const [view, setView] = useState(AppViews.SETUP);
    const [canvas, setCanvas] = useState(
        null as unknown as HTMLCanvasElement
    );

    useEffect(() => {
        FeatureFlags.setFromSearchParams(new URLSearchParams(window.location.search));
        setAdapter(new WorkerAdapter());
        ViewTransitions.contextSetter(setView);
        setCanvas(document.querySelector('canvas')!);
    }, []);

    useEffect(() => {
        ViewTransitions.setView(view);
    }, [ view ]);

    return (
        <WorkerAdapterContext.Provider value={adapter}>
            <CanvasContext.Provider value={canvas}>
                <ViewContext.Provider value={{ view, setView }}>

                    { canvas && adapter ? <Interface /> : null }

                </ViewContext.Provider>
            </CanvasContext.Provider>
        </WorkerAdapterContext.Provider>
    );
}