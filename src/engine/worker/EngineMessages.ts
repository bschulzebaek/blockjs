enum EngineMessages {
    SETUP = 'engine/setup',
    START = 'engine/start',
    STOP = 'engine/stop',
    INPUT_EVENT = 'engine/input-event',
    READY = 'engine/ready',
    WORLD_GENERATION_PROGRESS = 'engine/generation-progress',
    TEARDOWN = 'engine/teardown',
    TEARDOWN_COMPLETE = 'engine/teardown-complete',
}

export default EngineMessages;