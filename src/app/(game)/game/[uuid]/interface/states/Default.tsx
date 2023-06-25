import { useContext, useEffect } from 'react';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import Toolbar from '@/app/(game)/game/[uuid]/interface/components/Toolbar';
import FeatureFlags, { Features } from '@/feature-flags';
import WorkerAdapterContext from '@/app/(game)/game/WorkerAdapterContext';

export default function StateDefault() {
    const adapter = useContext(WorkerAdapterContext);

    useEffect(() => {
        ViewTransitions.Default_enter(adapter);

        return () => {
            ViewTransitions.Default_exit(adapter);
        }
    }, []);

    return (
        <>
            {/*<div className={styles.cursor}>+</div>*/}
            { FeatureFlags.get(Features.INVENTORY) ? <Toolbar /> : null }
        </>
    );
}