'use client';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import WorldConfigStorage from '@/shared/WorldConfigStorage';
import CanvasContext from '@/app/(game)/[uuid]/CanvasContext';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

export default function SetupView() {
    const canvas = useContext(CanvasContext)!;
    const adapter = useContext(WorkerAdapterContext);
    const [progress, setProgress] = useState('');
    const pathname = usePathname();
    const uuid = pathname.substring(pathname.lastIndexOf('/') + 1);

    useEffect(() => {
        const offscreen = canvas.transferControlToOffscreen();
        offscreen.height = canvas.clientHeight;
        offscreen.width = canvas.clientWidth;

        adapter.setCallback(CoreWorkerMessages.READY, ViewTransitions.to_Ready);
        adapter.setCallback(CoreWorkerMessages.WORLD_GENERATION_PROGRESS, ({ ready, total }: { ready: number, total: number }) => {
            setProgress((ready  / total * 100).toFixed(0));
        });

        WorldConfigStorage.get(uuid).then((config) => {
            adapter.setup({
                parameters: location.search,
                canvas: offscreen,
                config,
            }, [ offscreen ]);
        });
    }, []);

    return (
        <div className={'center-absolute'}>
            <h2>Generating World</h2>
            <h3>{ progress !== '' ? `${progress}%` : <div>&nbsp;</div> }</h3>
        </div>
    );
}