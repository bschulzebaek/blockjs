import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StateTeardown() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            router.push('/');
        })();
    }, []);

    return (
        <>
            <div className={'backdrop backdrop-7'}></div>
            <div className={'center-absolute'}>
                <h1>Saving ...</h1>
            </div>
        </>
    );
}