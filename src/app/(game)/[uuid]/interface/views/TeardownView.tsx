import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TeardownView() {
    const router = useRouter();
    const query = useParams();

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            router.push('/', {
                query,
            });
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