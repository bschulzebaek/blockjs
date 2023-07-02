export default class ProcessingQueue<T> {
    private active = false;
    private queue: T[] = [];

    private promise: Promise<void> | null = null;
    private resolver: (() => void) | null = null

    constructor(
        private readonly processorCallback: (payload: T) => Promise<any> | any,
    ) {

    }

    public start() {
        if (this.active) {
            return this.promise;
        }

        this.promise = new Promise((resolve) => {
            this.resolver = resolve;
        });

        this.next();

        return this.promise;
    }

    public addData = (...payload: T[]) => {
        this.queue.push(...payload);

        if (this.active) {
            return;
        }

        this.next();
    }

    public addDataBeforeStart = (payload: T) => {
        this.queue.push(payload);
    }

    private next = async () => {
        const next = this.queue.shift();

        if (!next) {
            return this.resolver ? this.resolver() : null;
        }

        this.active = true;
        await this.processorCallback(next);
        this.active = false;

        this.next();
    }
}