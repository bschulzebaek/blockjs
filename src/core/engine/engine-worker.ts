import { WorldConfig } from '../storage/WorldConfigStorage';
import Engine from './Engine';
import MessagePayload from '../../shared/worker/MessagePayloadInterface';
import InputMapper from '@/core/engine/InputMapper';
import WorkerMessages from '@/app/(game)/game/WorkerMessages';

// @ts-ignore
globalThis.__inputMapper = new InputMapper();

let engine: Engine | null = null;

onmessage = (event: MessageEvent<MessagePayload>) => {
    switch (event.data.action) {
        case 'input-event':
            // @ts-ignore
            globalThis.__inputMapper.dispatch(event.data.data);
            break;
        case WorkerMessages.START:
            if (!isReady()) {
                console.log(engine)
                throw new Error('Engine not ready!');
            }

            engine?.getLoop().start();

            break;
        case 'set-config':
            if (config.worldConfig) {
                return;
            }

            config.worldConfig = WorldConfig.fromObject(event.data.data);

            if (isReady()) {
                setupEngine();

                postMessage({
                    action: 'ready',
                });
            }
            break;
        case 'set-canvas':
            if (config.canvas) {
                return;
            }

            config.canvas = event.data.data;

            if (isReady()) {
                setupEngine();

                postMessage({
                    action: 'ready',
                });
            }
            break;
        case WorkerMessages.FRAME:
            if (isReady()) {
                engine?.getLoop().frame();
            }
            break;
        case WorkerMessages.STOP:
            engine?.getLoop().stop();
            break;
        default:
            console.error(`Unknown action: ${event.data.action}`);
            console.log(event);
    }
};

interface EngineConfig {
    canvas: OffscreenCanvas | null;
    worldConfig: WorldConfig | null;
}

const config: EngineConfig = {
    canvas: null,
    worldConfig: null,
};

function isReady() {
    return config.canvas && config.worldConfig;
}


const setupEngine = () => {
    engine = new Engine(
        config.canvas!,
        config.worldConfig!,
    );

    // @ts-ignore
    globalThis.__engine = engine;
}