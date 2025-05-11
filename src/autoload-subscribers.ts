const subscribers = import.meta.glob('./**/*Subscriber.ts');

for (const [_path, subscriber] of Object.entries(subscribers)) {
    subscriber();
}