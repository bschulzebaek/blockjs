import { useContext, useEffect } from 'react';
import ViewTransitions from '../../ViewTransitions';
import Toolbar from '@/components/inventory/interface/toolbar/Toolbar';
import FeatureFlags, { Features } from '@/framework/feature-flags/FeatureFlags';
import WorkerAdapterContext from '../../context/WorkerAdapterContext';
import styles from '@/interface/views/default/default-view.module.scss';

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