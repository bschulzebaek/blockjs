'use client';
import { useEffect, useState } from 'react';
import WorkerContext from '@/app/(game)/game/WorkerContext';
import ViewContext, { AppViews } from '@/app/(game)/game/ViewContext';
import CanvasContext from '@/app/(game)/game/CanvasContext';
import Interface from '@/app/(game)/game/[uuid]/interface/Interface';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';

export default function GamePage() {
    const [worker] = useState(new Worker(new URL('@/core/engine/engine-worker.ts', import.meta.url)));
    const [view, setView] = useState(AppViews.SETUP);
    const [canvas, setCanvas] = useState(
        null as unknown as HTMLCanvasElement
    );

    useEffect(() => {
        ViewTransitions.contextSetter(setView);
        setCanvas(document.querySelector('canvas')!);
    }, []);

    useEffect(() => {
        ViewTransitions.setView(view);
    }, [ view ]);

    return (
        <WorkerContext.Provider value={worker}>
            <CanvasContext.Provider value={canvas}>
                <ViewContext.Provider value={{ view, setView }}>

                    { canvas ? <Interface /> : null }

                </ViewContext.Provider>
            </CanvasContext.Provider>
        </WorkerContext.Provider>
    );
}