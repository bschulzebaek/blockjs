'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/page/game-instance.module.scss';
import WorldConfigStorage from '@/core/storage/WorldConfigStorage';
import { createEventTunnel, discardEventTunnel } from './create-event-tunnel';
import preventDefaults from '@/app/(game)/game/[uuid]/prevent-defaults';

export default function GamePage({ params }: { params: { uuid: string } }) {
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(true);
    const { uuid } = params;

    useEffect(() => {
        const canvas = document.querySelector('canvas')!;
        const offscreen = canvas.transferControlToOffscreen();
        offscreen.height = canvas.clientHeight;
        offscreen.width = canvas.clientWidth;

        const worker = new Worker(new URL('@/core/engine/engine-worker.ts', import.meta.url));

        worker.onmessage = async (event) => {
            switch (event.data.action) {
                case 'ready':
                    preventDefaults();

                    worker.postMessage({
                        action: 'start',
                    });

                    setLoading(false);
                    createEventTunnel(worker);
                    break;
                case 'world-generation-progress':
                    setProgress((event.data.data.ready  / event.data.data.total * 100).toFixed(0));
                    break;
            }
        };

        WorldConfigStorage.get(uuid).then((config) => {
            worker.postMessage({
                action: 'set-config',
                data: config,
            });
        });

        worker.postMessage({
            action: 'set-canvas',
            data: offscreen,
        }, [ offscreen ]);

        canvas.addEventListener('click', () => {
            canvas.requestPointerLock();
        });

        return () => {
            worker.terminate();
            discardEventTunnel();
        };
    }, []);

    return (
        <div className={styles.gameInstance}>
            { loading ? <h2>Generating World</h2> : null }
            { loading && progress ? <h3>{ progress }%</h3> : null }
        </div>
    );
}