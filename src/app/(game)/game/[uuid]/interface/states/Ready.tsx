import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import { useContext, useEffect } from 'react';
import WorkerAdapterContext from '@/app/(game)/game/WorkerAdapterContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from '@/app/styles/component/ready.module.scss';

export default function StateReady() {
    const adapter = useContext(WorkerAdapterContext);

    useEffect(() => {
        ViewTransitions.Ready_enter(adapter);
    }, []);

    return (
        <>
            <div className={'backdrop backdrop-7'}></div>

            <div className={styles.content + ' center-absolute'}>
                <h2>Your world is ready</h2>

                <div className={styles.playButton + ' text-center'}>
                    <FontAwesomeIcon icon={ faPlay } onClick={ViewTransitions.to_Default} />
                </div>
            </div>
        </>
    );
}