import EngineMessages from '@/engine/worker/EngineMessages';
import WorkerAdapterContext from '@/interface/context/WorkerAdapterContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useContext } from 'react';

export default function TeardownView() {
    const adapter = useContext(WorkerAdapterContext);
    const router = useRouter();
    const query = useParams();

    useEffect(() => {
        adapter.setCallback(EngineMessages.TEARDOWN_COMPLETE, () => {
            adapter.terminateWorker();

            router.push('/', {
                query,
            });
        });

        adapter.teardown();
    }, []);

    return (
        <>
            <div className={'backdrop backdrop-10'}></div>
            <div className={'center-absolute'}>
                <h1>Saving ...</h1>
            </div>
        </>
    );
}