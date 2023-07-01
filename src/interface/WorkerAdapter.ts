import InventoryMessages from '@/components/inventory/messages/InventoryMessages';
import EngineMessages from '@/engine/worker/EngineMessages';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import MessagePayload from '@/engine/worker/payloads/MessagePayload';
import InputPayload from '@/engine/worker/payloads/InputPayload';
import ActiveItemPayload from '@/components/inventory/ActiveItemPayload';
import InventorySwapPayload from '@/components/inventory/InventorySwapPayload';

export default class WorkerAdapter {

    private worker: Worker;

    private callbacks: Map<string, Function> = new Map();

    constructor() {
        this.worker = new Worker(new URL('@/engine/worker/index.ts', import.meta.url));

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

    public terminateWorker() {
        this.worker.terminate();
        this.callbacks = new Map();
    }

    public setCallback(name: EngineMessages | InventoryMessages, callback: Function) {
        this.callbacks.set(name, callback);
    }

    public start() {
        this.postMessage(EngineMessages.START);
    }

    public stop() {
        this.postMessage(EngineMessages.STOP);
    }

    public setup(payload: SetupPayload, transferables: Transferable[] = []) {
        this.postMessage(EngineMessages.SETUP, payload, transferables);
    }

    public input(payload: InputPayload) {
        this.postMessage(EngineMessages.INPUT_EVENT, payload);
    }

    public teardown() {
        this.postMessage(EngineMessages.TEARDOWN);
    }

    public setActiveItem(payload: ActiveItemPayload) {
        this.postMessage(InventoryMessages.INVENTORY_SET_INDEX, payload);
    }

    public swapInventoryPositions(payload: InventorySwapPayload) {
        this.postMessage(InventoryMessages.INVENTORY_SWAP, payload);
    }

    private postMessage(action: EngineMessages | InventoryMessages, payload?: unknown, transferables: Transferable[] = []) {
        this.worker.postMessage({
            action,
            payload,
        }, transferables);
    }
}