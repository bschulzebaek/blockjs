import MessagePayload from '@/core/engine/messages/MessagePayloadInterface';
import WorkerMessages from '@/core/engine/messages/WorkerMessages';
import Engine from '@/core/engine/Engine';
import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import WorkerContext from '@/core/engine/WorkerContext';
import SetupPayload from '@/core/engine/messages/SetupPayload';
import InputPayload from '@/core/engine/messages/InputPayload';
import GenerationProgressPayload from '@/core/engine/messages/GenerationProgressPayload';

export default class MessageHandler {
    public onMessage = (event: MessageEvent<MessagePayload>) => {
        const { action, payload } = event.data;

        switch (action) {
            case WorkerMessages.INPUT_EVENT:
                return this.onInput(payload as InputPayload);
            case WorkerMessages.START:
                return this.onStart();
            case WorkerMessages.STOP:
                return this.onStop();
            case WorkerMessages.FRAME:
                return this.onFrame();
            case WorkerMessages.SETUP:
                return this.onSetup(payload as SetupPayload);
            default:
                console.log(event);
                throw new Error(`Unknown action: ${event.data.action}`);
        }
    }

    private onStart() {
        WorkerContext.engine?.getLoop().start();
    }

    private onStop() {
        WorkerContext.engine?.getLoop().stop();
    }

    private onFrame() {
        WorkerContext.engine?.getLoop().frame();
    }

    private async onSetup(payload: SetupPayload) {
        WorkerContext.canvas = payload.canvas;
        WorkerContext.config = WorldConfig.fromObject(payload.config as { uuid: string, seed: string, name: string });

        WorkerContext.features.setFromSearchParams(new URLSearchParams(payload.parameters));

        WorkerContext.engine = new Engine();

        await WorkerContext.engine.loadWorld();
        await WorkerContext.engine.setupScene();

        this.postMessage(WorkerMessages.READY);
    }

    private onInput(payload: InputPayload) {
        WorkerContext.input.dispatch(payload);
    }

    public sendGenerationProgress(payload: GenerationProgressPayload) {
        this.postMessage(WorkerMessages.WORLD_GENERATION_PROGRESS, payload);
    }

    private postMessage(action: WorkerMessages, payload?: unknown) {
        postMessage({
            action,
            payload,
        });
    }
}