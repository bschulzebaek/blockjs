'use client';
import WorldConfigStorage from '@/core/storage/WorldConfigStorage';
import { useEffect, useState } from 'react';
import initScene from '@/core/engine/init-scene';
import styles from '@/styles/page/game-instance.module.scss';

export default function GamePage({ params }: { params: { uuid: string } }) {
    const [loading, setLoading] = useState(true);
    const { uuid } = params;

    useEffect(() => {
        (async () => {
            const config = await WorldConfigStorage.get(uuid);
            await initScene(document.querySelector('canvas')!, config);

            setLoading(false);
        })();
    }, []);

    return (
        <div className={styles.gameInstance}>
            { loading ? 'Loading...' : null }
        </div>
    );
}