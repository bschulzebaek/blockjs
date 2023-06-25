import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import Engine from '@/core/engine/Engine';
import FeatureFlags from '@/feature-flags';
import InputMapper from '@/core/engine/helper/InputMapper';
import MessageHandler from '@/core/engine/messages/MessageHandler';

interface WorkerContextInterface {
    canvas: OffscreenCanvas;
    config: WorldConfig;
    engine: Engine;
    features: typeof FeatureFlags;
    input: InputMapper;
    messageHandler: MessageHandler;
}

const WorkerContext: WorkerContextInterface = {
    canvas: null as unknown as OffscreenCanvas,
    config: null as unknown as WorldConfig,
    engine: null as unknown as Engine,
    features: FeatureFlags,
    input: new InputMapper(),
    messageHandler: new MessageHandler(),
};

// @ts-ignore
globalThis.__context = WorkerContext;

export default WorkerContext