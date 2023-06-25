import { WorldConfig } from '@/core/storage/WorldConfigStorage';
import Engine from '@/core/engine/Engine';
import FeatureFlags from '@/feature-flags';
import InputMapper from '@/core/engine/helper/InputMapper';
import MessageHandler from '@/core/engine/messages/MessageHandler';

interface WorkerContextInterface {
    canvas: OffscreenCanvas | null;
    config: WorldConfig | null;
    engine: Engine | null;
    features: typeof FeatureFlags;
    input: InputMapper;
    messageHandler: MessageHandler;
}

const WorkerContext: WorkerContextInterface = {
    canvas: null,
    config: null,
    engine: null,
    features: FeatureFlags,
    input: new InputMapper(),
    messageHandler: new MessageHandler(),
};

// @ts-ignore
globalThis.__context = WorkerContext;

export default WorkerContext