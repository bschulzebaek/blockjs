export default async function loadSubscriber() {
    const subscriber = import.meta.glob('./**/*Subscriber.ts');
    
    const promises: Promise<any>[] = [];
    
    for (const path in subscriber) {
        if (subscriber[path]) {
            promises.push(subscriber[path]());
        }
    }
    
    await Promise.all(promises);
}