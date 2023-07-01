export default class ProcessingQueue<T> {
    private active = false;
    private queue: any[] = [];

    constructor(
        private readonly processorCallback: (payload: T) => Promise<any> | any
    ) {

    }

    public addData = (payload: T) => {
        this.queue.push(payload);

        if (this.active) {
            return;
        }

        this.next();
    }

    private next = async () => {
        const next = this.queue.shift();

        if (!next) {
            return;
        }

        this.active = true;
        await this.processorCallback(next);
        this.active = false;

        this.next();
    }
}