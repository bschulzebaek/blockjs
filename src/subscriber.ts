const subscriber = import.meta.glob('./**/*Subscriber.ts');

for (const path in subscriber) {
    if (subscriber[path]) {
        subscriber[path]();
    }
}