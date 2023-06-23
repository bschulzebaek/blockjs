import { WorldConfig } from '../storage/WorldConfigStorage';
import Engine from './Engine';
import MessagePayload from '../../shared/worker/MessagePayloadInterface';
import InputMapper from '@/core/engine/InputMapper';

// @ts-ignore
globalThis.__inputMapper = new InputMapper();

let engine: Engine | null = null;

onmessage = (event: MessageEvent<MessagePayload>) => {
    switch (event.data.action) {
        case 'input-event':
            // @ts-ignore
            globalThis.__inputMapper.dispatch(event.data.data);
            break;
        case 'start':
            if (!isReady()) {
                throw new Error('Engine config not ready!');
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