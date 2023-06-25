import WorkerMessages from '@/core/engine/messages/WorkerMessages';
import SetupPayload from '@/core/engine/messages/SetupPayload';
import MessagePayload from '@/core/engine/messages/MessagePayloadInterface';
import InputPayload from '@/core/engine/messages/InputPayload';

export default class WorkerAdapter {

    private worker: Worker;

    private callbacks: Map<string, Function> = new Map();

    constructor() {
        this.worker = new Worker(new URL('@/core/engine/engine-worker.ts', import.meta.url));

        this.worker.onmessage = this.onMessage.bind(this);
    }

    private onMessage = (event: MessageEvent<MessagePayload>) => {
        const { action, payload } = event.data;
        const callback = this.callbacks.get(action);

        if (!callback) {
            return;
        }

        callback(payload);
    }

    public setCallback(name: WorkerMessages, callback: Function) {
        this.callbacks.set(name, callback);
    }

    public renderFrame() {
        this.postMessage(WorkerMessages.FRAME);
    }

    public start() {
        this.postMessage(WorkerMessages.START);
    }

    public stop() {
        this.postMessage(WorkerMessages.STOP);
    }

    public setup(payload: SetupPayload, transferables: Transferable[] = []) {
        this.postMessage(WorkerMessages.SETUP, payload, transferables);
    }

    public input(payload: InputPayload) {
        this.postMessage(WorkerMessages.INPUT_EVENT, payload);
    }

    private postMessage(action: WorkerMessages, payload?: unknown, transferables: Transferable[] = []) {
        this.worker.postMessage({
            action,
            payload,
        }, transferables);
    }
}