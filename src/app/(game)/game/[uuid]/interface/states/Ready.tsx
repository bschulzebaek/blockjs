import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import { useContext, useEffect } from 'react';
import WorkerContext from '@/app/(game)/game/WorkerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/component/ready.module.scss';

export default function StateReady() {
    const worker = useContext(WorkerContext);

    useEffect(() => {
        ViewTransitions.Ready_enter(worker);
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