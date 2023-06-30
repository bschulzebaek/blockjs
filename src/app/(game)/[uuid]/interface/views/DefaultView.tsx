import { useContext, useEffect } from 'react';
import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';
import Toolbar from '@/core/components/inventory/ui/Toolbar';
import FeatureFlags, { Features } from '@/shared/FeatureFlags';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import styles from '@/app/styles/component/game-default.module.scss';

export default function DefaultView() {
    const adapter = useContext(WorkerAdapterContext);

    useEffect(() => {
        ViewTransitions.Default_enter(adapter);

        return () => {
            ViewTransitions.Default_exit(adapter);
        }
    }, []);

    return (
        <>
            <div className={styles.cursor}>+</div>
            { FeatureFlags.get(Features.INVENTORY) ? <Toolbar /> : null }
        </>
    );
}