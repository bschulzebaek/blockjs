import loadSubscriber from './subscriber.ts';

await loadSubscriber().then(() => {
    import('./framework/BlockJS');
    import('./interface');
})

