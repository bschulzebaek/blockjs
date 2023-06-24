'use client';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import WorldConfigStorage from '@/core/storage/WorldConfigStorage';
import CanvasContext from '@/app/(game)/game/CanvasContext';
import WorkerContext from '@/app/(game)/game/WorkerContext';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';

export default function StateSetup() {
    const canvas = useContext(CanvasContext)!;
    const worker = useContext(WorkerContext);
    const [progress, setProgress] = useState('');
    const pathname = usePathname();
    const uuid = pathname.substring(pathname.lastIndexOf('/') + 1);

    useEffect(() => {
        const offscreen = canvas.transferControlToOffscreen();
        offscreen.height = canvas.clientHeight;
        offscreen.width = canvas.clientWidth;

        worker.postMessage({
            action: 'set-canvas',
            data: offscreen,
        }, [ offscreen ]);
    }, []);

    useEffect(() => {
        WorldConfigStorage.get(uuid).then((config) => {
            worker.postMessage({
                action: 'set-config',
                data: config,
            });
        });
    }, []);

    useEffect(() => {
        worker.onmessage = async (event) => {
            switch (event.data.action) {
                case 'ready':
                    ViewTransitions.to_Ready();
                    break;
                case 'world-generation-progress':
                    setProgress((event.data.data.ready  / event.data.data.total * 100).toFixed(0));
                    break;
            }
        };
    }, []);

    return (
        <div className={'center-absolute'}>
            <h2>Generating World</h2>
            <h3>{ progress !== '' ? `${progress}%` : <div>&nbsp;</div> }</h3>
        </div>
    );
}