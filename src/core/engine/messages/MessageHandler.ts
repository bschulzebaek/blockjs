import MessagePayload from '@/core/engine/messages/MessagePayloadInterface';
import WorkerMessages from '@/core/engine/messages/WorkerMessages';
import Engine from '@/core/engine/Engine';
import { WorldConfig } from '@/core/WorldConfigStorage';
import WorkerContext from '@/core/engine/WorkerContext';
import SetupPayload from '@/core/engine/messages/SetupPayload';
import InputPayload from '@/core/engine/messages/InputPayload';
import GenerationProgressPayload from '@/core/engine/messages/GenerationProgressPayload';
import firstTimeSetup from '@/core/engine/storage/first-time-setup';

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

    private async onSetup(payload: SetupPayload) {
        WorkerContext.canvas = payload.canvas;
        WorkerContext.config = WorldConfig.fromObject(payload.config as { uuid: string, seed: string, name: string });

        WorkerContext.features.setFromSearchParams(new URLSearchParams(payload.parameters));

        WorkerContext.engine = new Engine();

        await firstTimeSetup(WorkerContext.config.getUUID());
        await WorkerContext.engine.getWorld().setup();
        await WorkerContext.engine.getScene().setup(WorkerContext.engine.getWorld());

        this.renderFrame();

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

    private renderFrame() {
        const renderer = WorkerContext.engine.getRenderer();
        const camera = WorkerContext.engine.getScene().getMainCamera();
        const scene = WorkerContext.engine.getScene();

        if (!camera) {
            throw new Error('MainCamera not set!');
        }

        renderer.render(scene, camera);
    }
}