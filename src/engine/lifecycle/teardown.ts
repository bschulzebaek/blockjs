import TeardownEvent from '@/engine/events/TeardownEvent';

export default async function lifecycleTeardown() {
    const start = performance.now();
    const promises: Promise<any>[] = [];
    console.debug('[Teardown] Start');

    dispatchEvent(new TeardownEvent(promises));

    await Promise.all(promises);

    console.debug(`[Teardown] End - ${((performance.now() - start) / 1000).toFixed(3)}s`);
}