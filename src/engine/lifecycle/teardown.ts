import TeardownEvent from '@/engine/events/TeardownEvent';

export default async function lifecycleTeardown() {
    const start = performance.now();
    const promises: Promise<any>[] = [];

    dispatchEvent(new TeardownEvent(promises));

    await Promise.all(promises);

    console.debug(`[Teardown] Done in ${((performance.now() - start) / 1000).toFixed(3)}s`);
}