import lifecycleTeardown from '@/engine/lifecycle/teardown';
import postTeardownComplete from '@/engine/worker/out/post-teardown-complete';

export default async function onTeardown() {
    await lifecycleTeardown();

    postTeardownComplete();
}