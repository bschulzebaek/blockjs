import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import SetupPayload from '@/core/messages/payloads/SetupPayload';
import MessagePayload from '@/core/messages/payloads/MessagePayload';
import InputPayload from '@/core/messages/payloads/InputPayload';

export default class WorkerAdapter {

    private worker: Worker;

    private callbacks: Map<string, Function> = new Map();

    constructor() {
        this.worker = new Worker(new URL('@/core/core-worker.ts', import.meta.url));

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

    public setCallback(name: CoreWorkerMessages, callback: Function) {
        this.callbacks.set(name, callback);
    }

    public start() {
        this.postMessage(CoreWorkerMessages.START);
    }

    public stop() {
        this.postMessage(CoreWorkerMessages.STOP);
    }

    public setup(payload: SetupPayload, transferables: Transferable[] = []) {
        this.postMessage(CoreWorkerMessages.SETUP, payload, transferables);
    }

    public input(payload: InputPayload) {
        this.postMessage(CoreWorkerMessages.INPUT_EVENT, payload);
    }

    private postMessage(action: CoreWorkerMessages, payload?: unknown, transferables: Transferable[] = []) {
        this.worker.postMessage({
            action,
            payload,
        }, transferables);
    }
}