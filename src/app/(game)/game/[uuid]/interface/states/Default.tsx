import { useContext, useEffect } from 'react';
import WorkerContext from '@/app/(game)/game/WorkerContext';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import Toolbar from '@/app/(game)/game/[uuid]/interface/components/Toolbar';
import FeatureFlags, { Features } from '@/feature-flags';
import styles from '@/styles/component/game-default.module.scss';

export default function StateDefault() {
    const worker = useContext(WorkerContext);

    useEffect(() => {
        ViewTransitions.Default_enter(worker);

        return () => {
            ViewTransitions.Default_exit(worker);
        }
    }, []);

    return (
        <>
            {/*<div className={styles.cursor}>+</div>*/}
            { FeatureFlags.get(Features.INVENTORY) ? <Toolbar /> : null }
        </>
    );
}