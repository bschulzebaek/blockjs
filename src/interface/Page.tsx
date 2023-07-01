'use client';
import InventoryMessages from '@/components/inventory/messages/InventoryMessages';
import { useEffect, useState } from 'react';
import WorkerAdapterContext from '@/interface/context/WorkerAdapterContext';
import ViewContext, { AppViews } from '@/interface/context/ViewContext';
import CanvasContext from '@/interface/context/CanvasContext';
import Interface from '@/interface/Interface';
import ViewTransitions from '@/interface/ViewTransitions';
import FeatureFlags from '@/framework/feature-flags/FeatureFlags';
import WorkerAdapter from '@/interface/WorkerAdapter';
import InventoryContext, { onReceiveInventory } from '@/interface/context/InventoryContext';

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
        adapter.setCallback(InventoryMessages.INVENTORY_TRANSFER, (data) => onReceiveInventory(data, inventories, setInventories));
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