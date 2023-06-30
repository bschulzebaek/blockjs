'use client';
import { useContext, useEffect, useState } from 'react';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import ViewContext, { AppViews } from '@/app/(game)/[uuid]/ViewContext';
import CanvasContext from '@/app/(game)/[uuid]/CanvasContext';
import Interface from '@/app/(game)/[uuid]/interface/Interface';
import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';
import FeatureFlags from '@/shared/FeatureFlags';
import WorkerAdapter from '@/app/(game)/[uuid]/WorkerAdapter';
import InventoryContext, { onReceiveInventory } from '@/app/(game)/[uuid]/InventoryContext';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

export default function GamePage() {
    const [adapter, setAdapter] = useState(null as unknown as WorkerAdapter);
    const [view, setView] = useState(AppViews.SETUP);
    const [canvas, setCanvas] = useState(
        null as unknown as HTMLCanvasElement
    );
    const [inventories, setInventories] = useState(InventoryContext);

    useEffect(() => {
        FeatureFlags.setFromSearchParams(new URLSearchParams(window.location.search));
        setAdapter(new WorkerAdapter());
        ViewTransitions.contextSetter(setView);
        setCanvas(document.querySelector('canvas')!);
    }, []);

    useEffect(() => {
        if (!adapter) {
            return;
        }

        // @ts-ignore
        adapter.setCallback(CoreWorkerMessages.INVENTORY_TRANSFER, (data) => onReceiveInventory(data, inventories, setInventories));
    }, [ adapter ]);

    useEffect(() => {
        ViewTransitions.setView(view);
    }, [ view ]);

    return (
        <WorkerAdapterContext.Provider value={adapter}>
            <CanvasContext.Provider value={canvas}>
                <ViewContext.Provider value={{ view, setView }}>
                    <InventoryContext.Provider value={inventories}>

                    { canvas && adapter ? <Interface /> : null }

                    </InventoryContext.Provider>
                </ViewContext.Provider>
            </CanvasContext.Provider>
        </WorkerAdapterContext.Provider>
    );
}