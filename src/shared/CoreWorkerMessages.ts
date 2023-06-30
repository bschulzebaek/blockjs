enum CoreWorkerMessages {
    SETUP = 'core/setup',
    START = 'core/start',
    STOP = 'core/stop',
    INPUT_EVENT = 'core/input-event',
    READY = 'core/ready',
    WORLD_GENERATION_PROGRESS = 'core/generation-progress',

    CHUNK_INVALIDATE = 'chunk/invalidate',
    CHUNK_GENERATE = 'chunk/generate',

    INVENTORY_SET_INDEX = 'inventory/set-index',
    INVENTORY_TRANSFER = 'inventory/transfer',
    INVENTORY_SWAP = 'inventory/swap',
}

export default CoreWorkerMessages;